import express,{ Router } from "express";

import { userNotif, Admin_Notifications } from "../Controller/Notification.js";

const AllNotifications = express.Router();
// NOTIF
AllNotifications.get('/notifications/:notif',userNotif);
AllNotifications.get('/AdminNotif', Admin_Notifications);


export default AllNotifications;