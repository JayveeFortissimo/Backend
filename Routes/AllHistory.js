import express,{ Router } from "express";


import {to_History,remove,getAllhistory} from "../Controller/History.js";


const AllComplete  = express.Router();
AllComplete.post('/to_History',to_History);
AllComplete.delete('/itemsRemoved/:proID',remove);
AllComplete.get('/AllHistory/:user_ID',getAllhistory);


export default AllComplete;