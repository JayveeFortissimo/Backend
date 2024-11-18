import db from '../Model/Database.js';

function userNotif(req,res){
    const id = +req.params.notif
    const sql = `SELECT * FROM user_notification WHERE user_ID =?`;

    db.query(sql,[id], (error,result) =>{
        if(error) return res.json("Have A Problem HEres");

        return res.json(result);
    })
}


function Admin_Notifications(req, res) {
    // Query with JOIN to get the name from credentials based on user_ID in adminnotifications
    const sql = `
        SELECT adminnotifications.*, credentials.name 
        FROM adminnotifications
        LEFT JOIN credentials ON adminnotifications.user_ID = credentials.id
    `;

    db.query(sql, (error, result) => {
        if (error) return res.json("There was a problem with the query.");
        return res.json(result);
    });
}




export {
    userNotif,
    Admin_Notifications
}