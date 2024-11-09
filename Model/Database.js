import env from 'dotenv';
env.config();


import mysql from 'mysql2';

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

console.log("Myport:", process.env.PORT)
console.log("DB_HOST:", process.env.DB_HOST);   // Should print 'srv1415.hstgr.io'
console.log("DB_USER:", process.env.DB_USER);   // Should print 'u120939471_cristobal'
console.log("DB_DATABASE:", process.env.DB_DATABASE);   // Should print 'u120939471_cristobal'


db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    } else {
        console.log('Connected to database!');
    }
});


export default db;
