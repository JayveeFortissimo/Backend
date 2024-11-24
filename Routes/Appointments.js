import express,{ Router } from "express";


import { appointment,getAppointment, getAllAppointments, EditStatus1, getTimeSlotCount } from '../Controller/Appointment.js';

const AllApointments = express.Router();


//Appointment 
AllApointments.post('/Appointment', appointment);
AllApointments.get('/appoinmentID/:userIDs',getAppointment);

AllApointments.get('/allAppointments',getAllAppointments);
AllApointments.put('/APPOINTMENTSTATUS/:userID', EditStatus1);


AllApointments.get('/appointment-count', getTimeSlotCount);

export default AllApointments;