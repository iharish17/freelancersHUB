import React, { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

const ReviewForm = ({ gigId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", { gigId, rating, comment });
      toast.success("Review submitted!");
      setRating(5);
      setComment("");
    } catch (err) {
      console.error("Error submitting review", err);
      toast.error(err.response?.data?.msg || "Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div>
        <label className="text-sm font-medium">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2 border p-1 rounded">
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star} Star{star > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="Write your review..."
      ></textarea>

      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;