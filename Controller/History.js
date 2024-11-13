import db from '../Model/Database.js';


function to_History(req,res){
   
    const {
        product_Name,
        picture,
        start_Date,
        return_Date,
        status,
        user_ID,
        penalty,
        quantity,
        code
    } = req.body;


 const updateSql = `UPDATE payment SET payment = payment + ? WHERE code = ?`;

 const sql =  `INSERT INTO history(product_Name,picture,start_Date,return_Date,status,user_ID,penalty,quantity) VALUES (?,?,?,?,?,?,?,?)`;
 const sql2 = `INSERT INTO user_notification(product_Name, message, user_ID, date) VALUES (?,?,?,?)`;


 const message = "YOUR ITEM IS COMPLETED";
  const date = new Date();
  const startDate = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const Starto = startDate.toLocaleDateString('en-US', options);


db.query(sql,[product_Name,picture,start_Date,return_Date,status,user_ID,penalty,quantity],(err,result)=>{
  if(err) return res.status(204).json("No content");

  req.io.emit('notification', { message, user_ID, Starto, product_Name });

  db.query(sql2, [product_Name, message, user_ID, Starto], (error, result) => {
    if (error) {
        return res.json({ error: "HAVE A PROBLEM HERE" });
    }
    // Only send the final response once all operations succeed
    return res.json({ success: "Item approved and notification sent!" });
});


});

//WAIT HERE
db.query(updateSql,[penalty, code], (err,result)=>{
   if(err) res.json("HAVE A PROBLEM HERE");
});


};


function remove(req,res){
  const pro_ID = +req.params.proID;
  const sql = `DELETE FROM approved_items WHERE id=?`;

  db.query(sql,[pro_ID],(err,result)=>{
    if(err) return res.json("Have A Problems");
    
    req.io.emit('itemRemoved', pro_ID);
    return res.status(200).json("OK");
  });

};


function getAllhistory(req,res){

  const pro_ID = +req.params.user_ID;
  const sql = `SELECT * FROM history WHERE user_ID=?`;
  db.query(sql,[pro_ID],(err,result)=>{
    if(err) return res.json("Have A Problems");
    return res.status(200).json(result);
  });


}


export {
  to_History,
  remove,
  getAllhistory
};