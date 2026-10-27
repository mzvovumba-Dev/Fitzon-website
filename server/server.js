const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000

app.use(express.json());

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
