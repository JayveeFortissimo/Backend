import mysql from 'mysql2';
import env from 'dotenv';
env.config();
const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:'',
    database:process.env.DATABASE
});

db?console.log("Connected"):console.log("not connected");


export default db;
