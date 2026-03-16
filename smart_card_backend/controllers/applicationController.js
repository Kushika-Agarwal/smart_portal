const db = require("../config/db");

exports.submitApplication = (req, res) => {

  const {
    applicationId,
    paymentTransferNo,
    urcCode,
    query
  } = req.body;

  // 🔐 Get mobile from session (secure way)
  const mobile = req.session.mobile;

  if (!mobile) {
    return res.status(401).json({
      message: "Unauthorized. Please login again."
    });
  }

  // Get email using mobile
  db.query(
    "SELECT email FROM users WHERE mobile = ?",
    [mobile],
    (err, userResult) => {

      if (err) {
        console.log("User Fetch Error:", err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (!userResult || userResult.length === 0) {
        return res.status(400).json({
          message: "User not found"
        });
      }

      const email = userResult[0].email;

      // Insert into applications table
      db.query(
        `INSERT INTO applications 
        (application_id, payment_transfer_no, urc_code, query_text, user_email) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          applicationId,
          paymentTransferNo,
          urcCode,
          query,
          email
        ],
        (err, result) => {

          if (err) {
            console.log("Insert Error:", err);
            return res.status(500).json({
              message: "Insert error"
            });
          }

          const id = result.insertId;

          // Generate Query Number
          const queryNumber = "AQS" + String(id).padStart(6, "0");

          db.query(
            "UPDATE applications SET query_number = ? WHERE id = ?",
            [queryNumber, id],
            (err) => {

              if (err) {
                console.log("Update Error:", err);
                return res.status(500).json({
                  message: "Update error"
                });
              }

              return res.json({
                success: true,
                queryNumber
              });

            }
          );

        }
      );

    }
  );
};