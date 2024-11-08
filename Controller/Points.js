import db from '../Model/Database.js';


function RefferalPoints(req, res) {
  const referrerId = +req.params.referrerId;

  const userListQuery = `
    SELECT DISTINCT credentials.name, credentials.email
    FROM refferals
    JOIN credentials ON refferals.referred_id = credentials.id
    WHERE refferals.referrer_id = ?
  `;

  const totalCountQuery = `
    SELECT COUNT(DISTINCT refferals.referred_id) AS total_referred
    FROM refferals
    WHERE refferals.referrer_id = ?
  `;

  db.query(userListQuery, [referrerId], (err, userList) => {
    if (err) return res.status(500).json({ error: 'Error fetching referred users' });

    db.query(totalCountQuery, [referrerId], (err, totalCountResult) => {
      if (err) return res.status(500).json({ error: 'Error fetching referral count' });

      const totalReferred = totalCountResult[0].total_referred;
      res.json({ users: userList, totalReferred });
    });
  });
};


function RefreshPoints(req, res) {
  const userID = +req.params.userID;

  const sql = `DELETE FROM refferals WHERE referrer_id = ? LIMIT 5`;

  console.log("User ID:", userID);

  db.query(sql, [userID], (error, result) => {
    if (error) {
      return res.json("HAVE A PROBLEM HERE");
    }

    return res.json("SUCCESS: 5 referrals deleted");
  });
}





export {
    RefferalPoints,
    RefreshPoints
}