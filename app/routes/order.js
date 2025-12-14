import express from "express";
import { create_order, mypurchases } from "../controller/user_order_controller.js";

const router = express.Router();

router.post("/create", create_order);
router.post("/mypurchases", mypurchases);
export default router;
