// db.js

require('dotenv').config();

const oracledb = require('oracledb');

// Function to establish database connection
async function connectToDatabase() {
  try {
    // Configure database connection
    const connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASS,
      connectString: 'localhost',
      //TNS_ADMIN: 'C:\Users\MONGA\Oracle\network\admin'
    });

    console.log('Connected to Oracle Database');
    return connection;
  } catch (error) {
    console.error('Error connecting to Oracle Database:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
