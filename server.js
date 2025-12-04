// server.js
import express from "express";
import { migrate } from "./migration/migrations.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});


// (async () => {
//   try {
//     await migrate();
//     console.log("Migration completed!");
//   } catch (err) {
//     console.error("Migration error:", err);
//   }
// })();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
