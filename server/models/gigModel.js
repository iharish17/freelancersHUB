import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const LegacyGig = mongoose.model("LegacyGig", gigSchema);

export default LegacyGig;