import db from '../Model/Database.js';

function insertSizes(req,res){

const { 
    bust,
    waist,
    hips,
    height,
    weight,
    user_ID
} = req.body;

const dataSize = [bust,waist,hips,height,weight,user_ID];

const sql = `INSERT INTO sizing_form(Bust,Waist,Hips,Height, Weight,user_ID) VALUES(?,?,?,?,?,?)`;

db.query(sql,dataSize,(err,result)=>{
 if(err) return res.json("Have A Problem");
 return res.json("Success");
});

};


function getSizebyID(req,res){

    const id = +req.params.userD;
    const sql  = `SELECT * FROM sizing_form WHERE user_ID=?`;

    db.query(sql,[id],(err,result)=>{
        if(err) return res.json("Have A Problem");
        return res.json({data:result[0]});
       });

}

function EditSize(req,res){

const ID = +req.params.userID;

const { 
    bust,
    waist,
    hips,
    height,
    weight
} = req.body;

const sql =  `UPDATE sizing_form SET Bust =? , Waist =? ,Hips =? ,Height =? , Weight =? WHERE user_ID =?`;

db.query(sql,[bust, waist, hips , height, weight, ID], (err,result)=>{
   if(err) return res.json("HAVE A PROBLEM HERE");

   return res.json("SUCCESS");

});

}



export {
    insertSizes,
    EditSize,
    getSizebyID
}