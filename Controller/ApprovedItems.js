import db from '../Model/Database.js';

function ApprovedItems(req, res) {

  const sql = `UPDATE check_out SET status =? WHERE id =?`;
  const sql2 = `INSERT INTO user_notification(product_Name, message, user_ID, date) VALUES (?,?,?,?)`;

  const {
      product_Name,
      start_Date,
      return_Date,
      status,
      user_ID,
      picture,
      returned,
      product_ID,
  } = req.body;

  const message = "YOUR ITEM IS APPROVED";
  const date = new Date();
  const startDate = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const Starto = startDate.toLocaleDateString('en-US', options);

  db.query(sql, [status, product_ID], (err, result) => {
      if (err) {
          return res.json({ error: "Cannot push, have a problem" });
      }

      req.io.emit('newProduct', {
          id: product_ID,
          product_Name,
          start_Date,
          return_Date,
          status,
          user_ID,
          picture,
          returned,
      });
      
      req.io.emit('notification', { message, user_ID, Starto, product_Name });

      req.io.emit('EditStatus',{product_ID, status})

      db.query(sql2, [product_Name, message, user_ID, Starto], (error, result) => {
          if (error) {
              return res.json({ error: "HAVE A PROBLEM HERE" });
          }
          return res.json({ success: "Item approved and notification sent!" });
      });
  });
}

  

function DeleteApprovedItems(req,res){
    const id = +req.params.procheckID;
    
    const sql1 = `DELETE FROM check_out WHERE id =?`;
  
        db.query(sql1,[id],(errs,results)=>{
            if(errs) return res.json("Problem DELETEd");
             req.io.emit('deleteItem',{id})

            return res.status(200).json({message:"Success",deletedItem:id});
           });
    }


//GET ALL APpROVED ITEMS by users order 
function getAllApproved(req,res){

 const id = +req.params.userD;
 const sql = `SELECT * FROM check_out WHERE user_ID=?`;

db.query(sql,[id],(err,result)=>{
    if(err) return res.json("Failed");
    return res.json(result);
})

};


function pickuped(req, res) {
    const id = +req.params.prodID;
    const { Pickuped } = req.body;
  console.log(id)
  console.log(Pickuped)
    const sql = `UPDATE check_out SET Pickuped=? WHERE id=?`;

    db.query(sql, [Pickuped, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "HAVE A PROBLEM HERE" });
        }

        req.io.emit('pickup-status-updated', { prodID: id, Pickuped });
        
        // Send success response
        res.status(200).json({ message: "Pickup status updated successfully" });
    });
}



export{
    ApprovedItems,
    DeleteApprovedItems,
    getAllApproved,
    pickuped
}