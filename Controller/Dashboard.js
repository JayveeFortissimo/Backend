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

            req.io.emit('reservationsUpdated', { totalReservations: totalCount, reservations: reservationResult });

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
    
        
            req.io.emit('TotalItems',{SumAll:result[0], INFO:results});

            return res.status(200).json({SumAll:result[0], INFO:results});
            
            
        });
    
       
    });

};


function SecurityDeposit(req, res) {
    // SQL to get Name, Security, and Code columns from payment and credentials tables
    const sqlAllData = `
        SELECT c.name AS Name, p.Security AS Security, p.code AS Code
        FROM payment p
        LEFT JOIN credentials c ON p.user_ID = c.id
    `;
    
    // SQL to calculate the total sum of the Security column in payment
    const sqlTotalSum = `SELECT SUM(Security) AS totalIncome FROM payment`;

    db.query(sqlAllData, (err, allDataResult) => {
        if (err) return res.json("Cannot fetch payment data");

        // Query for the total sum of Security column
        db.query(sqlTotalSum, (err, totalSumResult) => {
            if (err) return res.json("Cannot fetch sum of Security");

            // If there's a result for total sum, use it; otherwise, default to 0
            const totalIncome = totalSumResult[0]?.totalIncome || 0;

        req.io.emit('SecurityDeposit',{ 
        result: allDataResult, 
        TotalIncomes: totalIncome, 
        reservations: allDataResult 
    })
            return res.status(200).json({ 
                result: allDataResult, 
                TotalIncomes: totalIncome, 
                reservations: allDataResult 
            });
        });
    });
}




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

                req.io.emit('TotalUser',response)
    
                return res.status(200).json(response);
            });
        });
    }
    

    function TotalIncome(req,res){

        const sql = `SELECT Datenow AS month, SUM(payment) AS totalIncome FROM payment GROUP BY Month`;
        
        db.query(sql,(err,result)=>{
            if(err) return res.json("Cannot fetch sum of items");
            const Total = result.reduce((a,b)=> a + parseInt(b.totalIncome),0);

            req.io.emit('TotalIncome',{AllResult: result, AllTotal: Total});

            return res.status(200).json({AllResult: result, AllTotal: Total});
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

            req.io.emit('ReservationsTred',formattedResults);
    
            // Return the formatted results
            res.status(200).json(formattedResults);
        });
    }




    function payment_Status(req, res) {
        // Main query to retrieve approved items and join with credentials to get user details
        const sql = `
            SELECT approved_items.*, 
                   credentials.name 
            FROM approved_items
            LEFT JOIN credentials ON approved_items.user_ID = credentials.id
            WHERE approved_items.PD IN ('IN STORE', 'Gcash|DownPayment', 'Gcash|FullPaid')
        `;
    
        // Query to get total counts with combined down payment
        const totalSql = `
            SELECT 
                SUM(CASE WHEN PD IN ('IN STORE', 'Gcash|DownPayment') THEN 1 ELSE 0 END) AS totalDownPayment,
                SUM(CASE WHEN PD = 'Gcash|FullPaid' THEN 1 ELSE 0 END) AS totalGcashFullPaid
            FROM approved_items
        `;
    
        // Run both queries
        db.query(sql, (err, result) => {
            if (err) return res.json({ error: "HAVE A PROBLEM HERE" });
    
            // Run second query to get the totals
            db.query(totalSql, (err, totals) => {
                if (err) return res.json({ error: "HAVE A PROBLEM HERE" });
    
                // Extract unique user IDs and names
                const userIds = [...new Set(result.map(row => row.user_ID))];
                const names = [...new Set(result.map(row => row.name))];
    
                // Combine results in the desired format
                const response = {
                    user_ID: userIds,
                    names: names,
                    totalDownPayment: totals[0].totalDownPayment, 
                    totalGcashFullPaid: totals[0].totalGcashFullPaid,
                    data: result 
                };
        
                req.io.emit('PaymentStatus',response);
               
                return res.json(response);
            });
        });
    }
    
    
    function SecurityProcess(req,res){
   const {code} = req.body;
    const sql = `UPDATE payment SET Security =? WHERE code =?`;
        
   db.query(sql,[0,code],(err,result)=>{
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
                  
                req.io.emit('Today',{
                    totalReservations: totalCount,
                    reservations: reservationResult
                });


                console.log("Today event emitted with data:", {
                    totalReservations: totalCount,
                    reservations: reservationResult
                  });

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
    SecurityDeposit,
    TotalofReservation,
    TotalUser,
    TotalIncome,
    TotalCacelled,
    ReservationTrends,

    payment_Status,
    SecurityProcess,
    Today
}