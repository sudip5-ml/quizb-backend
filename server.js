// Import required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quizb_app'
});

// Test database connection
db.connect((error) => {
  if (error) {
    console.log('Database connection failed:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Route 1: Homepage
app.get('/', (req, res) => {
  res.json({ message: 'Quiz API is working!' });
});

// Route 2: Get all questions
app.get('/api/questions', (req, res) => {
  db.query('SELECT * FROM questions', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// USER REGISTRATION
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Registration failed' });
      } else {
        res.json({ message: 'User registered!', userId: results.insertId });
      }
    }
  );
});

// SAVE QUIZ RESULTS
app.post('/api/results', (req, res) => {
  const { user_id, score, category } = req.body;
  
  db.query(
    'INSERT INTO results (user_id, score, category) VALUES (?, ?, ?)',
    [user_id, score, category],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to save result' });
      } else {
        res.json({ message: 'Result saved!' });
      }
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});