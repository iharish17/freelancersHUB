import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const role = localStorage.getItem("userRole");

  const name = user?.name || "User";
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const avatarUrl = user?.profilePic || null;

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/login");
  };

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="bg-indigo-600 shadow-md sticky top-0 z-50 w-full ">
      <div className="w-full flex justify-between items-center px-4 py-3  ">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white hover:scale-105 transition-transform duration-300 "
        >
          FreelanceHUB
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center ">
          <NavItem to="/" text="Home" onClick={handleLinkClick} />
          <NavItem to="/gigs" text="Explore" onClick={handleLinkClick} />
          {role === "freelancer" && token && (
            <NavItem to="/create-gig" text="Create Gig" onClick={handleLinkClick} />
          )}
          {!token ? (
            <>
              <NavItem to="/login" text="Login" onClick={handleLinkClick} />
              <NavItem to="/register" text="Register" onClick={handleLinkClick} />
            </>
          ) : (
            <UserDropdown
              name={name}
              role={role}
              userId={user?._id}
              avatarUrl={avatarUrl}
              initials={initials}
              handleLogout={handleLogout}
            />
          )}
        </ul>

        {/* Mobile Avatar + Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {role === "freelancer" && token && (
            <Link to="/my-profile" onClick={handleLinkClick}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center">
                  {initials}
                </div>
              )}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center items-center"
          >
            <span
              className={`w-6 h-1 bg-white mb-1 transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`w-6 h-1 bg-white mb-1 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-6 h-1 bg-white transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-4 bg-indigo border-t">
          <NavItem to="/" text="Home" onClick={handleLinkClick} />
          <NavItem to="/gigs" text="Explore Gigs" onClick={handleLinkClick} />
          {role === "freelancer" && token && (
            <>
              <NavItem to="/create-gig" text="Create Gig" onClick={handleLinkClick} />
              <NavItem to="/my-profile" text="My Dashboard" onClick={handleLinkClick} />
              <NavItem
                to={`/freelancer/${user?._id}`}
                text="Public Profile"
                onClick={handleLinkClick}
              />
            </>
          )}
          {token && <NavItem to="/orders" text="Orders" onClick={handleLinkClick} />}
          {!token ? (
            <>
              <NavItem to="/login" text="Login" onClick={handleLinkClick} />
              <NavItem to="/register" text="Register" onClick={handleLinkClick} />
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 border border-white-500 text-white rounded hover:bg-indigo-700"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

// ✅ Nav Item with underline hover animation
const NavItem = ({ to, text, onClick }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className="relative group block text-white hover:text-yellow-200 transition-all duration-200"
    >
      <span className="group-hover:underline decoration-yellow-200 decoration-2 underline-offset-4">
        {text}
      </span>
    </Link>
  </li>
);

// ✅ User Dropdown with outside click to close
const UserDropdown = ({ name, role, userId, avatarUrl, initials, handleLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center "
        title={name}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
          <div className="px-4 py-2 border-b text-sm text-gray-600">
            {name}
            <br />
            <span className="text-xs text-gray-400">{role}</span>
          </div>

          {role === "freelancer" && (
            <>
              <Link
                to="/my-profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                onClick={() => setOpen(false)}
              >
                My Dashboard
              </Link>
              <Link
                to={`/freelancer/${userId}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                onClick={() => setOpen(false)}
              >
                Public Profile
              </Link>
            </>
          )}

          <Link
            to="/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;