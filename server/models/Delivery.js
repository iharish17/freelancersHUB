import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;