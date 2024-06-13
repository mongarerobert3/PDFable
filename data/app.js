const express = require('express');
const { connectToDatabase } = require('./connection-test-app/config');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Middleware to ensure database connectivity for each request
app.use(async (req, res, next) => {
  try {
    req.connection = await connectToDatabase();
    next();
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch data from Oracle database
app.get('/api/data', async (req, res) => {
  try {
    const connection = req.connection;

    // Execute SQL query
    const result = await connection.execute("SELECT * FROM c##bank.users");

    if (result.rows.length > 0) {
      const headers = result.metaData.map(col => col.name);
      const data = result.rows;

      res.json({ headers, data });
    } else {
      console.log('No data found');
      res.json({ headers: [], data: [] });
    }
  } catch (error) {
    console.error('Error fetching data from Oracle Database:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Release connection back to the pool
    if (req.connection) {
      try {
        await req.connection.close();
        console.log('Connection returned to pool');
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
});

// Route to search transactions based on account number, start date, and end date
app.get('/api/search', async (req, res) => {
  try {
    const { account_number, start_date, end_date } = req.query;
    const connection = req.connection;

    // Validate required parameters
    if (!account_number || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Prepare SQL query with parameters
    const query = `
      SELECT t.transaction_id, t.account_id, t.transaction_type, t.amount, t.transaction_date
      FROM transactions t
      JOIN accounts a ON t.account_id = a.account_id
      WHERE a.account_number = :account_number
      AND t.transaction_date >= TO_TIMESTAMP(:start_date, 'YYYY-MM-DD HH24:MI:SS')
      AND t.transaction_date <= TO_TIMESTAMP(:end_date, 'YYYY-MM-DD HH24:MI:SS')
    `;

    // Execute SQL query with parameters
    const result = await connection.execute(query, {
      account_number,
      start_date: start_date + ' 00:00:00',
      end_date: end_date + ' 23:59:59'
    });

    if (result.rows.length > 0) {
      const headers = result.metaData.map(col => col.name); // Extract headers from metadata
      const data = result.rows;

      res.json({ headers, data }); // Send both headers and data in the response
    } else {
      console.log('No transactions found for the specified criteria');
      res.json({ headers: [], data: [] });
    }
  } catch (error) {
    console.error('Error searching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
