import express,{ Router } from "express";

import { CheckOut, allOrders ,ChangeStatus, Payments } from '../Controller/Check_Outs.js';

const AllCheckOuts  = express.Router();


//For Check OUT
AllCheckOuts.post('/check_Out',CheckOut);
AllCheckOuts.get('/orders/:orders_ID',allOrders);
AllCheckOuts.post('/edit_Status/:items_IDS',ChangeStatus);

//Payments
AllCheckOuts.post('/userPayment',Payments);

export default AllCheckOuts;