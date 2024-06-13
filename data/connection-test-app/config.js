const oracledb = require('oracledb');
require('dotenv').config();

let pool;

async function initDatabasePool() {
  try {
    pool = await oracledb.createPool({
      user: process.env.USER,
      password: process.env.PASS,
      connectString: process.env.CONNSTRING,
      poolMax: 10, 
      poolMin: 2,  
      poolIncrement: 2, 
      poolTimeout: 60,  
    });
    console.log('Database connection pool initialized');
  } catch (error) {
    console.error('Error initializing database connection pool:', error);
    throw error;
  }
}

async function connectToDatabase() {
  if (!pool) {
    await initDatabasePool();
  }
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    console.log('New connection retrieved from pool');
    return connection;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
