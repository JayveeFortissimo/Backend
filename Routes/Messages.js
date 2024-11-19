import express,{ Router } from "express";

import { sendUsermessage, getMessage, getAllMessage } from "../Controller/Message.js";

const AllMessage = express.Router();

AllMessage.post('/messageUser',sendUsermessage);
AllMessage.get('/allmessage/:user_ID',getMessage);
AllMessage.get('/getAllMessage',getAllMessage);



export default AllMessage;