import React from "react";
import DeliveryForm from "./DeliveryModal";

const OrderDetail = ({ orderId }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Deliver Work</h2>
      <DeliveryForm orderId={orderId} onDelivered={() => alert("Delivered!")} />
    </div>
  );
};

export default OrderDetail;