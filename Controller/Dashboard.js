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



function HistoryDashboard(req,res){
    
    const sql = `SELECT * FROM history`;
    db.query(sql,(err,result)=>{
      if(err) return res.json("Have A Problems");
      return res.status(200).json(result);
    });
    
  }


//!WAIT PA KO D2
function TotalIncome(req, res) {
    const sql1 = `SELECT start_Date AS month, SUM(subTotal) AS totalIncome FROM check_out WHERE status = 'Approved' GROUP BY MONTH(start_Date)`;
    const sql2 = `SELECT start_Date AS month, SUM(subTotal) AS totalIncome FROM history GROUP BY MONTH(start_Date)`;
  
    // Execute both queries in parallel
    db.query(sql1, (err1, result1) => {
      if (err1) return res.json("Cannot fetch sum of items from check_out");
  
      db.query(sql2, (err2, result2) => {
        if (err2) return res.json("Cannot fetch sum of items from history");
  
        // Merging the results from both tables by month
        const mergedResults = [...result1];
  
        result2.forEach(item2 => {
          const existingItem = mergedResults.find(item1 => item1.month === item2.month);
  
          if (existingItem) {
            existingItem.totalIncome += parseInt(item2.totalIncome); // Adding the values
          } else {
            mergedResults.push(item2); // Adding new month from history table
          }
        });
  
        // Format the month as 'Month Year' (e.g., 'December 2024')
        const formattedResults = mergedResults.map(item => {
          const date = new Date(item.month);
          const formattedMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          return {
            month: formattedMonth,
            totalIncome: item.totalIncome
          };
        });
  
        // Calculate the total income from both tables combined
        const Total = formattedResults.reduce((a, b) => a + parseInt(b.totalIncome), 0);
  
        return res.status(200).json({ AllResult: formattedResults, AllTotal: Total });
      });
    });
  }
  
  
  //!PieChart
  function PieChart(req, res) {
    const sql = `
        SELECT type, COUNT(type) AS count 
        FROM history
        GROUP BY type
    `;

    // Execute the query
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
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
    HistoryDashboard,
    TotalIncome,
    PieChart
}