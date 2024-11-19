import express,{ Router } from "express";

import { insertSizes, EditSize,getSizebyID } from "../Controller/SizingForm.js";

const AllSizingForms = express.Router();



//user Sizes ,
AllSizingForms.post('/sendSize',insertSizes);
AllSizingForms.get('/getSize/:userD',getSizebyID);
AllSizingForms.put('/editsize/:userID',EditSize);



export default AllSizingForms;
