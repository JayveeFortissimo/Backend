import mysql from 'mysql2';
import env from 'dotenv';

env.config();
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_USERPASSWORD,
    database:process.env.DB_DATABASE
});

//TRY

console.log("Host:", process.env.DB_HOST)
console.log("user:", process.env.DB_USER)
console.log("password:", process.env.DB_USERPASSWORD)
console.log("databse:",process.env.DB_DATABASE )


db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    } else {
        console.log('Connected to database!');
    }
});


export default db;
