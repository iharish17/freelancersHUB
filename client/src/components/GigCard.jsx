import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const GigCard = ({ gig }) => {
  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={gig.coverImage || "/placeholder.jpg"}
        alt={gig.title}
        className="w-full h-48 object-cover rounded"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-indigo-700 line-clamp-1">{gig.title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{gig.description}</p>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {gig.userId?.name?.charAt(0)}
            </div>
            <span className="text-sm">Published by <strong>{gig.userId?.name}</strong></span>
          </div>
          <span className="text-green-600 font-semibold">₹{gig.price}</span>
        </div>

        {gig.rating && (
          <div className="flex items-center text-yellow-500 text-sm mt-2">
            {[...Array(Math.round(gig.rating))].map((_, i) => (
              <FaStar key={i} />
            ))}
            <span className="text-gray-500 ml-1">({gig.rating.toFixed(1)})</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default GigCard;