import express,{ Router } from "express";

//In dashboard of admin
import {
    TotalItems, 
    SecurityDeposit,
     TotalofReservation, 
     TotalUser,
     TotalCacelled, 
     ReservationTrends,
     SecurityProcess,
  
     Today,
     DamageItems
    } from '../Controller/Dashboard.js';

const DashboardAdmin  = express.Router();


//Dashboard of admin  

DashboardAdmin.get('/numberOfItems',TotalItems);
DashboardAdmin.get('/numbersOfPending', SecurityDeposit);
DashboardAdmin.get('/totalReserves',TotalofReservation);
DashboardAdmin.get('/totalUsers',TotalUser);
DashboardAdmin.get('/AllCancelled',TotalCacelled);
DashboardAdmin.get('/AllTrends',ReservationTrends);
DashboardAdmin.get('/Today',Today);
DashboardAdmin.put('/processSecurity',SecurityProcess);
DashboardAdmin.put('/DamageItems',DamageItems);



export default DashboardAdmin;