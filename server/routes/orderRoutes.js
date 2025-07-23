import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderStats,
  deliverOrder
} from "../controllers/orderController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/stats", protect, getOrderStats);
router.put("/:id/deliver", protect, deliverOrder); 

export default router;
