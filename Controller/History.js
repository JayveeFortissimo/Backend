import db from '../Model/Database.js';

function to_History(req, res) {
  const filipinoTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

  const [month, day, year] = filipinoTime.split(/[/,\s]+/); 
  const currentDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

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
      name,
      size,
      item_id,  
      subTotal
  } = req.body;

  const sql = `INSERT INTO history(
      product_Name, picture, start_Date, return_Date, status, user_ID, penalty, quantity, price, name, Treturns, subTotal
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const sql2 = `INSERT INTO user_notification(
      product_Name, message, user_ID, date
  ) VALUES (?, ?, ?, ?)`;

  const sql3 = `UPDATE size_table SET quantity = quantity + ? WHERE item_id = ? AND sizes = ?`;

  const message = "YOUR ITEM IS COMPLETED";
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const Starto = date.toLocaleDateString('en-US', options);

  db.query(sql, [product_Name, picture, start_Date, return_Date, status, user_ID, penalty, quantity, price, name, currentDate, subTotal], (err, result) => {
      if (err) {
          return res.status(500).json({ error: "Error inserting into history" });
      }

      req.io.emit('notification', { message, user_ID, Starto, product_Name });

      db.query(sql2, [product_Name, message, user_ID, Starto], (error, result) => {
          if (error) {
              return res.status(500).json({ error: "Error inserting into notifications" });
          }

          // Add sql3 query here to update the size_table
          db.query(sql3, [quantity, item_id, size], (err3, result3) => {
              if (err3) {
                  return res.status(500).json({ error: "Error updating size table" });
              }

              return res.json({ success: "Item approved, notification sent, and size table updated!" });
          });
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