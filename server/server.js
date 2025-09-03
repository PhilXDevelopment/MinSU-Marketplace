// server.js
import express from "express";
import cors from "cors";
import mysql from "mysql";
import { createServer } from "http";
import { Server } from "socket.io";
import {v4 as uuidv4} from "uuid"

const app = express();
const PORT = 5000;
const uuid= uuidv4();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // change if needed
  password: "",     // add password if set
  database: "minsuapp"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ MySQL connected");
});



app.post("/register", (req, res) => {
  const {
    firstname,
    middlename,
    lastname,
    gender,
    birthday,
    email,
    password,
  } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "⚠️ Required fields missing" });
  }

  const accountId = uuidv4(); 

  const sql = `INSERT INTO accounts 
    (account_id, firstname, middlename, lastname, gender, birthday, email, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [accountId, firstname, middlename, lastname, gender, birthday, email, password],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting:", err);
        return res.status(500).json({ message: "❌ Database error" });
      }
      res.status(200).json({
        message: "✅ User registered successfully!",
        account_id: accountId, 
      });
    }
  );
});


const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    console.log("📩 Message received:", msg);
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Start server
httpServer.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
