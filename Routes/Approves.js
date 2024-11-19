import express,{ Router } from "express";


import { ApprovedItems, DeleteApprovedItems, getAllApproved, pickuped} from '../Controller/ApprovedItems.js';


const AllAprrovedItems = express.Router();



//sa may Approve e2 
AllAprrovedItems.post('/ItemsApproved',ApprovedItems);
AllAprrovedItems.get('/ApprovedItems/:userD',getAllApproved);
AllAprrovedItems.delete('/removeIncheck/:procheckID',DeleteApprovedItems);

//!WAIT HERE 
AllAprrovedItems.put('/itemPickuped/:prodID', pickuped);


export default AllAprrovedItems;