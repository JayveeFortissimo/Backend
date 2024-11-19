import db from '../Model/Database.js';

function CheckOut(req, res) {
    const Datas = req.body;

    const sql = `INSERT INTO check_out(picture, product_Name, size, start_Date, return_Date, price, quantity, subTotal, user_ID, status, item_id, code, Today) VALUES ?`;
    const sql2 = `UPDATE size_table SET quantity = quantity - ? WHERE item_id = ? AND sizes=?`;
    const sql3 = `INSERT INTO adminnotifications(message, dates, user_ID) VALUES (?,?,?)`;

    const message = "Have A New Reserved Items";
    const date = new Date();
    const startDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const values = Datas.map(pro => [
        pro.picture,
        pro.product_Name,
        pro.size,
        pro.start_Date,
        pro.return_Date,
        pro.price,
        pro.quantity,
        pro.subTotal,
        pro.user_ID,
        pro.status,
        pro.item_id,
        pro.code,
        pro.Today
    ]);

    // Insert check_out data
    db.query(sql, [values], (err) => {
        if (err) return res.status(500).json({ message: 'Data not submitted successfully' });

        // Emit the checkout event for admin
        req.io.emit('newCheckOut', {
            checkouts: Datas.map(pro => ({
                picture: pro.picture,
                product_Name: pro.product_Name,
                size: pro.size,
                start_Date: pro.start_Date,
                return_Date: pro.return_Date,
                price: pro.price,
                quantity: pro.quantity,
                subTotal: pro.subTotal,
                user_ID: pro.user_ID,
                status: pro.status,
            }))
        });

        let updatesDone = 0; // Track completed updates

        // Update size for each item
        Datas.forEach((pro, index) => {
            db.query(sql2, [pro.quantity, pro.item_id, pro.size], (err) => {
                if (err) console.error(`Error updating size_table for item_id ${pro.item_id}:`, err);
                
                updatesDone++; // Increment after each update

                // If all updates are done, proceed with notification
                if (updatesDone === Datas.length) {
                    // Insert admin notification
                    db.query(sql3, [message, startDate, pro.user_ID], (err) => {
                        if (err) return res.status(500).json("Problem with admin notification");

                        // Emit WebSocket notification to admin
                        req.io.emit('newAdminNotification', {
                            message,
                            date: startDate,
                            user_ID: pro.user_ID
                        });

                        req.io.emit('bellsDash');

                        return res.status(201).json("Data Submitted Successfully");
                    });
                }
            });
        });
    });
}




//Lahat ng orders ilalagay sa profile
function allOrders(req,res){
    const id = +req.params.orders_ID;
    const sql = `SELECT * FROM check_out WHERE user_ID =?`;

    db.query(sql,[id],(error,result)=>{
        if(error) return res.status(400).json("Items not Found");
        console.log(result);
        return res.json({status:200,result:result})
    });
}


///THIS IS FOR ADMINNNNN FOR CHANGE APPROVAL

function ChangeStatus(req,res){

    const id = +req.params.items_IDS;
    const {status} = req.body
    const sql = `UPDATE check_out SET status=? WHERE id=?`;

    db.query(sql,[status,id],(err,result)=>{
        if(err) return res.json("Cannot update!");
        return res.status(200).json("SUCESSFULLY EDIT")
    })


}


function Payments(req,res){

    const {DATENOW, payment, Security,  Type, user_ID, code} = req.body;
    const datas = [DATENOW,payment, Security, Type, user_ID, code];
    const sql = `INSERT INTO payment(Datenow,payment,  Security, Type, user_ID, code) VALUES (?,?,?,?,?,?)`;
 
 db.query(sql,datas,(err,result)=>{
    if(err) return res.json("Have A Problem HERE");
    return res.json("SUCCESS");
 });
    
  }
 


export{
    CheckOut,
    allOrders,
    ChangeStatus,
    Payments
}