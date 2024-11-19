import db from '../Model/Database.js';

//!NOTSURE PA D2 DAT AFTER APPROVE TSAKA lAG SYA MAG COCOUNT
function TotalofReservation(req, res) {
    const sql = `
        SELECT 
            a.product_ID AS ItemID, 
            a.product_Name, 
            a.user_ID AS CustomerID, 
            a.start_Date AS StartDate, 
            a.return_Date AS ExpectedReturnDate, 
            a.status, 
            a.quantity,
            a.picture,
            'Approved' AS ReservationType,
            c.name  
        FROM approved_items a
        JOIN credentials c ON a.user_ID = c.id  
        UNION ALL
        SELECT 
            c.item_id AS ItemID, 
            c.product_Name, 
            c.user_ID AS CustomerID, 
            c.start_Date AS StartDate, 
            c.return_Date AS ExpectedReturnDate, 
            c.status, 
            c.quantity,
            c.picture,
            'Checked Out' AS ReservationType,
            cc.name  
        FROM check_out c
        JOIN credentials cc ON c.user_ID = cc.id  
    `;

    const countSql = `
        SELECT 
            (SELECT COUNT(*) FROM approved_items) AS approvedCount,
            (SELECT COUNT(*) FROM check_out) AS checkOutCount
    `;

    db.query(sql, (err, reservationResult) => {
        if (err) {
            console.error('Error fetching reservation details:', err); // Log the error for debugging
            return res.status(500).json({ error: "Cannot fetch reservation details" });
        }

        db.query(countSql, (err, countResult) => {
            if (err) {
                console.error('Error fetching reservation count:', err); // Log the error for debugging
                return res.status(500).json({ error: "Cannot fetch reservation count" });
            }

            const totalCount = countResult[0].approvedCount + countResult[0].checkOutCount;

            return res.status(200).json({
                totalReservations: totalCount,
                reservations: reservationResult
            });
        });
    });
}




function TotalItems(req, res) {
    const sql = `SELECT SUM(quantity) AS totalQuantity FROM size_table`;

    const sqls = `
    SELECT 
        items.*, 
        size_table.sizes, 
        size_table.quantity 
    FROM items 
    LEFT JOIN size_table 
    ON items.id = size_table.item_id
`;

    db.query(sql, (err, result) => {
        if (err) return res.json("Cannot fetch sum of items");

        db.query(sqls, (err, results) => {
            if (err) return res.json("Cannot fetch sum of items");
    
            return res.status(200).json({SumAll:result[0], INFO:results});
            
        });
    
       
    });

};




    function TotalUser(req, res) {
    
        const countSql = `SELECT COUNT(name) AS totalUser FROM credentials WHERE is_Admin = 0`;
      
        const usersSql = `SELECT * FROM credentials WHERE is_Admin = 0`;
    
        db.query(countSql, (err, countResult) => {
            if (err) return res.json("Cannot fetch sum of items");
    
            
            db.query(usersSql, (err, usersResult) => {
                if (err) return res.json("Cannot fetch users");
    
                const response = {
                    totalUser: countResult[0].totalUser,
                    users: usersResult
                };

             
    
                return res.status(200).json(response);
            });
        });
    }
    


    function  TotalCacelled(req, res) {
        // Fetch details from both the 'cancelled' table and the 'credentials' table using a join
        const sql = `
          SELECT c.*, cr.name, 
          (SELECT COUNT(*) FROM cancelled) AS totalCancelled 
          FROM cancelled c
          LEFT JOIN credentials cr ON c.user_id = cr.id
        `;
        
        db.query(sql, (err, result) => {
          if (err) return res.status(500).json("Cannot fetch cancelled items");

          req.io.emit('TotalCancelled',{
            totalCancelled: result.length,
            cancelledDetails: result,
          });

          return res.status(200).json({
            totalCancelled: result.length,
            cancelledDetails: result,
          });
        });
      }


      function ReservationTrends(req, res) {
        const sql = `
            SELECT DATE_FORMAT(start_Date, '%M') AS month, SUM(total_count) AS total_count
            FROM (
                SELECT start_Date, COUNT(*) AS total_count
                FROM check_out
                GROUP BY start_Date
    
                UNION ALL
                
                SELECT start_date, COUNT(*) AS total_count
                FROM approved_items
                GROUP BY start_Date
    
                UNION ALL
    
                SELECT start_Date, COUNT(*) AS total_count
                FROM history
                GROUP BY start_Date
            ) AS combined_counts
            GROUP BY month
            ORDER BY MONTH(STR_TO_DATE(month, '%M'))
        `;
    
        // Execute the query
        db.query(sql, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            
            // Format results into the desired structure
            const formattedResults = results.map(row => ({
                Date: row.month,
                total_count: row.total_count
            }));

    
            // Return the formatted results
            res.status(200).json(formattedResults);
        });
    }
    

    function DamageItems(req,res){
        const {code, date} = req.body;
         const sql = `UPDATE payment SET Datenow =? WHERE code =?`;
             
        db.query(sql,[date,code],(err,result)=>{
         if(err) return res.json("HAVE A PROBLEM HERE");
     
         req.io.emit("securityUpdated", { code, Security: 0 });
     
             return res.json("OK")
        })
     
         }
     


    //Reserves Today

    function Today(req, res) {
    
        const singaporeTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
        const currentDate = new Date(singaporeTime).toISOString().split('T')[0];
    
        const sql = `
            SELECT 
                a.product_ID AS ItemID, 
                a.product_Name, 
                a.user_ID AS CustomerID, 
                a.start_Date AS StartDate, 
                a.return_Date AS ExpectedReturnDate, 
                a.status, 
                a.quantity,
                a.picture,
                'Approved' AS ReservationType,
                c.name,
                a.Today
            FROM approved_items a
            JOIN credentials c ON a.user_ID = c.id  
            WHERE DATE(a.Today) = '${currentDate}'
            
            UNION ALL
            
            SELECT 
                c.item_id AS ItemID, 
                c.product_Name, 
                c.user_ID AS CustomerID, 
                c.start_Date AS StartDate, 
                c.return_Date AS ExpectedReturnDate, 
                c.status, 
                c.quantity,
                c.picture,
                'Checked Out' AS ReservationType,
                cc.name,
                c.Today
            FROM check_out c
            JOIN credentials cc ON c.user_ID = cc.id  
            WHERE DATE(c.Today) = '${currentDate}'
        `;
    
        // SQL query to fetch counts of approved and check_out items for today
        const countSql = `
            SELECT 
                (SELECT COUNT(*) FROM approved_items WHERE DATE(Today) = '${currentDate}') AS approvedCount,
                (SELECT COUNT(*) FROM check_out WHERE DATE(Today) = '${currentDate}') AS checkOutCount
        `;
    
        // Execute the main SQL query to fetch reservations
        db.query(sql, (err, reservationResult) => {
            if (err) {
                console.error('Error fetching reservation details:', err);
                return res.status(500).json({ error: "Cannot fetch reservation details" });
            }
    
            // Execute the count SQL query to fetch counts of reservations
            db.query(countSql, (err, countResult) => {
                if (err) {
                    console.error('Error fetching reservation count:', err);
                    return res.status(500).json({ error: "Cannot fetch reservation count" });
                }
    
                // Calculate total reservations count
                const totalCount = (countResult[0]?.approvedCount || 0) + (countResult[0]?.checkOutCount || 0);
            

                // Return response with total count and reservation details
                return res.status(200).json({
                    totalReservations: totalCount,
                    reservations: reservationResult
                });
            });
        });
    }
    


export{
    TotalItems,
    TotalofReservation,
    TotalUser,
    TotalCacelled,
    ReservationTrends,

    Today,
    DamageItems
}