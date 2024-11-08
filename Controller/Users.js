import db from '../Model/Database.js';


function usersById(req,res){

    const id = +req.params.user_ID;
    const sql = `SELECT * FROM credentials WHERE id =?`;

    db.query(sql,[id],(err,result)=>{
        if(err) return res.status(404).json("No data fetched");
        return res.status(200).json(result)
    });
};


// This is for Admin purposes
function allUsers(req,res){
 const sql = `SELECT * FROM credentials`;

 db.query(sql,(err,result)=>{
   if(err) return res.json("Cannot fetch");
   return  res.status(200).json(result)
 });

}



function usersAdbyID(req,res){
    const id = +req.params.user_IDs;
    const sql = `SELECT * FROM credentials WHERE id =?`;

    db.query(sql,[id],(err,result)=>{
        if(err) return res.status(404).json("No data fetched");
        return res.status(200).json(result)
    });
};




export{
    usersById,
    allUsers,
    usersAdbyID
}