import express,{ Router } from "express";
import axios from 'axios';
import env from 'dotenv';
env.config();
//credentials
import { register,login,logOut, EditProfile } from "../Controller/Credentials.js";
import { usersById,allUsers, usersAdbyID} from "../Controller/Users.js";
import { verifyUser } from "../Middleware/VerifyToke.js";
// items in homepage
import { 
  allItems,
        getItemsByID,
        adminAddItems,
                uploads, 
                Delete_Items,
                      sizes,
                        updateItem,
                        getItemByID,
                                  SizeRecomend,
                                              AddCategorys,
                                              getAllCategorys,
                                  addColors,
                    addMaterials,
                    getAllColors,
                    getAllMaterials,

            DeleteCategory,
            DeleteColor,
            DeleteMaterials,

    CategoryUpdate,
    ColorUpdate,
    MaterialUpdate,

    MostPicked

    } from "../Controller/Items.js";
//cart
import { cartPush, getUserCart,ChangeQuantity,removeItems,Total,DeleteAll,DeleteDeliveryitem} from "../Controller/cart.js";
import { CheckOut, allOrders ,ChangeStatus } from '../Controller/Check_Outs.js';

//For userSizres
import { insertSizes, EditSize,getSizebyID } from "../Controller/SizingForm.js";

import { CancelledItems,GetAllCancelled, EditStatus } from '../Controller/Cancelled.js';

//In dashboard of admin
import {
  TotalItems, 
  SecurityDeposit,
   TotalofReservation, 
   TotalUser,
   TotalIncome, 
   TotalCacelled, 
   ReservationTrends,
   SecurityProcess,

   Today,
   DamageItems
  } from '../Controller/Dashboard.js';

//To History
import {to_History,remove,getAllhistory} from "../Controller/History.js";

//!APROVED
import { ApprovedItems, DeleteApprovedItems, getAllApproved, pickuped, gracePeriod} from '../Controller/ApprovedItems.js';

//mail
import {mail, ForgotPassword,  isOTP, newPassword} from "../Controller/Mailer.js";

import { sendUsermessage, getMessage, getAllMessage } from "../Controller/Message.js";

import { appointment,getAppointment, getAllAppointments, EditStatus1 } from '../Controller/Appointment.js';

import { Payments } from "../Controller/Payments.js";

import { userNotif, Admin_Notifications } from "../Controller/Notification.js";

import { RefferalPoints, RefreshPoints } from '../Controller/Points.js';

import {adminProfile} from '../Controller/AdminProfile.js';

//!!!!!!!!!ROUTESSSSSSSSSSSSSSSSSSSSSSS
const routes = express.Router();


routes.get('/AdminProfile/:adminID',adminProfile);

//POINSTS
routes.get('/allRefferer/:referrerId',RefferalPoints);
routes.delete('/Refresh/:userID',RefreshPoints);
// NOTIF
routes.get('/notifications/:notif',userNotif);
routes.get('/AdminNotif', Admin_Notifications);


//Payments
routes.post('/userPayment',Payments);

//credentials
routes.post('/register',register);
routes.post('/login', login);
routes.delete('/logOut',logOut);
routes.put('/user_can_Edit/:userProfileId',EditProfile);

//Profile
routes.get('/profile/:user_ID',verifyUser,usersById);

//AllItems   
routes.post('/Items',allItems);
routes.get('/weddingItems/:Items_ID',getItemsByID);

routes.get('/Size/:pro_ID', sizes);
routes.post('/getUserSize', SizeRecomend)
routes.post('/addCategorys', AddCategorys);
routes.post('/addColors', addColors)
routes.post('/addMaterials',addMaterials)
//!GET CAT COLOR MATERIALS
routes.get('/allCategorys',getAllCategorys);
routes.get('/allColors',getAllColors);
routes.get('/allMaterials',getAllMaterials);

//WAIT HERE
routes.get('/MostPicked',MostPicked);

//!UPDATE CATEGORYS  

routes.delete('/CategoryDelete/:proID', DeleteCategory)
routes.delete('/ColorDelete/:proID', DeleteColor)
routes.delete('/MaterialDelete/:proID', DeleteMaterials)


//!UPDATES 
routes.put('/CategoryEdit/:proID',CategoryUpdate);
routes.put('/ColorEdit/:proID',ColorUpdate);
routes.put('/MaterialEdit/:proID',MaterialUpdate);

//For cart Routes
routes.post('/toCart',cartPush);
routes.get('/getCartUser/:userID',getUserCart);
routes.post('/change_Quantity/:items_ID',ChangeQuantity);
routes.delete('/removeItems/:cartID',removeItems);
routes.get('/Total/:id_Total',Total);

routes.delete('/allDeleted/:userIDs',DeleteAll);

routes.delete('/deliveryOptionsItems',DeleteDeliveryitem);

//For Check OUT
routes.post('/check_Out',CheckOut);
routes.get('/orders/:orders_ID',allOrders);


//user Sizes ,
routes.post('/sendSize',insertSizes);
routes.get('/getSize/:userD',getSizebyID);
routes.put('/editsize/:userID',EditSize);




//!Cancelll reservation
routes.post('/cancelled',CancelledItems);
routes.get('/allCanceled/:users_ID',GetAllCancelled);
routes.put('/editStatus/:prodID',EditStatus)


//For Admin /////////////////////////////////////////////////////
routes.get('/alluser',allUsers);
routes.get('/allusers/:user_IDs',usersAdbyID);

//admin add Items
routes.post('/addItems',uploads,adminAddItems);
//!Wait pa here

routes.get('/getItemsByID/:id', getItemByID);
routes.put('/updateItem', updateItem);

routes.delete('/itemdelete/:itemD', Delete_Items);
routes.post('/edit_Status/:items_IDS',ChangeStatus);

//Dashboard of admin  

routes.get('/numberOfItems',TotalItems);
routes.get('/numbersOfPending', SecurityDeposit);
routes.get('/totalReserves',TotalofReservation);
routes.get('/totalUsers',TotalUser);
routes.get('/totalIncome',TotalIncome);
routes.get('/AllCancelled',TotalCacelled);
routes.get('/AllTrends',ReservationTrends);
routes.get('/Today',Today);
routes.put('/processSecurity',SecurityProcess);
routes.put('/DamageItems',DamageItems);



// getAllhistory
routes.post('/to_History',to_History);
routes.delete('/itemsRemoved/:proID',remove);
routes.get('/AllHistory/:user_ID',getAllhistory);

//sa may Approve e2 
routes.post('/ItemsApproved',ApprovedItems);
routes.get('/ApprovedItems/:userD',getAllApproved);
routes.delete('/removeIncheck/:procheckID',DeleteApprovedItems);

//!WAIT HERE 
routes.put('/itemPickuped/:prodID', pickuped);
routes.delete('/removeGrace/:idApprove',gracePeriod);


//For mailer     
routes.post('/email',mail);
routes.post('/ForgotPassword',ForgotPassword);
routes.post('/OTP',isOTP);
routes.put('/resetPassword',newPassword)


routes.post('/messageUser',sendUsermessage);

routes.get('/allmessage/:user_ID',getMessage);
routes.get('/getAllMessage',getAllMessage);


//Appointment 
routes.post('/Appointment', appointment);
routes.get('/appoinmentID/:userIDs',getAppointment);

routes.get('/allAppointments',getAllAppointments);
routes.put('/APPOINTMENTSTATUS/:userID', EditStatus1);


  // SA mAY SMS
  //!WAIT PA D2 d naka import yung env eh

  routes.post('/send-sms', async (req, res) => {
    const { to, message } = req.body;

    try {
        const response = await axios.post(
            process.env.URLSMS,
            {
                messages: [
                    {
                        from: 'YOUR_SENDER_ID',
                        destinations: [{ to }],
                        text: message,
                    },
                ],
            },
            {
                headers: {
                    'Authorization': `App ${process.env.APIKEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            res.status(200).json({ success: true, messageId: response.data.messages[0].messageId });
        } else {
            res.status(response.status).json({ success: false, error: response.data });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


//SPREAD SHEETS


routes.get('/proxy-image/:id', async (req, res) => {
  const imageId = req.params.id;

  try {
  
    const imageUrl = `https://drive.google.com/uc?id=${imageId}`;

    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'image/jpeg'); 

    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    res.status(500).send('Error fetching image');
  }
});


export default routes;