import express from "express";
import { addReview, getReviewsForGig } from "../controllers/reviewController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:gigId", getReviewsForGig);

export default router;
