import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    gigId: { type: mongoose.Schema.Types.ObjectId,
    ref: "Gig", 
    required: true },

    clientId: { type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true },

    freelancerId: { type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true },
    
    price: { type: Number, required: true },
    isCompleted: { type: Boolean, default: false },
    deliveryNote: { type: String },
    deliveryFiles: [{ type: String }],
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);