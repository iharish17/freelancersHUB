import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  FaPaintBrush,
  FaCode,
  FaPenNib,
  FaVideo,
  FaBullhorn,
  FaMusic,
  FaInstagram,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

const categories = [
  { name: "Graphic Design", icon: <FaPaintBrush />, color: "text-pink-500" },
  { name: "Web Development", icon: <FaCode />, color: "text-blue-500" },
  { name: "Content Writing", icon: <FaPenNib />, color: "text-green-500" },
  { name: "Video Editing", icon: <FaVideo />, color: "text-red-500" },
  { name: "Marketing", icon: <FaBullhorn />, color: "text-yellow-500" },
  { name: "Music & Audio", icon: <FaMusic />, color: "text-purple-500" },
];

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-100 via-indigo-200 to-indigo-100 text-gray-800 relative overflow-hidden">
      {/* ✅ Animated Top Wave */}
      <div className="absolute top-0 left-0 w-full z-0 overflow-hidden">
        <svg
          className="w-full h-24 md:h-32 animate-wave transition-all duration-1000 ease-in-out"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L30,90.7C60,117,120,171,180,186.7C240,203,300,181,360,149.3C420,117,480,75,540,85.3C600,96,660,160,720,192C780,224,840,224,900,192C960,160,1020,96,1080,85.3C1140,75,1200,117,1260,138.7C1320,160,1380,160,1410,160L1440,160L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* ✅ Hero Section */}
      <div className="relative z-10 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div
            className="w-full md:w-1/2 px-6 py-16 md:px-16 text-center md:text-left"
            data-aos="fade-right"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Find the Perfect Freelancer
            </h1>
            <p className="text-indigo-100 mb-6 text-lg">
              Connect with skilled experts in design, development, writing,
              marketing, and more.
            </p>
            <Link
              to="/gigs"
              className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded hover:bg-indigo-100 transition"
            >
              Browse Services
            </Link>

            {/* ✅ Social Media Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-6 text-xl">
              <a
                href="https://github.com/iharish17"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/harish-kumar-923475333"
                className="hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href="mailto:harishk3445@gmail.com"
                className="hover:text-green-300"
              >
                <FaEnvelope/>
              </a>
              <a
                href="https://facebook.com/hey.harish18"
                className="hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com/hey._harish"
                className="hover:text-pink-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2" data-aos="fade-left">
            <img
              src="/freelancer-image.png"
              alt="Freelancer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ✅ Animated Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg
            className="relative block w-full h-[80px] animate-wave"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#f0f4ff"
              fillOpacity="1"
              d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,149.3C840,139,960,149,1080,170.7C1200,192,1320,224,1380,240L1440,256L1440,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* ✅ Categories Section */}
      <div className="mt-24 max-w-5xl mx-auto px-4 z-10 relative">
        <h2
          className="text-2xl font-bold text-indigo-800 mb-4 text-center"
          data-aos="fade-up"
        >
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6" data-aos="zoom-in">
          {categories.map((cat, index) => (
            <Link
              to={`/gigs?search=${encodeURIComponent(cat.name)}`}
              key={index}
              className="flex flex-col items-center justify-center bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <div className={`text-4xl mb-2 ${cat.color}`}>{cat.icon}</div>
              <span className="text-indigo-700 font-semibold text-sm text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="mt-20 py-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center relative z-10">
        <h3 className="text-xl font-semibold mb-4">Follow Us At</h3>
        <div className="flex justify-center gap-6 text-2xl">
          <a href="https://instagram.com/hey._harish" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition"><FaInstagram /></a>
          <a href="https://facebook.com/hey.harish18" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition"><FaFacebook /></a>
          <a href="https://github.com/iharish17" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition"><FaGithub /></a>
          <a href="https://linkedin.com/in/harishk18" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition"><FaLinkedin /></a>
        </div>
        <p className="mt-4 text-sm text-indigo-100">
          © 2025 Harish Kumar. All rights reserved.
        </p>
      </footer>

      {/* ✅ Wave Animation CSS */}
      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        .animate-wave {
          animation: wave 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;