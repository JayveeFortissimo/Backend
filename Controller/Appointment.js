import db from '../Model/Database.js';

function appointment(req,res){

    const {
        date,
        time,
        fname,
        email,
        contact,
        user_ID,
        status = "Pending"
    } = req.body;

    const allData = [date,time,fname,email,contact,user_ID,status];

    const sql = `INSERT INTO fitting_appointment(date,prefer_Time,full_Name,email,number,user_ID,status)VALUES (?,?,?,?,?,?,?)`;
    const sql3 = `INSERT INTO adminnotifications(message, dates, user_ID) VALUES (?,?,?)`;

    const message = "USER BOOKED FITING APPOINTMENT";   
    const dates = new Date();
    const startDate = new Date(dates);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const Starto = startDate.toLocaleDateString('en-US', options);

  
  
    db.query(sql,allData,(err,result)=>{
   if(err) return res.json("Have A Problem");

   req.io.emit('new_appointment', { date, time, fname, email, contact, user_ID, status });

   req.io.emit('newAdminNotification', {
    message,
    date: startDate,
    user_ID: user_ID
    });

   req.io.emit('bellsDash');

   db.query(sql3, [message, Starto, user_ID], (err) => {
    if (err) return res.status(500).json("Problem with admin notification");

    return res.status(201).json("Success");

});

});

}


function getAppointment(req,res){
    const id = +req.params.userIDs;

    const sql = `SELECT * FROM fitting_appointment WHERE user_ID =?`;

    db.query(sql,[id],(err,result)=>{
        if(err) return res.json("Have A Problem");
        return res.status(201).json(result);
     });

}


function getAllAppointments(req,res){
    const sql = `SELECT * FROM fitting_appointment`;

    db.query(sql,(err,result)=>{
        if(err) return res.json("Have A Problem");
        return res.status(201).json(result);
     });
}


function EditStatus1(req,res){
    const id = +req.params.userID;
    const {status, appointmentID} = req.body;

    const sql = `UPDATE fitting_appointment SET status =? WHERE user_ID = ? AND id = ?`;
    const sql2 = `INSERT INTO user_notification(product_Name, message, user_ID, date) VALUES (?,?,?,?)`;

    const message = status;
    const product_Name = "APPOINTMENT"
    const date = new Date();
    const startDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const Starto = startDate.toLocaleDateString('en-US', options);
  

    db.query(sql,[status,id, appointmentID], (err,result)=>{
        if(err) return res.json("Have A Problem");

        req.io.emit('notification', { message, id, Starto, product_Name });
        
        db.query(sql2, [product_Name, message, id, Starto], (error, result) => {
            if (error) return res.json({ error: "HAVE A PROBLEM HERE" });
            
           

            return res.status(201).json("SUCCESS UPDATE");
        });


     });

}




export{
    appointment,
    getAppointment,
    getAllAppointments,
    EditStatus1
}