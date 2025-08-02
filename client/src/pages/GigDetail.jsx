import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { FaStar } from "react-icons/fa";
import ReviewList from "../components/ReviewList";
import { toast } from "react-toastify";
import {FaChevronDown, FaChevronUp } from "react-icons/fa";
const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openReview, setOpenReview] = useState(null);
  
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await API.get(`/gigs/${id}`);
        setGig(res.data);
      } catch (err) {
        console.error("Error fetching gig:", err);
        setError("Gig not found");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handleOrder = async () => {
    try {
      await API.post("/orders", { gigId: gig._id });
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Order failed", err);
      toast.error(err.response?.data?.msg || "Failed to place order.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!gig) return null;

  return (
    <div className="min-h-screen bg-indigo-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow hover:shadow-lg transition duration-300">
        {/* ✅ Gig Cover Image */}
        {gig.coverImage && (
          <img
            src={gig.coverImage}
            alt={gig.title}
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}

        {/* ✅ Title */}
        <h2 className="text-xl font-bold text-indigo-700">{gig.title}</h2>

        {/* ✅ Description */}
        <p className="text-gray-600 my-2">{gig.description}</p>

        {/* ✅ Price */}
        <p className="text-green-600 font-semibold text-lg mb-2">₹{gig.price}</p>

        {/* ✅ Creator */}
        <p className="text-sm text-gray-500 mb-2">
          Published By{" "}
          <span className="font-medium"><strong>{gig.userId?.name || "Freelancer"}</strong></span>
        </p>

        {/* ✅ Rating */}
        {gig.rating && (
          <div className="flex items-center gap-1 text-yellow-500 mb-2">
            {Array.from({ length: Math.round(gig.rating) }).map((_, i) => (
              <FaStar key={i} />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              {gig.rating.toFixed(1)}
            </span>
          </div>
        )}


        <div className="flex flex-wrap gap-3 mt-5">
          {/* Order Button (for client only) */}
          {loggedInUser?._id !== gig.userId?._id && loggedInUser?.role === "client" && (
            <button
              onClick={handleOrder}
              className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Order Now
            </button>
          )}

          {/* Chat with Freelancer */}
          <a
  href={`mailto: harishk3445@gmail.com?subject=Interested%20in%20your%20gig&body=Hi%20there,%20I%20found%20your%20gig%20interesting...`}
  className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block"
>
  Email Freelancer
</a>

          {/* View Public Profile */}
          {gig?.userId?._id && (
            <button
              onClick={() => navigate(`/freelancer/${gig.userId._id}`)}
              className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              View Profile
            </button>
          )}
        </div>

                      {/* Review Dropdown Toggle */}
              <div className="mt-3">
                <button
                  onClick={() =>
                    setOpenReview(openReview === gig._id ? null : gig._id)
                  }
                  className="text-sm text-blue-600 flex items-center"
                >
                  {openReview === gig._id ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
                  {openReview === gig._id ? "Hide Reviews" : "Show Reviews"}
                </button>

                {openReview === gig._id && (
                  <div className="mt-2 border-t pt-2">
                    <ReviewList gigId={gig._id} />
                  </div>
                )}
              </div>
      </div>
    </div>
  );
};

export default GigDetail;