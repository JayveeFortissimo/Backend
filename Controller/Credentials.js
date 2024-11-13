import db from '../Model/Database.js';
import bcypt from 'bcrypt';
import env from 'dotenv';
import jwt from 'jsonwebtoken';
env.config();



function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000);
}

  async function register(req, res) {
  const sql = `SELECT * FROM credentials`;
  const sqlInsert = `INSERT INTO credentials(name, email, address, contact, password, is_Admin, referral_code, OTP) VALUES (?,?,?,?,?,?,?,?)`;
  const sqlInsertReferral = `INSERT INTO refferals(referrer_id, referred_id, referral_code) VALUES (?,?,?)`;

  const sqlStatus =  `UPDATE credentials SET status =? WHERE email=?`;
  const status = true;

  const { name, email, address, contact, password, is_Admin, referralCodeUsed } = req.body;
   const OTP = generateOTP();

  try {

      const hashedPassword = await bcypt.hash(password, 10);
      const adminFlag = is_Admin === true;
      const generatedReferralCode = `GOWN${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Check if email or password already exists in the database
      db.query(sql, (err, result) => {
          if (err) return res.status(500).json("An error occurred");

          const exists = result.some(existingUser => {
              return email === existingUser.email || hashedPassword === existingUser.password;
          });

          if (exists) {
              return res.status(400).json({ message: "Account already exists" });
          } else {
              // Insert the new user into the credentials table
              db.query(sqlInsert, [name, email, address, contact, hashedPassword, adminFlag, generatedReferralCode, OTP], (err, results) => {
                  if (err) return res.status(500).json("Cannot submit");

                  const newUserId = results.insertId;
                   
                  // If a referral code was used, log it in the referrals table
                  if (referralCodeUsed) {
                      db.query(`SELECT id FROM credentials WHERE referral_code = ?`, [referralCodeUsed], (err, referrerResult) => {
                          if (err) return res.status(500).json("Error finding referrer");

                          if (referrerResult.length > 0) {
                              const referrerId = referrerResult[0].id;

                              // Insert the referral relationship
                              db.query(sqlInsertReferral, [referrerId, newUserId, referralCodeUsed], (err) => {
                                  if (err) console.error("Error logging referral:", err);
                                  // ! ETO YNG BINAGO KO
                                  sendResponse(newUserId, generatedReferralCode, email);
                              });
                          } else {
                              // !ETO DEN
                              sendResponse(newUserId, generatedReferralCode, email);
                          }
                      });
                  } else {
                      // ! ETO DEN
                      sendResponse(newUserId, generatedReferralCode, email);
                  }
              });

              //!E2 pa bago QUERY NG ACTIVE
       db.query(sqlStatus,[status,email],(err,res)=>{
        if(err) return res.json("Have A Problem Here");
       })

          }
      });

  } catch (error) {
      console.log(error);
      res.status(500).json("An unexpected error occurred");
  }

  // Function to send response, ensuring it is only called once
  function sendResponse(newUserId, generatedReferralCode, email) {
     //!Eto yung binago KO
    const token = jwt.sign({id:newUserId, email:email}, process.env.ACESSTOKEN, { expiresIn: '5h' });

      res.status(201).json({
        //!Eto den
          id:{id:newUserId, token},
          message: "User registered successfully",
          referralCode: generatedReferralCode,
      });
  }
}



async function login(req,res){
  
    const { email, password } = req.body;
    const sqlALL = "SELECT * FROM credentials WHERE email = ?";

    const sqlStatus =  `UPDATE credentials SET status =? WHERE email=?`;
      const status = true;
    try {
      db.query(sqlALL, [email], async (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
  
        if (result.length === 0) {
          return res.status(404).json("Data doesn't exist");
        }
  
        const data = result[0];

        const passwordMatch = await bcypt.compare(password, data.password);
        if (!passwordMatch) {
          return res.status(401).json("Invalid credentials");
        }
       
        const token = jwt.sign({id:data.id,email: data.email}, process.env.ACESSTOKEN, { expiresIn: '5h' });
  
        setTimeout(()=>{
            return res.status(201).json({ status: 'success', email, token,uersID:data.id,is_Admin:Boolean(data.is_Admin)});
        },2000);
      
      });


       db.query(sqlStatus,[status,email],(err,res)=>{
        if(err) return res.json("Have A Problem Here");
       })


    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
 
}


//!Log OUTS
function logOut(req, res) {
  const sqlStatus = `UPDATE credentials SET status =? WHERE id=?`;
  const { ids } = req.body; 
  const status = false;


  if (!ids) {
    console.log("ID is null or undefined");
    return res.status(400).json({ message: "ID is missing" });  
  }

  db.query(sqlStatus, [status, ids], (err, stats) => {
    if (err) {
      console.log("Error updating status", err);
      return res.status(500).json("There was a problem");
    }

  res.status(200).json({ message: "Success Log out" });

  });
}


//Edit userProfile
async function EditProfile(req,res){
  const id = +req.params.userProfileId;
  
  const {name,email,address,contact,password} = req.body;

  const sql = `UPDATE credentials SET name=?, email=?, address=?, contact=?, password=? WHERE id=?`;

try{

  const password1 = await bcypt.hash(password,10);

  db.query(sql,[name,email,address,contact, password1, id], (error,result)=>{
    if(error) return res.status(500).json("Server Error" + error);

     const dataArray = [{id:id,name:name,email:email,address:address,contact:contact}]

    return res.status(201).json({message:"OK",result:dataArray})
  })
  
}catch(error){
  console.log(error);
}


}



export{
    register,
    login,
    logOut,
    EditProfile
}