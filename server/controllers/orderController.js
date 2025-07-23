import Order from "../models/Order.js";
import Gig from "../models/Gig.js";

// ✅ Create Order
export const createOrder = async (req, res) => {
  try {
    const gig = await Gig.findById(req.body.gigId);
    if (!gig) return res.status(404).json({ msg: "Gig not found" });

    // Prevent ordering own gig
    if (gig.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: "You cannot order your own gig." });
    }

    const newOrder = new Order({
      gigId: gig._id,
      clientId: req.user._id,
      freelancerId: gig.userId,
      price: gig.price,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ msg: "Error creating order", error: err.message });
  }
};

// ✅ Get Orders for Current User
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ clientId: req.user._id }, { freelancerId: req.user._id }],
    })
      .populate("gigId", "title")
      .populate("clientId", "name")
      .populate("freelancerId", "name");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
};

// ✅ Get Dashboard Stats
export const getOrderStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    const filter =
      role === "freelancer"
        ? { freelancerId: userId }
        : { clientId: userId };

    const orders = await Order.find(filter);

    const totalOrders = orders.length;
    const totalEarnings = orders.reduce((sum, order) => sum + order.price, 0);

    res.status(200).json({
      totalOrders: totalOrders || 0,
      totalEarnings: totalEarnings || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load stats", error: error.message });
  }
};

export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    if (order.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    order.deliveryFiles = req.body.deliveryFiles || [];
    order.deliveryNote = req.body.deliveryNote || "";
    order.deliveredAt = new Date();
    order.isCompleted = true;

    await order.save();
    res.status(200).json({ msg: "Delivered successfully", order });
  } catch (error) {
    res.status(500).json({ msg: "Delivery failed", error: error.message });
  }
};