import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { kycprocess, showKyc } from "../controller/kyccontroller.js";

const router = express.Router();

// ------------------ ENSURE FOLDERS EXIST ------------------
const avatarDir = path.join("uploads", "avatars");
const tempDir = path.join("temp");

if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// ------------------ MULTER CONFIG ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      cb(null, avatarDir);
    } else {
      cb(null, tempDir); // KYC files temporarily saved here
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ------------------ ROUTES ------------------
router.post("/show", showKyc);
router.post("/process", kycprocess);


export default router;
