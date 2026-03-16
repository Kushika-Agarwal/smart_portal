const db = require("../config/db");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const SECRET = process.env.JWT_SECRET;


// ADMIN LOGIN
exports.login = (req, res) => {

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admin_users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {

      if (err)
        return res.status(500).json({ message: "Database error" });

      if (result.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const admin = result[0];

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        SECRET,
        { expiresIn: "8h" }
      );

      res.json({
        success: true,
        token
      });

    }
  );

};



// GET PENDING QUERIES
exports.getPendingQueries = (req, res) => {

  db.query(
    "SELECT * FROM applications WHERE admin_response IS NULL ORDER BY created_at DESC",
    (err, result) => {

      if (err)
        return res.status(500).json({ message: "Database error" });

      res.json(result);

    }
  );

};



// GET RESPONDED QUERIES
exports.getRespondedQueries = (req, res) => {

  db.query(
    "SELECT * FROM applications WHERE admin_response IS NOT NULL ORDER BY responded_at DESC",
    (err, result) => {

      if (err)
        return res.status(500).json({ message: "Database error" });

      res.json(result);

    }
  );

};



// SUBMIT RESPONSE


exports.submitResponse = (req, res) => {

  const { id, response } = req.body;

  // update response
  db.query(

    `UPDATE applications 
     SET admin_response=?, responded_at=NOW(), status='Responded'
     WHERE id=?`,

    [response, id],

    (err) => {

      if (err)
        return res.status(500).json({ message: "Database error" });

      // get user email and query number
      db.query(

        "SELECT user_email, query_number FROM applications WHERE id=?",

        [id],

        async (err, result) => {

          if (err || result.length === 0)
            return res.json({ success: true });

          const email = result[0].user_email;
          const queryNumber = result[0].query_number;

          try {

            await sendEmail(

              email,

              "Response to your query - Smart Card Portal",

              `Your query (${queryNumber}) has been responded.

Response:
${response}

You can login to portal for more details.`

            );

          } catch (emailErr) {

            console.log("Email error:", emailErr);

          }

          res.json({
            success: true
          });

        }

      );

    }

  );

};