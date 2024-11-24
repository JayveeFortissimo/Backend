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
   
        const filipinoTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    
        const [month, day, year] = filipinoTime.split(/[/,\s]+/); 
        const currentDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; 
    
        const sql = `
            SELECT * FROM check_out WHERE Today = '${currentDate}'
        `;
    
        const countSql = `
            SELECT COALESCE(SUM(quantity), 0) AS totalQuantity FROM check_out WHERE Today = '${currentDate}'
        `;
    
        db.query(sql, (err, reservationResult) => {
            if (err) {
                console.error('Error fetching reservation details:', err);
                return res.status(500).json({ error: "Cannot fetch reservation details" });
            }
    
            db.query(countSql, (err, countResult) => {
                if (err) {
                    console.error('Error fetching reservation quantity total:', err);
                    return res.status(500).json({ error: "Cannot fetch reservation quantity total" });
                }
    
                console.log('Count Result:', countResult); 
    
                const totalQuantity = countResult[0]?.totalQuantity || 0;
    
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
           SELECT COALESCE(SUM(quantity), 0) AS totalQuantity FROM check_out
       `;

       db.query(sql, (err, reservationResult) => {
           if (err) {
               console.error('Error fetching reservation details:', err);
               return res.status(500).json({ error: "Cannot fetch reservation details" });
           }
   
           db.query(countSql, (err, countResult) => {
               if (err) {
                   console.error('Error fetching reservation quantity total:', err);
                   return res.status(500).json({ error: "Cannot fetch reservation quantity total" });
               }
   
               const totalQuantity = countResult[0]?.totalQuantity || 0;

               return res.status(200).json({
                   totalReservations: totalQuantity,
                   reservations: reservationResult
               });
           });
       });
 }


 function PieChart(req, res) {
    const sql = `
        SELECT type, COUNT(type) AS count 
        FROM check_out
        GROUP BY type
    `;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send("Server error");
        } else {
            res.json(results);
        }
    });
}

    


export{
    TotalItems,
    TotalofReservation,
    TotalUser,
    TotalCacelled,
    ReservationTrends,
    Today,
    PieChart
}