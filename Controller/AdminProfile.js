import db  from '../Model/Database.js';


function adminProfile(req,res){

const id = +req.params.adminID;

const sql = `SELECT * FROM credentials WHERE id=?`;

db.query(sql,[id],(error,ressult)=>{
if(error) return res.json("HAVE A PROBLEM HERE");

return res.json(ressult);

});

}


//WAIT HERE
function EditProfile(req,res){


}



export{
    adminProfile
}