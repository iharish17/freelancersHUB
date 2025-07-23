import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { FaStar } from "react-icons/fa";

const ReviewList = ({ gigId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/reviews/${gigId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Review load error", err);
      }
    };
    fetch();
  }, [gigId]);

  if (reviews.length === 0) return <p className="mt-6 text-gray-500">No reviews yet.</p>;

  return (
    <div className="mt-1">
      {reviews.map((r) => (
        <div key={r._id} className="border-b py-2">
          <div className="flex items-center gap-2 text-yellow-500">
            {Array.from({ length: r.rating }).map((_, i) => (
              <FaStar key={i} />
            ))}
            <span className="text-sm text-gray-600 ml-1">by {r.clientId?.name}</span>
          </div>
          <p className="text-sm mt-1 text-gray-700">{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;