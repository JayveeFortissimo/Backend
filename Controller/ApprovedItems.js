import db from '../Model/Database.js';

function ApprovedItems(req, res) {
  const sql = `INSERT INTO approved_items(product_Name, start_Date, return_Date, status, user_ID, picture, returned, product_ID, Pickuped, quantity, size, subTotal, code, Today,price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
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
      statusPickuped,
      quantity,
      size,
      subTotal,
      code,
      Today,
      price
  } = req.body;

  const message = "YOUR ITEM IS APPROVED";
  const date = new Date();
  const startDate = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const Starto = startDate.toLocaleDateString('en-US', options);

  db.query(sql, [product_Name, start_Date, return_Date, status, user_ID, picture, returned, product_ID, statusPickuped, quantity, size, subTotal , code, Today, price], (err, result) => {
      if (err) {
          return res.json({ error: "Cannot push, have a problem" });
      }

      // Emit the event after all queries succeed
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


      // Now we can safely run the second query
      db.query(sql2, [product_Name, message, user_ID, Starto], (error, result) => {
          if (error) {
              return res.json({ error: "HAVE A PROBLEM HERE" });
          }
          // Only send the final response once all operations succeed
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
 const sql = `SELECT * FROM approved_items WHERE user_ID=?`;

db.query(sql,[id],(err,result)=>{
    if(err) return res.json("Failed");
    return res.json(result);
})

};


//! is pickuped by admin

function pickuped(req,res){

    const id = +req.params.prodID;
   const { Pickuped, total, code } = req.body;

    const sql = `UPDATE approved_items SET Pickuped=? WHERE id=?`;
    const sql1 = `UPDATE payment SET payment =? WHERE code =?`;
    
    db.query(sql,[Pickuped , id],(err, result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");

    req.io.emit('pickup-status-updated', { prodID: id, Pickuped });

    db.query(sql1,[total, code],(error,result)=>{
        if(err) res.jsoon("Have A Problem");
        return res.json("Succcess");
    })

    });

};



export{
    ApprovedItems,
    DeleteApprovedItems,
    getAllApproved,
    pickuped
}