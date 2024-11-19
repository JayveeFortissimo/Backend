import express,{ Router } from "express";

import { register,login,logOut, EditProfile } from "../Controller/Credentials.js";

const AllCredentials = express.Router();

AllCredentials.post('/register',register);
AllCredentials.post('/login', login);
AllCredentials.delete('/logOut',logOut);
AllCredentials.put('/user_can_Edit/:userProfileId',EditProfile);


export default AllCredentials;