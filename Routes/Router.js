import express,{ Router } from "express";

import userRoutes from './userRoutes.js';
import Credentialist from './Credentialis.js';
import Carts from './Carts.js';
import CheckOuts from './Checks.js';
import Approves from './Approves.js';
import Appointments from './Appointments.js';
import AllPoints from './AllPoints.js';
import AllNotif from './AllNotif.js';
import AllItems from './AllItems.js';
import AllHistory from './AllHistory.js';
import AllCancel from './AllCancelled.js';
import Dashboard from './Dashboard.js';
import Mailer from './Mailers.js';
import Messages from './Messages.js';
import Reviews from "./Reviews.js";
import SizingForms from './SizingForms.js';


const routes = express.Router();


routes.use(userRoutes);
routes.use(Credentialist);
routes.use(Carts);
routes.use(CheckOuts);
routes.use(Approves);
routes.use(Appointments);
routes.use(AllPoints);
routes.use(AllNotif);
routes.use(AllItems);
routes.use(AllHistory);
routes.use(AllCancel);
routes.use(Dashboard);
routes.use(Mailer);
routes.use(Messages);
routes.use(Reviews);
routes.use(SizingForms);

export default routes;