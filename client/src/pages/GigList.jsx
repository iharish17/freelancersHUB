import React, { useEffect, useState } from "react";
import API from "../utils/api";
import GigCard from "../components/GigCard";

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGigs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(
        `/gigs?search=${search}&sort=${sort}&page=${page}`
      );
      setGigs(res.data.gigs);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch gigs:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
    // eslint-disable-next-line
  }, [page,sort]);

  return (
    <div className="min-h-screen bg-indigo-50 px-4 py-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 px-6">Explore Services</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 px-6 py-0">
        <input
          type="text"
          placeholder="Search services you want..."
          className="border border-gray-300 p-2 rounded w-64 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
         <div className="flex items-center gap-2">
      <span className="text-gray-500 text-sm">Sort by:</span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="text-sm font-bold text-black bg-transparent focus:outline-none cursor-pointer rounded hover:bg-indigo-200"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Top Rated</option>
      </select>
    </div>

      </div>

      {/* Gig cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-4">
        {loading ? (
          <p className="text-center text-gray-500 col-span-full">Loading gigs...</p>
        ) : error ? (
          <p className="text-center text-red-500 col-span-full">{error}</p>
        ) : gigs.length > 0 ? (
          gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">No gigs found.</p>
        )}
        
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded border ${
              page === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600"
            } hover:shadow`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GigList;