import express,{ Router } from "express";


import { ApprovedItems, DeleteApprovedItems, getAllApproved, pickuped, gracePeriod} from '../Controller/ApprovedItems.js';


const AllAprrovedItems = express.Router();



//sa may Approve e2 
AllAprrovedItems.post('/ItemsApproved',ApprovedItems);
AllAprrovedItems.get('/ApprovedItems/:userD',getAllApproved);
AllAprrovedItems.delete('/removeIncheck/:procheckID',DeleteApprovedItems);

//!WAIT HERE 
AllAprrovedItems.put('/itemPickuped/:prodID', pickuped);
AllAprrovedItems.delete('/removeGrace/:idApprove',gracePeriod);



export default AllAprrovedItems;