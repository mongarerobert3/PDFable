require('dotenv').config();
const oracledb = require('oracledb');

async function connectToDatabase() {
  try {
    // Configure database connection
    const connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASS,
      connectString: process.env.CONNSTRING
    });

    console.log('Connected to Oracle Database');
    return connection;
  } catch (error) {
    console.error('Error connecting to Oracle Database:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
