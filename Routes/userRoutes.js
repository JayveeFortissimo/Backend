import express,{ Router } from "express";


import { usersById,allUsers, usersAdbyID, adminProfile} from "../Controller/Users.js";
import { verifyUser } from "../Middleware/VerifyToke.js";


const AllUsers = express.Router();


//Profile
AllUsers.get('/profile/:user_ID',verifyUser,usersById);
//For Admin /////////////////////////////////////////////////////
AllUsers.get('/alluser',allUsers);
AllUsers.get('/allusers/:user_IDs',usersAdbyID);
//Admin Profile
AllUsers.get('/AdminProfile/:adminID',adminProfile);



export default AllUsers;