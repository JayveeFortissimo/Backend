import express,{ Router } from "express";


import { RefferalPoints, RefreshPoints } from '../Controller/Points.js';


const AllPoints = express.Router();

//POINSTS
AllPoints.get('/allRefferer/:referrerId',RefferalPoints);
AllPoints.delete('/Refresh/:userID',RefreshPoints);



export default AllPoints;