import env from 'dotenv';
env.config();

import mysql from 'mysql2';


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,   
  connectionLimit: 10,     
  queueLimit: 0               
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
