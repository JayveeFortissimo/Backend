import express,{ Router } from "express";

import { CancelledItems,GetAllCancelled, EditStatus } from '../Controller/Cancelled.js';



const AllCancelled = express.Router();


//!Cancelll reservation
AllCancelled.post('/cancelled',CancelledItems);
AllCancelled.get('/allCanceled/:users_ID',GetAllCancelled);
AllCancelled.put('/editStatus/:prodID',EditStatus)


export default AllCancelled;