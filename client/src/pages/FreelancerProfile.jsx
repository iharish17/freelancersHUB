import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";

const FreelancerProfile = () => {
  const { id } = useParams();
  const [gigs, setGigs] = useState([]);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await API.get(`/users/${id}`);
        setFreelancer(profileRes.data);
      } catch (err) {
        console.error("Error fetching freelancer:", err);
      }
    };

    const fetchGigs = async () => {
      try {
        const res = await API.get(`/gigs/user/${id}`);
        setGigs(res.data);
      } catch (err) {
        console.error("Error fetching gigs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
      fetchGigs();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* ✅ Sticky Top Info Section */}
      <div className="w-full px-6 py-6 bg-indigo-100 shadow sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {freelancer?.profilePic ? (
  <img
    src={`http://localhost:5000/${freelancer.profilePic}`}
    alt="profile"
    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow"
  />
) : (
  <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-semibold shadow">
    {freelancer?.name?.charAt(0).toUpperCase()}
  </div>
)}

          <div>
            <h1 className="text-xl font-bold text-gray-600">
              {freelancer?.name || "Freelancer"}
            </h1>
            <p className="text-sm text-gray-600">{freelancer?.email}</p>

            {user && user._id !== id && (
                        <a
  href={`mailto: harishk3445@gmail.com?subject=Interested%20in%20your%20gig&body=Hi%20there,%20I%20found%20your%20gig%20interesting...`}
  className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block"
>
  Email Freelancer
</a>
            )}
          </div>
        </div>

        <div className="mt-4 ml-1">
          <p className="text-gray-600">
            <strong>About: </strong>
            {freelancer?.bio || "No bio provided."}
          </p>
          <p className="text-gray-600 mt-1">
            <strong>Total Gigs: </strong> {gigs.length}
          </p>

          {user && user._id === id && (
            <Link
              to="/freelancer-info-edit"
              className="inline-block mt-3 px-4 py-2 bg-indigo-300 text-indigo-700 text-sm rounded hover:bg-indigo-200 transition"
            >
              Edit Info
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Gigs Section */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-6 text-center">
          {user && user._id === id
            ? "Your Gigs"
            : `${freelancer?.name?.split(" ")[0] || "Freelancer"}'s Gigs`}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading gigs...</p>
        ) : gigs.length === 0 ? (
          <p className="text-center text-gray-600">
            This freelancer hasn’t posted any gigs yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col justify-between"
              >
                {gig.coverImage && (
                  <img
                    src={gig.coverImage}
                    alt={gig.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h2 className="text-lg font-semibold text-indigo-800">{gig.title}</h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {gig.description}
                </p>
                <p className="mt-2 text-indigo-600 font-bold">₹{gig.price}</p>
                <Link
                 to={
                     user.role === "freelancer"? "/my-gigs" : `/gigs/${gig._id}`  }
                  className="mt-3 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm rounded hover:bg-indigo-200 transition text-center">
                       View Details
                   </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;