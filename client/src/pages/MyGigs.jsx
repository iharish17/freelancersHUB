import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/api";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ReviewList from "../components/ReviewList";

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReview, setOpenReview] = useState(null);

  const fetchGigs = async () => {
    try {
      const res = await axios.get("/gigs/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setGigs(res.data);
    } catch (err) {
      console.error("Failed to fetch gigs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gig?")) return;
    try {
      await axios.delete(`/gigs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setGigs(gigs.filter((gig) => gig._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading your gigs...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">My Gigs</h2>
      {gigs.length === 0 ? (
        <p className="text-gray-600">You haven't created any gigs yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-white shadow-md rounded-lg p-4 relative">
              {gig.image && (
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-indigo-800">{gig.title}</h3>
              <p className="text-sm text-gray-600">{gig.description.slice(0, 100)}...</p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-indigo-500 font-medium">₹{gig.price}</span>
              </div>
              <div className="flex gap-4 mt-4">
                <Link
                  to={`/edit-gig/${gig._id}`}
                  className="flex items-center text-blue-500 hover:underline"
                >
                  <FaEdit className="mr-1" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(gig._id)}
                  className="flex items-center text-red-500 hover:underline"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
                            {/* Review Dropdown Toggle */}
              <div className="mt-1">
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
                  <div className="mt-2 ">
                    <ReviewList gigId={gig._id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;