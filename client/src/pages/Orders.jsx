import React, { useEffect, useState } from "react";
import API from "../utils/api";
import DeliveryModal from "../components/DeliveryModal";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [submittedReviews, setSubmittedReviews] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDeliveryModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleReviewAdded = (gigId) => {
    setSubmittedReviews((prev) => ({ ...prev, [gigId]: true }));
    fetchOrders();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        {user?.role === "freelancer" ? "Incoming Orders" : "Your Orders"}
      </h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {orders.map((order) => {
            const gigId = order?.gigId?._id;
            const gigTitle = order?.gigId?.title || "Untitled Gig";
            const isClient = user?._id === order?.clientId?._id;
            const isFreelancer = user?._id === order?.freelancerId?._id;
            const hasReview = submittedReviews[gigId];

            return (
              <div
                key={order._id}
                className="border p-4 rounded shadow relative bg-white"
              >
                <p className="font-semibold text-indigo-700 mb-1">
                  {isClient ? `Ordered: ${gigTitle}` : `Gig: ${gigTitle}`}
                </p>

                <p className="text-sm text-gray-600">
                  {isClient
                    ? `Freelancer: ${order?.freelancerId?.name || "Unknown"}`
                    : `Client: ${order?.clientId?.name || "Unknown"}`}
                </p>

                <p className="text-sm mt-1">₹{order.price}</p>

                <p
                  className={`text-xs mt-2 font-medium ${
                    order.isCompleted ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {order.isCompleted ? "Completed" : "Pending"}
                </p>

                {/* ✅ Deliver Button (only freelancer who owns the order) */}
                {user?.role === "freelancer" &&
                  isFreelancer &&
                  !order.isCompleted && (
                    <button
                      onClick={() => openDeliveryModal(order._id)}
                      className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Deliver Work
                    </button>
                  )}

                {/* ✅ Show Deliverables */}
                {order.isCompleted && (
                  <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded">
                    <p className="text-sm font-semibold text-indigo-700">
                      Delivered Work
                    </p>

                    {order.deliveryNote && (
                      <p className="text-sm text-gray-800 mt-1">
                        <strong>Note:</strong> {order.deliveryNote}
                      </p>
                    )}

                    {order.deliveryFiles?.length > 0 && (
                      <ul className="list-disc list-inside mt-2">
                        {order.deliveryFiles.map((url, i) => (
                          <li key={i}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              View File {i + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* ✅ Review Section */}
                {order.isCompleted && (
                  <div className="mt-4">
                    {user?.role === "client" &&
                      isClient &&
                      !hasReview &&
                      gigId && (
                        <ReviewForm
                          gigId={gigId}
                          orderId={order._id}
                          onReviewAdded={() => handleReviewAdded(gigId)}
                        />
                      )}

                    {user?.role === "freelancer" &&
                      isFreelancer &&
                      gigId && <ReviewList gigId={gigId} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Delivery Modal */}
      {showModal && selectedOrderId && (
        <DeliveryModal
          orderId={selectedOrderId}
          onClose={() => setShowModal(false)}
          onDelivered={fetchOrders}
        />
      )}
    </div>
  );
};

export default Orders;
