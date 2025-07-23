import Review from "../models/reviewModel.js";
import Order from "../models/Order.js";
import Gig from "../models/Gig.js";

export const addReview = async (req, res) => {
  try {
    const { gigId, rating, comment } = req.body;

    // Check if client has completed an order
    const ordered = await Order.findOne({
      gigId,
      clientId: req.user._id,
      isCompleted: true,
    });

    if (!ordered) {
      return res.status(403).json({ msg: "Only clients with completed orders can leave a review." });
    }

    // Check if already reviewed
    const already = await Review.findOne({ gigId, clientId: req.user._id });
    if (already) return res.status(400).json({ msg: "You already reviewed this gig." });

    const review = new Review({
      gigId,
      clientId: req.user._id,
      rating,
      comment,
    });

    await review.save();

    // Update average rating in gig
    const reviews = await Review.find({ gigId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Gig.findByIdAndUpdate(gigId, { rating: avgRating.toFixed(1) });

    res.status(201).json({ msg: "Review added", review });
  } catch (err) {
    res.status(500).json({ msg: "Failed to add review", error: err.message });
  }
};

export const getReviewsForGig = async (req, res) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId })
      .populate("clientId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch reviews", error: err.message });
  }
};