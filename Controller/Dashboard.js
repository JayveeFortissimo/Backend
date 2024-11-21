import db from '../Model/Database.js';


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
    
                SELECT start_Date, COUNT(*) AS total_count
                FROM history
                GROUP BY start_Date
            ) AS combined_counts
            GROUP BY month
            ORDER BY MONTH(STR_TO_DATE(month, '%M'))
        `;
    

        db.query(sql, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            
            const formattedResults = results.map(row => ({
                Date: row.month,
                total_count: row.total_count
            }));

    
            res.status(200).json(formattedResults);
        });
    }
    

     
    function Today(req, res) {
        // Generate Filipino time directly (equivalent to Asia/Manila timezone)
        const filipinoTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    
        // Extract the date part in the YYYY-MM-DD format
        const [month, day, year] = filipinoTime.split(/[/,\s]+/); // Split into MM/DD/YYYY
        const currentDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Format as YYYY-MM-DD
    
        console.log('Generated Current Date:', currentDate); // Debug Filipino date
    
        // SQL query to fetch reservations for today
        const sql = `
            SELECT * FROM check_out WHERE Today = '${currentDate}'
        `;
    
        // SQL query to sum up quantities for today’s reservations
        const countSql = `
            SELECT COALESCE(SUM(quantity), 0) AS totalQuantity FROM check_out WHERE Today = '${currentDate}'
        `;
    
        console.log('SQL Query:', sql); // Debug query
        console.log('Count Query:', countSql); // Debug count query
    
        // Execute the first query to fetch reservation details
        db.query(sql, (err, reservationResult) => {
            if (err) {
                console.error('Error fetching reservation details:', err);
                return res.status(500).json({ error: "Cannot fetch reservation details" });
            }
    
            console.log('Reservation Result:', reservationResult); // Debug fetched reservations
    
            // Execute the second query to fetch the total quantity for today’s reservations
            db.query(countSql, (err, countResult) => {
                if (err) {
                    console.error('Error fetching reservation quantity total:', err);
                    return res.status(500).json({ error: "Cannot fetch reservation quantity total" });
                }
    
                console.log('Count Result:', countResult); // Debug count result
    
                // Get the total quantity from the query result
                const totalQuantity = countResult[0]?.totalQuantity || 0;
    
                // Send the response with total quantity and reservation details
                return res.status(200).json({
                    totalReservations: totalQuantity,
                    reservations: reservationResult
                });
            });
        });
    }
    



    function TotalofReservation(req, res) {
        const sql = `
            SELECT * FROM check_out
        `;
    
        const countSql = `
            SELECT COALESCE(SUM(quantity), 0) AS checkOutQuantityTotal
            FROM check_out
        `;
    
        db.query(sql, (err, reservationResult) => {
            if (err) {
                console.error('Error fetching reservation details:', err); // Log the error for debugging
                return res.status(500).json({ error: "Cannot fetch reservation details" });
            }
    
            db.query(countSql, (err, countResult) => {
                if (err) {
                    console.error('Error fetching reservation quantity total:', err); // Log the error for debugging
                    return res.status(500).json({ error: "Cannot fetch reservation quantity total" });
                }
    
                const totalQuantity = countResult[0].checkOutQuantityTotal || 0;
    
                return res.status(200).json({
                    totalReservations: totalQuantity,
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
  
}