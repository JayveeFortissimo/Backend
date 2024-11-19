import express,{ Router } from "express";

import { cartPush, getUserCart,ChangeQuantity,removeItems,Total,DeleteAll,DeleteDeliveryitem} from "../Controller/cart.js";

const AllCarts = express.Router();


//For cart AllCarts
AllCarts.post('/toCart',cartPush);
AllCarts.get('/getCartUser/:userID',getUserCart);
AllCarts.post('/change_Quantity/:items_ID',ChangeQuantity);
AllCarts.delete('/removeItems/:cartID',removeItems);
AllCarts.get('/Total/:id_Total',Total);

AllCarts.delete('/allDeleted/:userIDs',DeleteAll);

AllCarts.delete('/deliveryOptionsItems',DeleteDeliveryitem);



export default AllCarts;