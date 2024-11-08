import db from '../Model/Database.js';


function sendUsermessage(req,res){

    const {
        name,
        email,
        message,
        userID,
        sender
    } = req.body;
    
     const sql = `INSERT INTO inquire(username,email,message,user_ID,sender) VALUES(?,?,?,?,?)`;

     db.query(sql,[name,email,message,userID,sender],(err,result)=>{
        if(err) return res.json("Have A Problem");

        req.io.emit('message', {
            userID,
            sender,
            message
        });

        return res.json("Success");
     });

};



function getMessage(req,res){
    const id = +req.params.user_ID;
  console.log(id)
    const sql = `SELECT message,sender FROM inquire WHERE user_ID=?`;

    db.query(sql,[id],(err,result)=>{
        if(err) return res.json("Have A Problem");
        return res.json(result)
     });

};


//GET ALL FOR ADMIN Purposes
function getAllMessage(req,res){

    const sql = `SELECT * FROM inquire`;

    db.query(sql,(err,result)=>{
        if(err) return res.json("Have A Problem");
        return res.json(result)
     });

};


export {
    sendUsermessage,
    getMessage,
    getAllMessage
}