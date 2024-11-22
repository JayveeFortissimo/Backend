import express,{ Router } from "express";


import { ApprovedItems, DeleteApprovedItems, getAllApproved, pickuped} from '../Controller/ApprovedItems.js';


const AllAprrovedItems = express.Router();

AllAprrovedItems.put('/ItemsApproved',ApprovedItems);
AllAprrovedItems.get('/ApprovedItems/:userD',getAllApproved);
AllAprrovedItems.delete('/removeIncheck/:procheckID',DeleteApprovedItems);
AllAprrovedItems.put('/itemPickuped/:prodID', pickuped);


export default AllAprrovedItems;