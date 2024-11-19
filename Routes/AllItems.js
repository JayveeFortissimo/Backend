import express,{ Router } from "express";

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

const AllItems = express.Router();


//AllItems   
AllItems.post('/Items',allItems);
AllItems.get('/weddingItems/:Items_ID',getItemsByID);

AllItems.get('/Size/:pro_ID', sizes);
AllItems.post('/getUserSize', SizeRecomend)
AllItems.post('/addCategorys', AddCategorys);
AllItems.post('/addColors', addColors);
AllItems.post('/addMaterials',addMaterials);
//!GET CAT COLOR MATERIALS
AllItems.get('/allCategorys',getAllCategorys);
AllItems.get('/allColors',getAllColors);
AllItems.get('/allMaterials',getAllMaterials);

//WAIT HERE
AllItems.get('/MostPicked',MostPicked);

//!UPDATE CATEGORYS  

AllItems.delete('/CategoryDelete/:proID', DeleteCategory)
AllItems.delete('/ColorDelete/:proID', DeleteColor)
AllItems.delete('/MaterialDelete/:proID', DeleteMaterials)


//!UPDATES 
AllItems.put('/CategoryEdit/:proID',CategoryUpdate);
AllItems.put('/ColorEdit/:proID',ColorUpdate);
AllItems.put('/MaterialEdit/:proID',MaterialUpdate);



//admin add Items
AllItems.post('/addItems',uploads,adminAddItems);



AllItems.get('/getItemsByID/:id', getItemByID);
AllItems.put('/updateItem', updateItem);
AllItems.delete('/itemdelete/:itemD', Delete_Items);



export default AllItems;