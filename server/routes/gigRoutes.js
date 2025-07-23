import express from "express";
import {
  createGig,
  getAllGigs,
  getGig,
  getGigsByUser,
  getMyGigs,
  deleteGig,
  updateGig,
} from "../controllers/gigcontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createGig);
router.get("/", getAllGigs);
router.get("/my", protect, getMyGigs);
router.get("/:id", getGig);
router.get("/user/:userId", getGigsByUser);
router.delete("/:id", protect, deleteGig);
router.put("/:id", protect, updateGig);

export default router;