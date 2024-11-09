import env from 'dotenv';
env.config();


import mysql from 'mysql2';

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,   // Ensure the app waits for a connection if the pool is full
  connectionLimit: 10,        // Max number of connections in the pool
  queueLimit: 0               // No limit for the query queue
});

// Example query using the pool
db.query('SELECT NOW()', (err, results) => {
  if (err) {
    console.error('Database query error:', err);
    return;
  }
  console.log('Current time from DB:', results);
});


export default db;
