import mysql from 'mysql2';
import env from 'dotenv';

env.config();


const db = mysql.createConnection({
    host:'srv1415.hstgr.io',
    user:'u120939471_cristobal',
    password:'zuQ!c|f!i2$N',
    database:'u120939471_cristobal'
});
//

console.log("Myport:", process.env.PORT)

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    } else {
        console.log('Connected to database!');
    }
});


export default db;
