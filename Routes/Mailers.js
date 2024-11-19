import express,{ Router } from "express";

//mail
import {mail, ForgotPassword, isOTP, newPassword} from "../Controller/Mailer.js";

const AllMailers = express.Router();

//For mailer     
AllMailers.post('/email',mail);
AllMailers.post('/ForgotPassword',ForgotPassword);
AllMailers.post('/OTP',isOTP);
AllMailers.put('/resetPassword',newPassword)



export default AllMailers;