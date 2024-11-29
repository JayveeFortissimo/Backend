import db from '../Model/Database.js';

function to_History(req, res) {
  const {
      product_Name,
      picture,
      start_Date,
      return_Date,
      status,
      user_ID,
      penalty,
      quantity,
      code,
      price,
      name
  } = req.body;


  const sql = `INSERT INTO history(
      product_Name, picture, start_Date, return_Date, status, user_ID, penalty, quantity, price, name
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const sql2 = `INSERT INTO user_notification(
      product_Name, message, user_ID, date
  ) VALUES (?, ?, ?, ?)`;

  const message = "YOUR ITEM IS COMPLETED";
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const Starto = date.toLocaleDateString('en-US', options);

  db.query(sql, [product_Name, picture, start_Date, return_Date, status, user_ID, penalty, quantity, price, name], (err, result) => {
      if (err) {
          return res.status(500).json({ error: "Error inserting into history" });
      }

      req.io.emit('notification', { message, user_ID, Starto, product_Name });

      db.query(sql2, [product_Name, message, user_ID, Starto], (error, result) => {
          if (error) {
              return res.status(500).json({ error: "Error inserting into notifications" });
          }

              return res.json({ success: "Item approved and notification sent!" });
       
      });
  });
}


function remove(req, res) {
  const pro_ID = +req.params.proID;
  const sql = `DELETE FROM check_out WHERE id = ?`;

  db.query(sql, [pro_ID], (err, result) => {
      if (err) {
          return res.status(500).json({ error: "Error removing item" });
      }

      req.io.emit('itemRemoved', pro_ID);
      return res.status(200).json({ success: "Item removed successfully" });
  });
}



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