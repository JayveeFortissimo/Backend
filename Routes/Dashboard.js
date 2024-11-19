import express,{ Router } from "express";

//In dashboard of admin
import {
    TotalItems, 
     TotalofReservation, 
     TotalUser,
     TotalCacelled, 
     ReservationTrends,
     Today,
     DamageItems
    } from '../Controller/Dashboard.js';

const DashboardAdmin  = express.Router();


//Dashboard of admin  

DashboardAdmin.get('/numberOfItems',TotalItems);

DashboardAdmin.get('/totalReserves',TotalofReservation);
DashboardAdmin.get('/totalUsers',TotalUser);
DashboardAdmin.get('/AllCancelled',TotalCacelled);
DashboardAdmin.get('/AllTrends',ReservationTrends);
DashboardAdmin.get('/Today',Today);

DashboardAdmin.put('/DamageItems',DamageItems);



export default DashboardAdmin;