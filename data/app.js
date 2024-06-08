// app.js

const express = require('express');
const { connectToDatabase } = require('./connection-test-app/config');

connectToDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to fetch data from Oracle database
app.get('/api/data', async (req, res) => {
  try {
    // Connect to database
    const connection = await connectToDatabase();

    // Execute SQL query
    const result = await connection.execute("SELECT * FROM robert.pension_data");

    // Release connection
    await connection.close();

    // Send query result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data from Oracle Database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});