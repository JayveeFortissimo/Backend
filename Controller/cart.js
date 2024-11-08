import db from "../Model/Database.js";

const cartPush = (req,res) =>{

    const sql = `INSERT INTO cart(product_Name,type,picture,size,start_Date,return_Date,price,originalQuantity,quantity,subTotal,user_ID,product_ID, additional) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const {
        product_Name,
        type,
        picture,
        size,
        startDate,
        returnDate,
        price,
        originalQuantity,
        quantity,
        subTotal,
        user_ID,
        product_ID,
        additional
    } = req.body;

 db.query(sql,[product_Name,type,picture,size,startDate,returnDate,price,originalQuantity,quantity,subTotal,user_ID,product_ID, additional],(err,result)=>{
    if(err) return res.json({"message":"Have A problem please check"});
    return res.status(201).json("SuccessFully item Added");
 });

};


//Get User Cart
const getUserCart = (req,res) =>{
    const id = +req.params.userID;
    const sql = "SELECT * FROM cart WHERE user_ID = ?";

    db.query(sql,[id],(err,result)=>{
       if(err) return res.status(500).json("Cannot retrived");
       return res.status(200).json(result)
    })

};

//AddQuantity
const ChangeQuantity = (req,res) =>{
    const { quantity, sub_Total } = req.body;
    const id = +req.params.items_ID;
    const sql = 'UPDATE cart SET quantity =?,subTotal = ? WHERE id = ?';

    db.query(sql,[quantity,sub_Total,id],(error,result)=>{
        if(error) return res.json({message:"Have A Problem"});

        return res.status(201).json("SuccessFull Added")
    })
}


//Delete Items

const removeItems = (req,res) =>{
    
    const id = +req.params.cartID;
  
const sql =`DELETE FROM cart WHERE id=?`;

db.query(sql,[id],(err,result)=>{
    if(err) return res.json({message:"Cannot Removed"});
    return res.json({message:"SuccessFull Removed"})
})

};



//TotalItems

const Total = (req,res) =>{
    const id = +req.params.id_Total;
    
    const sql = `SELECT SUM(subTotal) AS total FROM cart WHERE user_ID =?`;
    
    db.query(sql,[id],(error,result)=>{
    if(error) return res.json({message:"Have A Problem in Total"});
    return res.json(result);
    });
    
    }
    
    
//Delete Cart

//DElete All Cart
function DeleteAll(req,res){
    const id = +req.params.userIDs;
    const sql = `DELETE FROM cart WHERE user_ID = ?`;

    db.query(sql,[id],(err,result)=>{
        if(err) return res.status(302).json("Cannot Deleted");
        return res.status(201).json("Cart Deleted")
    });

};


//delete by items id
//!Pag aralan mo to
function DeleteDeliveryitem(req,res){
    const id = req.body.id;
    const sql = `DELETE FROM cart WHERE id IN (?)`;
      console.log("This is the id" + id)
    db.query(sql,[id],(err,result)=>{
        if(err) return res.status(302).json("Cannot Deleted");
        return res.status(201).json("Cart Deleted");
    });

};




export{
    cartPush,
    getUserCart,
    ChangeQuantity,
    removeItems,
    Total,
    DeleteAll,
    DeleteDeliveryitem

}