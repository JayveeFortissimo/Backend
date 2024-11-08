import nodemailer from 'nodemailer';
import db from '../Model/Database.js';
import bcypt from 'bcrypt';
import env from 'dotenv';
env.config();

function mail(req,res){

const {
 name,
 email,
 mobile,
 message
} = req.body;

const transporter = nodemailer.createTransport({
    
    host: 'smtp.gmail.com',
    port: 465,
    secure:true,
    auth:{
   user: process.env.USERMAIL,
   pass: process.env.PASSWORD
    }

});

const mail = {
    to:process.env.USERMAIL,
    subject: `Inquiry from ${name} (${email})`, 
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Mobile:</strong> ${mobile}</p>
           <p><strong>Message:</strong> ${message}</p>`,
    replyTo: email 
}

setTimeout(()=>{
    transporter.sendMail(mail,(err,info)=>{

        if(err) return res.json("Email cannot send");
           
        return res.json("Message succesfully send")
           
        });
},2000)

};



function ForgotPassword(req, res) {

    const { email } = req.body;

    const sql = `SELECT OTP FROM credentials WHERE email = ?`;

    db.query(sql, [email], (err, result) => {
        if (err)  return res.json("HAVE A PROBLEM HERE");
    
        if(result.length === 0){
        res.json({message: "EMAIL NOT EXIST"});
        }else{

            const otp = result[0].OTP;

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USERMAIL,
                    pass: process.env.PASSWORD
                }
            });
    
         
                const mail = {
                    to: email,
                    subject: `Hello ${email}! This is your account password`,
                    html: `
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>OTP:</strong> ${otp}</p>
                    `,
                    replyTo: email
                };
        
                transporter.sendMail(mail, (err, info) => {
                    if (err) {
                        return res.json("Email cannot be sent");
                    }
        
                    return res.json("Message successfully sent");
                });

        }
      
       
    });
}

//!NAND2 YUNG OTP VERIFICATION
function isOTP(req,res){
    const {otp} = req.body;
    const sql = `SELECT OTP FROM credentials`;

    let resultx = Number(otp.join(''));

    db.query(sql,[resultx],(err,result)=>{

    if(result.length === 0){
        console.log("NO DETECTED")
        res.json({message:"NO OTP CODE DETECTED"});
    }else{
 
        let see = false; 
          result.forEach(pro =>{
            pro.OTP === resultx? see = true : false
          })

      see? res.json({message: "OTP MATCHED", OTP:resultx}) : res.json({message: "NOT MATCHED"})
    }
    
    });

}


//D2 ko ilagay yung new password

async function newPassword(req,res){
    const {password, otp} = req.body;
   const sql = `UPDATE credentials SET password=? WHERE OTP =?`;

   try{
    
   const hashedPassword = await bcypt.hash(password, 10);
   db.query(sql,[hashedPassword, otp],(error,result)=>{
   
       if(error) return res.json("HAVE A  PROBLEM HERE");
       return res.json("SUCCESS CHANGE PASSWORD");
   })
   }catch(error){
    console.log(error);
   }
}


export{
    mail,
    ForgotPassword,
    isOTP,
    newPassword
};