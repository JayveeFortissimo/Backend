import db from '../Model/Database.js';

function CancelledItems(req, res) {
    const sql = 'INSERT INTO cancelled(picture,Name,Price,start_Date,return_Date,user_ID, quantity, Reason, status, item_id, size, code, sub_Total,Today) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const DeleteQl = 'DELETE FROM check_out WHERE user_ID = ? AND id = ?';
    const quantityBack = 'UPDATE size_table SET quantity = quantity + ? WHERE item_id = ? AND sizes = ?';
    const sql2 = 'INSERT INTO user_notification(product_Name, message, user_ID, date) VALUES (?,?,?,?)';
    const sql3 = `INSERT INTO adminnotifications(message, dates, user_ID) VALUES (?,?,?)`;

    const {
        picture,
        name,
        price,
        start_Date,
        return_Date,
        user_ID,
        quantity,
        Reason,
        status,
        item_id,
        size,
        id,
        code,
        sub_Total,
        Today
    } = req.body;

    const message = "YOUR ITEM IS CANCELLED";  
    const message2 = "USER CANCELLED ITEMS";  
    const date = new Date();
    const startDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const Starto = startDate.toLocaleDateString('en-US', options);

    db.query(sql, [picture, name, price, start_Date, return_Date, user_ID, quantity, Reason, status, item_id, size, code, sub_Total,Today], (error, result) => {
        if (error) {
            console.error("Error inserting into cancelled table:", error);
            return res.status(500).json({ error: "Cannot cancel item" });
        }

        db.query(DeleteQl, [user_ID, id], (error, result) => {
            if (error) {
                console.error("Error deleting from check_out:", error);
                return res.status(500).json({ error: "Have a problem with deletion" });
            }

            db.query(quantityBack, [quantity, item_id, size], (err, result) => {
                if (err) {
                    console.error("Error updating size_table:", err);
                    return res.status(500).json({ error: "Problem updating quantity" });
                }

                req.io.emit('canceled', { 
                    id, 
                    picture,
                    name,
                    Price:price,
                    start_Date,
                    return_Date,
                    user_ID,
                    quantity,
                    Reason,
                    status,
                    item_id,
                    size,
                    Today
                });

            
                req.io.emit('notification', { message, user_ID, Starto, name });
            
                 req.io.emit('newAdminNotification', {
                    message:message2,
                    date: Starto,
                    user_ID: user_ID
                });

                req.io.emit('bellsDash');

                db.query(sql2, [name, message, user_ID, Starto], (error, result) => {
                    if (error) {
                        console.error("Error inserting into user_notification:", error);
                        return res.json({ error: "Problem with notification" });
                    }

                     //!ADMIN NOTIFICATIONS
                    db.query(sql3, [message2, Starto, user_ID], (err) => {
                        if (err) return res.status(500).json("Problem with admin notification");

                        return res.json({ success: "Item cancelled and notification sent!" });
                   
                    });
                  
                });
            });
        });
    });
}



function GetAllCancelled(req,res){
    const id = +req.params.users_ID;
    const sql = `SELECT * FROM cancelled WHERE user_ID =?`;
   
    db.query(sql,[id],(err,result)=>{
        if(err) return res.status(500).json("Server Error");
        return res.json({message:"Success",result:result})
    })
}


export {
    CancelledItems,
    GetAllCancelled,
};