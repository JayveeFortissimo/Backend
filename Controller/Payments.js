import db from '../Model/Database.js';

 function Payments(req,res){

   const {DATENOW, payment, Security,  Type, user_ID, code} = req.body;
   const datas = [DATENOW, payment, Security, Type, user_ID, code];
   const sql = `INSERT INTO payment(Datenow, payment, Security, Type, user_ID, code) VALUES (?,?,?,?,?,?)`;

db.query(sql,datas,(err,result)=>{
   if(err) return res.json("Have A Problem HERE");

   return res.json("SUCCESS");
});
   
 }

 export{
     Payments
 }