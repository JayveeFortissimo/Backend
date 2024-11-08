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
        quantity
    } = req.body;

 const sql =  `INSERT INTO history(product_Name,picture,start_Date,return_Date,status,user_ID,penalty,quantity) VALUES (?,?,?,?,?,?,?,?)`;

db.query(sql,[product_Name,picture,start_Date,return_Date,status,user_ID,penalty,quantity],(err,result)=>{
  if(err) return res.status(204).json("No content");
  return res.status(201).json("Data Inserted Successfully");
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