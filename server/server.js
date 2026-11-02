
require('dotenv').config();

const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ==========================================
// STRIPE WEBHOOK
// Save an order after Stripe confirms payment
// ==========================================

app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type !== 'checkout.session.completed') {
      return res.json({ received: true });
    }

    const session = event.data.object;

    if (session.payment_status !== 'paid') {
      return res.json({ received: true });
    }

    // Expected reference: fitzon_USERID_PLANID
    const reference = session.client_reference_id || '';
    const match = reference.match(/^fitzon_(\d+)_(\d+)$/);

    if (!match) {
      console.error('Invalid Stripe client reference:', reference);
      return res.status(400).json({
        message: 'Invalid payment reference.',
      });
    }

    const userId = Number(match[1]);
    const planId = Number(match[2]);

    let client;

    try {
      client = await pool.connect();

      await client.query('BEGIN');

      // Prevent saving the same Stripe session twice
      const existingOrder = await client.query(
        'SELECT id FROM orders WHERE stripe_session_id = $1',
        [session.id]
      );

      if (existingOrder.rows.length > 0) {
        await client.query('COMMIT');
        return res.json({ received: true, message: 'Order already saved.' });
      }

      // Confirm that the user exists
      const userResult = await client.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found.');
      }

      // Confirm the selected membership plan
      const planResult = await client.query(
        `SELECT id, name, price_cents
         FROM membership_plans
         WHERE id = $1 AND active = TRUE`,
        [planId]
      );

      if (planResult.rows.length === 0) {
        throw new Error('Membership plan not found.');
      }

      const plan = planResult.rows[0];

      // Verify that Stripe charged the correct amount and currency
      if (
        session.amount_total !== plan.price_cents ||
        session.currency !== 'zar'
      ) {
        throw new Error('Payment amount or currency does not match the plan.');
      }

      // Create the paid order
      const orderResult = await client.query(
        `INSERT INTO orders
          (user_id, total_amount_cents, currency, status, stripe_session_id)
         VALUES ($1, $2, 'zar', 'paid', $3)
         RETURNING id`,
        [userId, plan.price_cents, session.id]
      );

      const orderId = orderResult.rows[0].id;

      // Save the purchased membership
      await client.query(
        `INSERT INTO order_items
          (order_id, membership_plan_id, quantity, unit_price_cents)
         VALUES ($1, $2, 1, $3)`,
        [orderId, plan.id, plan.price_cents]
      );

      await client.query('COMMIT');

      console.log(`Payment successful. Order ${orderId} saved.`);

      return res.json({
        received: true,
        message: 'Payment and order saved successfully.',
      });
    } catch (error) {
      if (client) {
        await client.query('ROLLBACK');
      }

      console.error('Webhook processing error:', error.message);

      return res.status(500).json({
        message: 'Unable to save the paid order.',
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

// Normal JSON middleware must come AFTER the Stripe webhook
app.use(express.json());

// ==========================================
// AUTHENTICATION
// ==========================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Please log in to continue.',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({
        message: 'Invalid or expired login session.',
      });
    }

    req.user = user;
    next();
  });
}

// ==========================================
// REGISTER
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      message: 'Account created successfully.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Registration error:', error.message);

    return res.status(500).json({
      message: 'Unable to create account right now.',
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
      message: 'Unable to log in right now.',
    });
  }
});

// ==========================================
// BACKEND TEST
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'FITZON backend is running successfully!',
  });
});

// ==========================================
// DATABASE TEST
// ==========================================

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');

    return res.json({
      message: 'FITZON database connected successfully!',
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error('Database connection error:', error.message);

    return res.status(500).json({
      message: 'Database connection failed.',
    });
  }
});

// ==========================================
// FITNESS CLASSES
// ==========================================

app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, description
       FROM classes
       ORDER BY id`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error.message);

    return res.status(500).json({
      message: 'Failed to retrieve fitness classes.',
    });
  }
});

// ==========================================
// MEMBERSHIP PLANS
// ==========================================

app.get('/api/membership-plans', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price_cents
       FROM membership_plans
       WHERE active = TRUE
       ORDER BY price_cents ASC`
    );

    return res.status(200).json({
      plans: result.rows,
    });
  } catch (error) {
    console.error('Membership plans error:', error.message);

    return res.status(500).json({
      message: 'Unable to retrieve membership plans.',
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`FITZON backend running at http://localhost:${PORT}`);
});
