import User from "../models/User.js";

// ✅ Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user", error: err.message });
  }
};

// ✅ Get user by ID (for public profile)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user", error: err.message });
  }
};

// ✅ Update freelancer profile (bio + profilePic)
// controllers/userController.js
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.bio = req.body.bio || user.bio;

    // ✅ If a new profilePic is uploaded
    if (req.file) {
      user.profilePic = req.file.path;
    }

    // ✅ If image is explicitly removed
    if (req.body.removeImage === "true") {
      user.profilePic = "";
    }

    await user.save();
    res.status(200).json({ msg: "Profile updated", user });
  } catch (err) {
    console.error("Error updating profile", err);
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};