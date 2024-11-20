import express,{ Router } from "express";

import { CancelledItems,GetAllCancelled } from '../Controller/Cancelled.js';

const AllCancelled = express.Router();

AllCancelled.post('/cancelled',CancelledItems);
AllCancelled.get('/allCanceled/:users_ID',GetAllCancelled);


export default AllCancelled;