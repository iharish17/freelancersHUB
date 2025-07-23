import React, { useState } from "react";
import API from "../utils/api";

const DeliveryModal = ({ orderId, onClose, onDelivered }) => {
  const [deliveryNote, setDeliveryNote] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // Cloudinary or Drive
  const [loading, setLoading] = useState(false);

  const handleDeliver = async () => {
    if (!orderId) return alert("Order ID is missing");

    try {
      setLoading(true);

      const response = await API.put(`/orders/${orderId}/deliver`, {
        deliveryNote,
        deliveryFiles: fileUrl ? [fileUrl] : [],
      });

      if (response.status === 200) {
        onDelivered(); 
        onClose();     
      }
    } catch (err) {
      console.error("Delivery failed", err);
      alert("Failed to deliver work.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-indigo-700">Deliver Your Work</h2>

        <textarea
          rows={4}
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
          placeholder="Write a note for your delivery (e.g., completed details)"
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />

        <input
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="Paste Drive link or Cloudinary URL"
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleDeliver}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Delivering..." : "Submit Delivery"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;