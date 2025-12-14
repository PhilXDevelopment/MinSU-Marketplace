import express from "express";
import fs from "fs";
import path from "path";
import { product_upload } from "../middleware/product_upload.js";
import {
  addproduct,
  addtocart,
  order_bulk_action,
  likedproduct,
  productdata,
  publicdisplay,
  showproduct,
  storedata,
  viewproduct,
  showcase,
} from "../controller/user_product_controller.js";

const router = express.Router();

// Ensure folders exist
const avatarDir = path.join("uploads", "avatars");
const tempDir = path.join("temp");
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Routes
router.post("/showproduct", showproduct);
router.post("/publicdisplay", publicdisplay);
router.post("/viewproduct", viewproduct);
router.post("/store", storedata);
router.post("/addproduct", product_upload.array("images", 10), addproduct);
router.post("/addtocart", addtocart);
router.post("/likedproduct", likedproduct);



router.post("/showcase", showcase);
router.post("/productdata", productdata);
router.post("/approved-bulk-orders", order_bulk_action);




export default router;
