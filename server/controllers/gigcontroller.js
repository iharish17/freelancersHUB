import Gig from "../models/Gig.js";
import Review from "../models/reviewModel.js";

// ✅ Create a new gig
export const createGig = async (req, res) => {
  try {
    const gig = new Gig({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      coverImage: req.body.coverImage || "",
      userId: req.user._id,
    });

    const savedGig = await gig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    res.status(500).json({ msg: "Gig creation failed", error: err.message });
  }
};

// ✅ Get all gigs with filters/sorting/pagination
export const getAllGigs = async (req, res) => {
  try {
    const {
      search,
      min,
      max,
      role,
      sort = "newest",
      page = 1,
      limit = 6,
    } = req.query;

    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by price
    if (min || max) {
      query.price = {};
      if (min) query.price.$gte = parseInt(min);
      if (max) query.price.$lte = parseInt(max);
    }

    // Filter by user role
    if (role) {
      query["userId.role"] = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let gigs = await Gig.find(query)
      .populate("userId", "name role")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Gig.countDocuments(query);

    // Sort gigs
    if (sort === "price-asc") {
      gigs.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      gigs.sort((a, b) => b.price - a.price);
    } else if (sort === "rating-desc") {
      const rated = await Promise.all(
        gigs.map(async (gig) => {
          const reviews = await Review.find({ gigId: gig._id });
          const avg =
            reviews.length > 0
              ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              : 0;
          return { gig, avg };
        })
      );
      rated.sort((a, b) => b.avg - a.avg);
      gigs = rated.map((item) => item.gig);
    } else {
      gigs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      gigs,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching gigs", error: err.message });
  }
};

export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("userId", "name role");

    if (!gig) {
      return res.status(404).json({ msg: "Gig not found" });
    }

    res.status(200).json(gig);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching gig", error: err.message });
  }
};

// ✅ Get gigs created by logged-in user
export const getMyGigs = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const gigs = await Gig.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gigs", error: error.message });
  }
};

// ✅ Get gigs by any public user
export const getGigsByUser = async (req, res) => {
  try {
    const gigs = await Gig.find({ userId: req.params.userId });
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gigs", error: err.message });
  }
};

// ✅ Update gig
export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this gig" });
    }

    const { title, description, price, coverImage } = req.body;

    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.price = price || gig.price;
    gig.coverImage = coverImage || gig.coverImage;

    const updatedGig = await gig.save();
    res.status(200).json(updatedGig);
  } catch (err) {
    res.status(500).json({ message: "Error updating gig", error: err.message });
  }
};

// ✅ Delete gig
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await gig.deleteOne();
    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting gig", error: err.message });
  }
};