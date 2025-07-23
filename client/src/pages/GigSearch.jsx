import React, { useEffect, useState } from "react";
import API from "../utils/api";

const GigSearch = () => {
  const [gigs, setGigs] = useState([]);
  const [ratings, setRatings] = useState({});
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGigs = async () => {
    try {
      const params = {
        search,
        min: minPrice,
        max: maxPrice,
        role,
        sort,
        page,
      };

      const res = await API.get("/api/gigs", { params });
      setGigs(res.data.gigs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching gigs:", err);
    }
  };

  // ✅ Fetch average rating for each gig
  const fetchRatings = async (gigList) => {
    const ratingData = {};
    await Promise.all(
      gigList.map(async (gig) => {
        try {
          const res = await API.get(`/api/reviews/average/${gig._id}`);
          ratingData[gig._id] = parseFloat(res.data.average);
        } catch (err) {
          ratingData[gig._id] = 0;
        }
      })
    );
    setRatings(ratingData);
  };

  useEffect(() => {
    fetchGigs();
    // eslint-disable-next-line
  }, [page, sort]);

  useEffect(() => {
    if (gigs.length > 0) fetchRatings(gigs);
  }, [gigs]);

  const handleFilter = () => {
    setPage(1);
    fetchGigs();
  };

  // ⭐ Render rating stars
  const renderStars = (avg) => {
    const rounded = Math.round(avg);
    return (
      <div className="text-yellow-500 text-sm">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < rounded ? "⭐" : "☆"}</span>
        ))}
        <span className="ml-1 text-gray-500">({avg.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Search Gigs</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-6 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Top Rated</option>
        </select>
      </div>

      <button
        onClick={handleFilter}
        className="mb-8 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
      >
        Apply Filters
      </button>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.length === 0 ? (
          <p className="text-gray-500 col-span-full">No gigs found.</p>
        ) : (
          gigs.map((gig) => (
            <div
              key={gig._id}
              className="border rounded-lg p-4 hover:shadow-lg transition bg-white"
            >
              <img
                src={gig.coverImage || "https://via.placeholder.com/400x200"}
                alt={gig.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-bold text-indigo-600">{gig.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{gig.description}</p>
              <p className="text-green-600 font-semibold mt-2">₹{gig.price}</p>
              <p className="text-xs text-gray-500 mt-1">
                By: {gig.userId?.name} ({gig.userId?.role})
              </p>

              <div className="mt-2">
                {ratings[gig._id] !== undefined && renderStars(ratings[gig._id])}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-4 py-1 rounded border ${
              pg === page
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border-indigo-400"
            }`}
          >
            {pg}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GigSearch;
