import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({
  icon,
  title,
  subtitle,
  link,
  linkLabel,
  color = "indigo",
}) => (
  <div className={`bg-${color}-100 text-${color}-800 rounded-xl shadow-md p-6 hover:shadow-lg transition`}>
    <div className={`mb-3`}>{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
    <Link to={link} className={`text-sm text-${color}-500 hover:underline font-medium`}>
      {linkLabel}
    </Link>
  </div>
);

export default DashboardCard;