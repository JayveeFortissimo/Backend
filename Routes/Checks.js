import express,{ Router } from "express";

import { CheckOut, allOrders ,ChangeStatus} from '../Controller/Check_Outs.js';

const AllCheckOuts  = express.Router();

//For Check OUT
AllCheckOuts.post('/check_Out',CheckOut);
AllCheckOuts.get('/orders/:orders_ID',allOrders);
AllCheckOuts.post('/edit_Status/:items_IDS',ChangeStatus);


export default AllCheckOuts;