import express from "express";
import multer from "multer";
import { submitkyc } from "../controller/auth.js";

const router = express.Router();

// Simple temp upload folder
const upload = multer({ dest: "temp/" });

router.post(
  "/kyc-submit",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  submitkyc
);

export default router;
