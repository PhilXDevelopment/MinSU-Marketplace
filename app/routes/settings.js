import express from "express";
import {
  getAddress,
  addAddress,
} from "../controller/user_settings_controller.js";

const router = express.Router();

router.post("/address", getAddress);
router.post("/add", addAddress);

export default router;
