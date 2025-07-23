import express from "express";
import { submitDelivery, getDeliveryByOrder } from "../controllers/deliverycontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, submitDelivery);
router.get("/:orderId", protect, getDeliveryByOrder);

export default router;