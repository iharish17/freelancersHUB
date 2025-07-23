import { protect, verifyToken } from "../middleware/authmiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  getCurrentUser,
  updateProfile,
  getUserById
} from "../controllers/userController.js";
import router from "./authRoutes.js";

router.get("/me", protect, getCurrentUser);
router.put("/update-profile",protect,  upload.single("profilePic"), updateProfile);
router.get("/:id", getUserById);

export default router;