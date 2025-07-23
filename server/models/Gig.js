import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    coverImage: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional for future use (avg rating, etc.)
    // rating: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Gig = mongoose.models.Gig || mongoose.model("Gig", gigSchema);

export default Gig;