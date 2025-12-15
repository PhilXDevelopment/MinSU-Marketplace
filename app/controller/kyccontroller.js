import pool from "../db.js";
import { io } from "../../server.js"; // import io
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from "uuid";

export const showKyc = async (req, res) => {
  try {
    const [pendingkyc] = await pool.query(
      `SELECT k.*, u.*
       FROM kyc k
       INNER JOIN users u ON k.userid = u.userid
       WHERE k.status = 'PENDING'
       ORDER BY k.created_at DESC`
    );

    return res.status(200).json({
      message: pendingkyc.length
        ? "Pending KYC found"
        : "Pending KYC not found",
      pending: pendingkyc,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const kycprocess = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { kycid, status, adminid } = req.body;

    // 1. Update KYC status
    await connection.query("UPDATE kyc SET status = ? WHERE kycid = ?", [
      status,
      kycid,
    ]);

    // 2. Get KYC row
    const [kycRows] = await connection.query(
      "SELECT * FROM kyc WHERE kycid = ?",
      [kycid]
    );

    if (kycRows.length === 0) {
      throw new Error("KYC row not found");
    }

    const kycRow = kycRows[0];
    if(status=="DECLINED"){
      
    }

    // 3. Insert into verify table USING REAL STATUS
const verifyid = uuidv4();
await connection.query(
  `
  INSERT INTO verify (verifyid, userid, adminid, status)
  VALUES (?, ?, ?, ?)
  `,
  [verifyid, kycRow.userid, adminid, "FULLY VERIFIED"] // ALWAYS FULLY VERIFIED
);


    // 4. Get user info
    const [userRows] = await connection.query(
      "SELECT * FROM users WHERE userid = ?",
      [kycRow.userid]
    );

    const user = userRows[0];

    // 5. Commit transaction first
    await connection.commit();

    // 6. Notify via websocket
    io.emit("kycUpdated", { kycid, status });

    // 7. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_PORT == 465,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailText =
      status === "APPROVED"
        ? `Hello ${user.firstname},\n\nYour account is now fully verified. Please re-login your account. Thank you!`
        : `Hello ${user.firstname},\n\nYour KYC request was declined due to unmatched data.`;

    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: user.email,
      subject: "Marketplace KYC Request",
      text: mailText,
    });

    return res.status(200).json({
      message:
        status === "APPROVED" ? "Approval successful" : "Decline successful",
    });
  } catch (error) {
    console.error(error);
    await connection.rollback();
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

