import pool from "../db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import path from "path"; // <
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// ------------------- SIGN IN USER -------------------
export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 1. Fetch user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    const user = rows[0];

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3. Check verification token
    const [check] = await pool.query(
      `SELECT * FROM tokens 
       WHERE type = ? AND userid = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      ["ACCOUNT ACTIVATION", user.userid]
    );

    const check_verification = check[0];

    // If no verification or not USED → block login
    if (!check_verification || check_verification.status !== "USED") {
      return res.status(422).json({ message: "Please activate your account!" });
    }

    // 4. Generate login verification code
    const tokenId = uuidv4();
    const code = Math.floor(100000 + Math.random() * 900000);

    await pool.query(
      `INSERT INTO tokens (tokenid, userid, code, type, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [tokenId, user.userid, code, "LOGIN VERIFICATION", "NOT USED"]
    );

    // 5. Email sender
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_PORT == 465,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Hello ${user.firstname},\n\nYour login verification code is: ${code}\n\n`,
    });

    return res.status(200).json({
      message: "Code was sent to your email!",
    });
  } catch (err) {
    console.error("SIGN-IN ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const onsession = async (req, res) => {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({ error: "Please login first" });
    }

   const [rows] = await pool.query(
     "SELECT * FROM sessions WHERE userid = ? ORDER BY datetime DESC LIMIT 1",
     [userid]
   );


    if (rows.length === 0) {
      return res.json({ session: null, message: "No active session" });
    }
    const [userRows] = await pool.query(
      `
    SELECT 
      u.*,
      v.userid AS verify_userid,
      v.status AS verify_status,
      k.userid AS kyc_userid,
      k.front AS kyc_front,
      k.back AS kyc_back,
      k.status AS kyc_status
    FROM users u
    LEFT JOIN verify v ON u.userid = v.userid
    LEFT JOIN kyc k ON u.userid = k.userid
    WHERE u.userid = ?
`,
      [rows[0].userid]
    );


    return res.json({
      session: rows[0],
      user: userRows[0],
      message: "Session found",
    });
  } catch (error) {
    console.error("OnSession Error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};


export const logOut=async(req, res)=>{
try {
  const {userid}=req.body
      const sessionId = uuidv4();
      const datetime = new Date();
         await pool.query(
           "INSERT INTO sessions (sessionid, userid, status, datetime) VALUES (?, ?, ?, ?)",
           [sessionId, userid, "LOGGED OUT", datetime]
         );
     res.status(200).json({ message: "Server error", error: err.message });
} catch (error) {
     console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
}
}
// ------------------- CREATE USER -------------------
// ------------------- CREATE USER -------------------
export const createUser = async (req, res) => {
  try {
    const {
      firstname,
      middlename,
      lastname,
      gender,
      birthday,
      email,
      password,
      schoolid,
    } = req.body;

    let avatar = null;
    if (req.file) {
      // Ensure uploads/avatars folder exists
      const uploadDir = path.join(process.cwd(), "uploads/avatars");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      // Generate unique filename
      const filename = `${uuidv4()}_${req.file.originalname}`;
      const destPath = path.join(uploadDir, filename);

      // Move file from temp location to uploads/avatars
      fs.renameSync(req.file.path, destPath);

      // Save relative URL/path for database
      avatar = `${filename}`;
    }

    // Check required fields
    const missingFields = [];
    if (!avatar) missingFields.push("avatar");
    if (!firstname) missingFields.push("firstname");
    if (!lastname) missingFields.push("lastname");
    if (!gender) missingFields.push("gender");
    if (!birthday) missingFields.push("birthday");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    // Check if email exists
    const [exists] = await pool.query(
      "SELECT userid FROM users WHERE email = ?",
      [email]
    );
    if (exists.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userid = uuidv4();

    // Insert user into DB
    await pool.query(
      `INSERT INTO users (userid, avatar, firstname, middlename, lastname, gender, birthday, email, password, schoolid)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userid, avatar, firstname, middlename || "", lastname, gender, birthday, email, hashedPassword, schoolid || null]
    );

    // Insert terms policy
    const termsPolicyId = uuidv4();
    await pool.query(
      "INSERT INTO terms_policy (terms_policyid, userid, status) VALUES (?, ?, ?)",
      [termsPolicyId, userid, "AGREE"]
    );

    // Generate verification code and send email
    const tokenId = uuidv4();
    const code = Math.floor(100000 + Math.random() * 900000);

    await pool.query(
      "INSERT INTO tokens (tokenid, userid, code, type, status) VALUES (?, ?, ?, ?, ?)",
      [tokenId, userid, code, "ACCOUNT ACTIVATION", "NOT USED"]
    );

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_PORT == 465,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "Your Activation Code",
      text: `Hello ${firstname},\n\nYour verification code is: ${code}\n\nThank you for registering!`,
    });

    res.status(201).json({
      message: "Account created successfully! Verification code sent to your email.",
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Enter the verification code" });
    }

    // Check if code exists and is unused
    const [rows] = await pool.query(
      "SELECT * FROM tokens WHERE code = ? AND type = 'ACCOUNT ACTIVATION' AND status = 'NOT USED'",
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Invalid or already used code" });
    }

    const token = rows[0];

    // Update token status to USED
    await pool.query("UPDATE tokens SET status = 'USED' WHERE tokenid = ?", [
      token.tokenid,
    ]);

    // Create session
    const sessionId = uuidv4();
    const datetime = new Date();

    await pool.query(
      "INSERT INTO sessions (sessionid, userid, status, datetime) VALUES (?, ?, ?, ?)",
      [sessionId, token.userid, "LOGGED IN", datetime]
    );

   const [data] = await pool.query(
  "SELECT * FROM users WHERE userid = ? LIMIT 1",
  [token.userid]
);

const user = data[0]; // <--- actual user object


    res.status(200).json({
      message: "Account successfully verified!",user:user
    });
  } catch (err) {
    console.error("VERIFY USER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
     const connection = await pool.getConnection();
    const { code } = req.body;
  await connection.beginTransaction();
    if (!code) {
      return res.status(404).json({ message: "Enter the verification code" });
    }

    // Check if code exists and is unused
    const [rows] = await pool.query(
      "SELECT * FROM tokens WHERE code = ? AND type = 'LOGIN VERIFICATION' AND status = 'NOT USED'",
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Invalid or already used code" });
    }

    const token = rows[0];

    // Update token status to USED
    await pool.query("UPDATE tokens SET status = 'USED' WHERE tokenid = ?", [
      token.tokenid,
    ]);

    // Create session
    const sessionId = uuidv4();
    const datetime = new Date();

    await pool.query(
      "INSERT INTO sessions (sessionid, userid, status, datetime) VALUES (?, ?, ?, ?)",
      [sessionId, token.userid, "LOGGED IN", datetime]
    );

 const [userRows] = await pool.query(
   `
    SELECT 
      u.*,
      v.userid AS verify_userid,
      v.status AS verify_status,
      k.userid AS kyc_userid,
      k.front AS kyc_front,
      k.back AS kyc_back,
      k.status AS kyc_status
    FROM users u
    LEFT JOIN verify v ON u.userid = v.userid
    LEFT JOIN kyc k ON u.userid = k.userid
    WHERE u.userid = ?
`,
   [token.userid]
 );
    if(userRows.length==0){
      await connection.rollback();
        res.status(401).json({
          message: "Unauthorized Activity",
        });
    }

    const user=userRows[0]

    res.status(200).json({
      message: "Login successful!",user:user
    });
  } catch (err) {
    console.error("VERIFY USER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const submitkyc = async (req, res) => {
  try {
    const { userid, usertype, idno, idtype } = req.body;

    // Validate form fields
    if (!userid || !usertype || !idno || !idtype) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate files
    if (!req.files || !req.files.front || !req.files.back) {
      return res
        .status(400)
        .json({ message: "Front and back ID images are required" });
    }

    const frontFile = req.files.front[0];
    const backFile = req.files.back[0];

    // Create uploads/kyc folder if not exists
    const uploadDir = path.join(process.cwd(), "uploads/kyc");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Generate unique filenames
    const frontFilename = `${uuidv4()}_${frontFile.originalname}`;
    const backFilename = `${uuidv4()}_${backFile.originalname}`;

    // Full paths on disk
    const frontPath = path.join(uploadDir, frontFilename);
    const backPath = path.join(uploadDir, backFilename);

    // Move files from temp folder to uploads/kyc
    fs.renameSync(frontFile.path, frontPath);
    fs.renameSync(backFile.path, backPath);

    // Relative paths for database
    const frontDbPath = `uploads/kyc/${frontFilename}`;
    const backDbPath = `uploads/kyc/${backFilename}`;

    // Generate KYC ID
    const kycid = uuidv4();

    // Insert into database
    await pool.query(
      `INSERT INTO kyc (kycid, userid, usertype, idno, idtype, front, back, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        kycid,
        userid,
        usertype,
        idno,
        idtype,
        frontDbPath,
        backDbPath,
        "PENDING",
      ]
    );

 const [userRows] = await pool.query(
   `
    SELECT 
      u.*,
      v.userid AS verify_userid,
      v.status AS verify_status,
      k.userid AS kyc_userid,
      k.front AS kyc_front,
      k.back AS kyc_back,
      k.status AS kyc_status
    FROM users u
    LEFT JOIN verify v ON u.userid = v.userid
    LEFT JOIN kyc k ON u.userid = k.userid
    WHERE u.userid = ?
`,
   [userid]
 );
    const user=userRows[0]

    return res.status(200).json({ message: "KYC submitted successfully!", user });
  } catch (err) {
    console.error("SUBMIT KYC ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
