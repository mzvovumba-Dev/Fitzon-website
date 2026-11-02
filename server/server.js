const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000

// Stripe webhook: receive payment updates from Stripe
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    let event;

    // Verify that the notification really came from Stripe
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

    try {
      // Check whether Stripe confirms a completed payment
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.payment_status === 'paid') {
          const orderId = session.metadata.orderId;

          await pool.query(
            `UPDATE orders
             SET status = 'paid'
             WHERE id = $1 AND stripe_session_id = $2`,
            [orderId, session.id]
          );

          console.log(`Order ${orderId} marked as paid.`);
        }
      }

      return res.json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error.message);

      return res.status(500).json({
        message: 'Webhook processing failed.',
      });
    }
  }
);

app.use(express.json());

// Verify that a user is logged in
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

// Register a new user
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
      [normalizedEmail],
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
      [name.trim(), normalizedEmail, passwordHash],
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

// Backend test
app.get('/', (req, res) => {
  res.json({
    message: 'FITZON backend is running successfully!'
  });
});

// Database test
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');

    res.json({
      message: 'FITZON database connected successfully!',
      databaseTime: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Database connection error:', error.message);

    res.status(500).json({
      message: 'Database connection failed.'
    });
  }
});

// Get all fitness classes from PostgreSQL
app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, category, description FROM classes ORDER BY id'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error.message);

    res.status(500).json({
      message: 'Failed to retrieve fitness classes.'
    });
  }
});

// Start the backend
app.listen(PORT, () => {
  console.log(`FITZON backend running at http://localhost:${PORT}`);
});

// Log in an existing user
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
  'SELECT id, name, email, password_hash FROM users WHERE email = $1',
  [normalizedEmail],
);

if (result.rows.length === 0) {
  return res.status(401).json({
    message: 'Invalid email or password.',
  });
}

const user = result.rows[0];
const passwordMatches = await bcrypt.compare(
  password,
  user.password_hash,
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
  { expiresIn: '1d' },
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
// Create a Stripe Checkout Session
app.post('/api/checkout', authenticateToken, async (req, res) => {
  try {
    const { membershipPlanId } = req.body;
    const userId = req.user.id;

    if (!membershipPlanId) {
      return res.status(400).json({
        message: 'Please select a membership plan.',
      });
    }

    // Get the real membership price from the database
    const planResult = await pool.query(
      `SELECT id, name, description, price_cents
       FROM membership_plans
       WHERE id = $1 AND active = TRUE`,
      [membershipPlanId],
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Membership plan not found.',
      });
    }

    const plan = planResult.rows[0];

    // Create a pending order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount_cents, currency, status)
       VALUES ($1, $2, 'zar', 'pending')
       RETURNING id`,
      [userId, plan.price_cents],
    );

    const orderId = orderResult.rows[0].id;

    // Save the membership purchased
    await pool.query(
      `INSERT INTO order_items
       (order_id, membership_plan_id, quantity, unit_price_cents)
       VALUES ($1, $2, 1, $3)`,
      [orderId, plan.id, plan.price_cents],
    );

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: {
              name: `${plan.name} Membership`,
              description: plan.description,
            },
            unit_amount: plan.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: String(orderId),
        userId: String(userId),
      },
      success_url: 'http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/pricing',
    });

    // Link the Stripe session to the order
    await pool.query(
      'UPDATE orders SET stripe_session_id = $1 WHERE id = $2',
      [session.id, orderId],
    );

    return res.status(200).json({
      message: 'Checkout session created successfully.',
      checkoutUrl: session.url,
      orderId,
    });
  } catch (error) {
    console.error('Checkout error:', error.message);

    return res.status(500).json({
      message: 'Unable to start checkout.',
    });
  }
});