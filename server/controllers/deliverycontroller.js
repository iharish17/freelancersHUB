import Delivery from "../models/Delivery.js";
import Order from "../models/Order.js";

export const submitDelivery = async (req, res) => {
  try {
    const { orderId, note, fileUrl } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const delivery = new Delivery({
      orderId,
      note,
      fileUrl,
      freelancerId: req.user._id,
    });

    await delivery.save();

    order.isCompleted = true;
    await order.save();

    res.status(201).json({ message: "Delivery submitted", delivery });
  } catch (error) {
    res.status(500).json({ message: "Error submitting delivery", error: error.message });
  }
};

export const getDeliveryByOrder = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId });
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch delivery", error: err.message });
  }
};