import express,{ Router } from "express";

//In dashboard of admin
import {
    TotalItems, 
     TotalofReservation, 
     TotalUser,
     TotalCacelled, 
     ReservationTrends,
     Today,
     HistoryDashboard,
     TotalIncome
    } from '../Controller/Dashboard.js';

const DashboardAdmin  = express.Router();

DashboardAdmin.get('/numberOfItems',TotalItems);
DashboardAdmin.get('/totalReserves',TotalofReservation);
DashboardAdmin.get('/totalUsers',TotalUser);
DashboardAdmin.get('/AllCancelled',TotalCacelled);
DashboardAdmin.get('/AllTrends',ReservationTrends);
DashboardAdmin.get('/Today',Today);
DashboardAdmin.get('/DashboardHistory',HistoryDashboard);

DashboardAdmin.get('/TotalIncome',TotalIncome);

export default DashboardAdmin;