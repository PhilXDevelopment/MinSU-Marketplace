import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createUser,
  logOut,
  signInUser,
  submitkyc,
  verifyToken,
  onsession,
  verifyUser,
} from "../controller/auth.js";

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
router.post("/signin", signInUser);
router.post("/signout", logOut);
router.post("/register", upload.single("avatar"), createUser);
router.post("/verify", verifyUser);
router.post("/onsession", onsession);
router.post("/verify-token", verifyToken);
// router.post("/check-kyc", checkkyc);

// KYC route (front and back files)
router.post(
  "/kyc-submit",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  submitkyc
);

export default router;
