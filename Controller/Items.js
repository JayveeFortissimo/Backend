import db from '../Model/Database.js';
import multer from 'multer';
import path from 'path';


function allItems(req, res) {
  const userId = req.user ? req.user.id : null; // Assuming you are using some authentication middleware

  const sqlItems = `
    SELECT 
        items.*, 
        size_table.sizes, 
        size_table.quantity, 
        size_table.Bust, 
        size_table.Waist, 
        size_table.Hips, 
        size_table.Height, 
        size_table.Weight 
    FROM items 
    LEFT JOIN size_table 
    ON items.id = size_table.item_id
  `;

  // Fetch all items if userId is null
  if (!userId) {
    db.query(sqlItems, (err, result) => {
      if (err) return res.status(500).json({ error: "Internal server error while fetching items" });
      return processItems(result, null, res);
    });
  } else {
    // Fetch items based on user sizing
    db.query(sqlItems, (err, result) => {
      if (err) return res.status(404).json("Items not found");

      let userSizing = null;

      const sqlUserSizing = `SELECT * FROM user_sizing WHERE user_ID = ?`;
      db.query(sqlUserSizing, [userId], (err, userSizingResult) => {
        if (!err && userSizingResult.length > 0) {
          userSizing = userSizingResult[0];
        }
        return processItems(result, userSizing, res);
      });
    });
  }
}

function processItems(result, userSizing, res) {
  const itemsMap = {};

  result.forEach(row => {
    const itemId = row.id;

    if (!itemsMap[itemId]) {
      itemsMap[itemId] = {
        id: row.id,
        product_Name: row.product_Name,
        price: row.price,
        image: row.image,
        gender: row.gender,
        type: row.type,
        description: row.description,
        sizes: [],
        totalQuantity: 0,
        recommendedSize: null,
        color: row.color,
        material: row.material
      };

      
    }

    if (row.sizes && row.quantity) {
      itemsMap[itemId].sizes.push({
        size: row.sizes,
        quantity: row.quantity,
        Bust: row.Bust,
        Waist: row.Waist,
        Hips: row.Hips,
        Height: row.Height,
        Weight: row.Weight
      });

      itemsMap[itemId].totalQuantity += row.quantity;
    }

    if (userSizing) {
      const recommendedSize = findBestSize(row, userSizing);
      if (recommendedSize) {
        itemsMap[itemId].recommendedSize = recommendedSize;
      }
    }
  });

  const finalResult = Object.values(itemsMap);
  return res.json({ status: 200, data: finalResult });
}

function findBestSize(row, userSizing) {
  // Define allowable differences for each measurement
  const tolerance = {
    Bust: 2,   // Allowable difference for Bust
    Waist: 2,   // Allowable difference for Waist
    Hips: 1,    // Allowable difference for Hips
    Height: 2,  // Allowable difference for Height
    Weight: 1,  // Allowable difference for Weight
  };

  // Calculate the differences
  const diffBust = Math.abs(row.Bust - userSizing.Bust);
  const diffWaist = Math.abs(row.Waist - userSizing.Waist);
  const diffHips = Math.abs(row.Hips - userSizing.Hips);
  const diffHeight = Math.abs(row.Height - userSizing.Height);
  const diffWeight = Math.abs(row.Weight - userSizing.Weight);

 
  if (
    diffBust <= tolerance.Bust &&
    diffWaist <= tolerance.Waist &&
    diffHips <= tolerance.Hips && 
    diffHeight <= tolerance.Height &&
    diffWeight <= tolerance.Weight
  ) {
    return row.sizes; 
  }

  return null; 
}

function SizeRecomend(req, res) {
  const userId = req.body.userId.id;

  const sql = `SELECT * FROM sizing_form WHERE user_ID = ?`; // Adjust this query based on your actual table structure
  db.query(sql, [userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: "User size not found" });
    }
    res.json({ data: result[0] }); // Return the user sizing data
  });
}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//THIS IS FROM Item Details

function getItemsByID(req, res) {
  const id = +req.params.Items_ID;

  const sql = "SELECT * FROM items WHERE id = ?";
  const selectImages = "SELECT picture FROM pictures WHERE product_ID = ?";

  // First query to get the item details
  db.query(sql, [id], (err, itemsResult) => {
      if (err || itemsResult.length === 0) {
          return res.status(404).json("Item not found");
      }

      // Second query to get the images related to the item
      db.query(selectImages, [id], (err, imagesResult) => {
          if (err) return res.status(500).json("Error retrieving images");

          // Add images array to the item result
          const itemWithImages = {
              ...itemsResult[0],
              images: imagesResult.map(image => image.picture)
          };

          return res.json({ status: 200, data: [itemWithImages] });
      });
  });
}



//!ISININGIT KO NA D2

function sizes(req,res){
    const pro_id = +req.params.pro_ID;

  const sql = `SELECT * FROM size_table WHERE item_id =?`;

  db.query(sql,[pro_id],(err,result)=>{
    if(err) return res.status(404).json("Items not found");
    console.log(result);
    return res.json({status:200,data:result});
})

};


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ADDD ITEMSSSSSSSS!!!!!!!!

const storage = multer.diskStorage({

  destination: function(req, file, cb) {
      cb(null, path.resolve('uploads'));
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const uploads = multer({ storage }).array('pictures', 5);

function adminAddItems(req, res) {
  const { product_Name, price, gender, type, color, material, description, sizes } = req.body;

  if (!req.files || req.files.length === 0) {
      return res.status(400).json("At least one image is required.");
  }

  const image = req.files[0].filename;

  const products = [product_Name, price, image,  gender, type, color, material, description];

  const sql = `INSERT INTO items (product_Name, price, image, gender, type, color, material, description) VALUES (?,?,?,?,?,?,?,?)`;

  db.query(sql, products, (err, result) => {
      if (err) return res.status(500).json("Cannot send items");

      const itemId = result.insertId;
      let toArraySize = JSON.parse(sizes);

      // Insert sizes
      const sizeValues = toArraySize.map(sizeObj => [
          sizeObj.size,
          sizeObj.quantity,
          itemId,
          sizeObj.bust,
          sizeObj.waist,
          sizeObj.hips,
          sizeObj.height,
          sizeObj.weight
      ]);

      const sql2 = `INSERT INTO size_table(sizes, quantity, item_id, bust, waist, hips, height, weight) VALUES ?`;

      db.query(sql2, [sizeValues], (err2) => {
          if (err2) return res.status(500).json("Cannot add sizes");

          let completedPictures = 0;
          const totalPictures = req.files.length;
 
          req.io.emit('newProduct', {
            id: itemId,
            product_Name,
            price,
            image, 
            pictures: req.files.map(file => file.filename),
            gender,
            type,
            description,
            sizes: toArraySize,
            totalQuantity: toArraySize.reduce((sum, size) => sum + size.quantity, 0)
        });


          req.files.forEach((file) => {
              const sql3 = `INSERT INTO pictures (picture, product_ID) VALUES (?, ?)`;
              const pictureValues = [file.filename, itemId];

              db.query(sql3, pictureValues, (err3) => {
                  if (err3) {
                      console.error("Error adding picture:", err3);
                      return;
                  }

                  completedPictures++;

                  // Only send response after all pictures are inserted
                  if (completedPictures === totalPictures) {
                      

                      return res.status(201).json("Item added successfully");
                  }
              });
          });
      });
  });
}


////////////////////////////////////////////////////////////////\!
  
const getItemByID = (req, res) => {
       
  const { id } = req.params;

  const itemQuery = `SELECT * FROM items WHERE id = ?`;
  const sizesQuery = `SELECT sizes, quantity, Bust, Waist, Hips, Height, Weight FROM size_table WHERE item_id = ?`;

  db.query(itemQuery, [id], (err, itemResult) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching item details" });
    }

    if (itemResult.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    db.query(sizesQuery, [id], (err, sizesResult) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching item sizes" });
      }

      const itemDetails = {
        ...itemResult[0],
        sizes: sizesResult.map(size => ({
          size: size.sizes,
          quantity: size.quantity,
          Bust: size.Bust,
           Waist:size.Waist,
            Hips:size.Hips,
             Height:size.Height, 
             Weight:size.Weight
        })),
      };
    
  
      return res.json(itemDetails);
    });
  });
};



const updateItem = (req, res) => {
  const { id, product_Name, price, gender, type, color, material, description, sizes } = req.body;
  
  const updateItemQuery = `
    UPDATE items 
    SET product_Name = ?, price = ?, gender = ?, type = ?, color = ?, material = ?, description = ? 
    WHERE id = ?
  `;

  db.query(updateItemQuery, [product_Name, price, gender, type, color, material, description, id], (err, result) => {
    if (err) {
      console.error("Error updating item details:", err);
      return res.status(500).json({ error: "Error updating item details" });
    }

    // Then, delete all existing sizes for this item
    const deleteSizesQuery = `DELETE FROM size_table WHERE item_id = ?`;

    db.query(deleteSizesQuery, [id], (err, deleteResult) => {
      if (err) {
        console.error("Error deleting old sizes:", err);
        return res.status(500).json({ error: "Error deleting old sizes" });
      }

      // Insert the new sizes
      const insertSizesQuery = `
        INSERT INTO size_table 
        (item_id, sizes, quantity, Bust, Waist, Hips, Height, Weight) 
        VALUES ?
      `;

      const sizeValues = sizes.map(size => [
        id,
        size.size,
        size.quantity,
        size.Bust || null,
        size.Waist || null,
        size.Hips || null,
        size.Height || null,
        size.Weight || null
      ]);

      db.query(insertSizesQuery, [sizeValues], (err, insertResult) => {
        if (err) {
          console.error("Error inserting new sizes:", err);
          return res.status(500).json({ error: "Error inserting new sizes" });
        }

        // Fetch the fully updated item from the database with sizes
        const fetchUpdatedItemQuery = `
          SELECT i.*, GROUP_CONCAT(st.sizes, ':', st.quantity) AS size_data
          FROM items i
          LEFT JOIN size_table st ON i.id = st.item_id
          WHERE i.id = ?
          GROUP BY i.id
        `;

        db.query(fetchUpdatedItemQuery, [id], (err, updatedItemResult) => {
          if (err) {
            console.error("Error fetching updated item details:", err);
            return res.status(500).json({ error: "Error fetching updated item details" });
          }

          if (updatedItemResult.length === 0) {
            return res.status(404).json({ error: "Updated item not found" });
          }

          const updatedItem = updatedItemResult[0];
          
          // Parse the size_data string into an array of objects
          updatedItem.sizes = updatedItem.size_data.split(',').map(sizeInfo => {
            const [size, quantity] = sizeInfo.split(':');
            return { size, quantity: parseInt(quantity) };
          });
          delete updatedItem.size_data;

          // Calculate total quantity
          updatedItem.totalQuantity = updatedItem.sizes.reduce((sum, size) => sum + size.quantity, 0);

          // Emit an 'updateProduct' event with the updated item details
          req.io.emit('updateProduct', updatedItem);

          return res.json({ message: "Item updated successfully", item: updatedItem });
        });
      });
    });
  });
};



////////////////////

  function Delete_Items(req, res) {
    const id = +req.params.itemD;
    
    const fetchItemQuery = `SELECT * FROM items WHERE id = ?`;
  
    db.query(fetchItemQuery, [id], (fetchErr, fetchResult) => {
      if (fetchErr) return res.status(500).json({ error: "Error fetching item details" });
      
      if (fetchResult.length === 0) return res.status(404).json({ error: "Item not found" });
  
      const itemToDelete = fetchResult[0];
  
      const deleteItemQuery = `DELETE FROM items WHERE id = ?`;
     const deletePicks = `DELETE FROM pictures WHERE product_ID =?`
     const deleteSizes = `DELETE FROM size_table WHERE item_id =?`

      db.query(deleteItemQuery, [id], (deleteErr, deleteResult) => {
        if (deleteErr) return res.status(500).json({ error: "Error deleting item" });
  
        req.io.emit('deleteProduct', itemToDelete);

        db.query(deletePicks, [id], (deleteErr, deleteResult) => {
          if (deleteErr) return res.status(500).json({ error: "Error deleting item" });
          
        db.query(deleteSizes, [id], (deleteErr, deleteResult) => {
          if (deleteErr) return res.status(500).json({ error: "Error deleting item" });
          
          return res.json({ message: "Item deleted successfully", deletedItem: itemToDelete });
          
        });
  
        });


      });
    });
  }





  //!ADDCATEGORYS
function AddCategorys(req,res){
   const {category} = req.body;

const sql = `INSERT INTO categorys(category) VALUES (?)`;

db.query(sql,[category],(err,result)=>{
  if(err) return res.json("HAVE A PROBLEM HERE");
  req.io.emit("newCategory", { category });
  return res.json("SUCCESS");
})
  
}

function getAllCategorys(req,res){
  const sql = `SELECT * FROM categorys`;

  db.query(sql,(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json({data:result});
  })
}


//!COLORS
function addColors(req,res){
  const {colors} = req.body;
  const sql = `INSERT INTO colors(color) VALUES(?)`
  db.query(sql,[colors],(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json("SUCCESS");
  })
}


function getAllColors(req,res){
  const sql = `SELECT * FROM colors`;

  db.query(sql,(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json({data:result});
  })
}



//!MATERIALS
function addMaterials(req,res){
  const {materials} = req.body;
  const sql = `INSERT INTO materials(material) VALUES(?)`
  db.query(sql,[materials],(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json("SUCCESS");
  })
}


function getAllMaterials(req,res){
  const sql = `SELECT * FROM materials`;

  db.query(sql,(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json({data:result});
  })
}


//!UPDATE CATEGORYS

function CategoryUpdate(req,res){
  const id = +req.params.proID;
  const {category} = req.body;
  const sql = `UPDATE categorys SET category=? WHERE id =?`;
  db.query(sql,[category, id],(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json("SUCCESS EDIT");
  })
}


function ColorUpdate(req,res){
  const id = +req.params.proID;
  const {color} = req.body;
  const sql = `UPDATE colors SET color=? WHERE id =?`;
  db.query(sql,[color,id],(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json("SUCCESS EDIT");
  })
}


function MaterialUpdate(req,res){
  const id = +req.params.proID;
  const { material } = req.body;
  const sql = `UPDATE materials SET material=? WHERE id =?`;
  db.query(sql,[material,id],(err,result)=>{
    if(err) return res.json("HAVE A PROBLEM HERE");
    return res.json("SUCCESS EDIT");
  })
}


//!DELETE CATEGORIESSS

function DeleteCategory(req,res){
  const {category} = req.body;
  const id = +req.params.proID;

  const sql = `DELETE FROM categorys WHERE id=?`;
  const sql2 = `DELETE FROM items WHERE type=?`

  db.query(sql,[id],(error,result)=>{
     if(error) return res.json("HAVE A PROBLEM HERE");

     

     db.query(sql2,[category],(err,results)=>{
      if(err) return res.json("CANNOT DELETED");
      req.io.emit('deleteCategory', { category });
      return res.json("SUCCESS");
     })
      
  })

}


function DeleteColor(req,res){
  const id = +req.params.proID;

  const sql = `DELETE FROM colors WHERE id=?`;

  db.query(sql,[id],(error,result)=>{
     if(error) return res.json("HAVE A PROBLEM HERE");
     
      return res.json("SUCCESS");
  })

}


function DeleteMaterials(req,res){
  const id = +req.params.proID;

  const sql = `DELETE FROM materials WHERE id=?`;

  db.query(sql,[id],(error,result)=>{
     if(error) return res.json("HAVE A PROBLEM HERE");
    
      return res.json("SUCCESS");
  })

}


//!!!!!!!!!!HOMEPAGE MOST PICKED ITEMSSSSS
//SA HISTORY DAPAT 2
function MostPicked(req, res) {
  const sql = `
    SELECT product_Name, picture, SUM(quantity) AS total_quantity
    FROM approved_items
    GROUP BY product_Name, picture
    ORDER BY total_quantity DESC
    LIMIT 3;
  `;

  console.log('Executing query:', sql);  // Log the query before execution
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);  // Log the error details
      return res.status(500).json({ 
        error: 'Database query error',
        details: err.message  // Include the error message for debugging
      });
    }

    if (!results || results.length === 0) {
      console.log('No results found');
      return res.status(404).json({ message: 'No most picked items found.' });
    }

    console.log('Query results:', results);  // Log the results
    res.json(results);  // Send back the data
  });
}



  export {
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
  }