import express from "express";
import authRoutes from "./app/routes/auth.js";
import kycRoutes from "./app/routes/kyc.js";
import userProductRoutes from "./app/routes/product.js";
import orderRoutes from "./app/routes/order.js";
import userSettings from "./app/routes/settings.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./app/socket.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// HTTP server
const server = http.createServer(app);

// Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, // ⚡ important for frontend
  },
});

// Initialize Socket listeners
initSocket(io);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/user-product", userProductRoutes);
app.use("/api/addresses", userSettings);
app.use("/api/order", orderRoutes);

// Test route
app.get("/", (req, res) => res.send("Server is running!"));

// Start server
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
