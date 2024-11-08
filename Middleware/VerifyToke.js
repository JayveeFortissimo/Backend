import jwt from 'jsonwebtoken';

function verifyUser(req,res,next){

    const authHeader = req.headers['authorization'];
   
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.ACESSTOKEN,(err,user)=>{
            if(err) return res.json({message:"Token not valid"});
            req.email = user;
            next();
        });
    }else{
        res.json("authenticate not found")
    }
}

export{
     verifyUser
}