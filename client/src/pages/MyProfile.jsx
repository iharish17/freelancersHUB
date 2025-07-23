import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/api";
import {
  FaPlus,
  FaBriefcase,
  FaComments,
  FaChartLine,
} from "react-icons/fa";

const MyProfile = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({ totalOrders: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchStats = async () => {
      try {
        const res = await axios.get("/orders/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8">My Dashboard</h2>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4 mb-6">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xl">
            {user.name?.[0]}
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-500 text-sm capitalize">{user.role}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-100 text-indigo-800 rounded-xl p-6 shadow text-center">
          <h4 className="text-sm font-medium mb-2">Total Orders</h4>
          <p className="text-3xl font-bold">{loading ? "..." : stats.totalOrders}</p>
        </div>

        <div className="bg-green-100 text-green-800 rounded-xl p-6 shadow text-center">
          <h4 className="text-sm font-medium mb-2">Total Earnings</h4>
          <p className="text-3xl font-bold">
            ₹{loading ? "..." : stats.totalEarnings}
          </p>
        </div>
      </div>

      {/* Colored Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          icon={<FaBriefcase size={28} />}
          title="My Gigs"
          subtitle="Manage your services"
          link="/my-gigs"
          bgColor="bg-sky-100"
          textColor="text-sky-800"
          linkColor="text-sky-500"
          linkLabel="Check Your Gigs →"
        />
        <DashboardCard
          icon={<FaPlus size={28} />}
          title="Create New Gig"
          subtitle="Add a new service"
          link="/create-gig"
          bgColor="bg-purple-100"
          textColor="text-purple-800"
          linkColor="text-purple-500"
          linkLabel="Create →"
        />
        <DashboardCard
          icon={<FaChartLine size={28} />}
          title="Orders"
          subtitle="Track your orders"
          link="/orders"
          bgColor="bg-teal-100"
          textColor="text-teal-800"
          linkColor="text-teal-500"
          linkLabel="Check Your Orders →"
        />
        <DashboardCard
          icon={<FaComments size={28} />}
          title="Messages"
          subtitle="Chat with clients"
          link={"/chat"}
          bgColor="bg-blue-100"
          textColor="text-blue-800"
          linkColor="text-blue-500"
          linkLabel="Open Chat →"
        />
      </div>
    </div>
  );
};

// ✅ Reusable Card Component with color props
const DashboardCard = ({ icon, title, subtitle, link, bgColor, textColor, linkColor, linkLabel }) => (
  <div className={`rounded-xl shadow-md p-6 hover:shadow-lg transition ${bgColor} ${textColor}`}>
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
    <Link to={link} className={`text-sm font-medium hover:underline ${linkColor}`}>
      {linkLabel}
    </Link>
  </div>
);

export default MyProfile;
