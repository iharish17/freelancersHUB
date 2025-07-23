import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditFreelancerInfo = () => {
  const [user, setUser] = useState({});
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
        setBio(res.data.bio || "");
        if (res.data.profilePic) {
          setPreview(`http://localhost:5000/${res.data.profilePic}`);
        }
      } catch (err) {
        console.error("Error fetching user", err);
        toast.error("Failed to load user info");
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

 const handleRemoveImage = () => {
  setProfilePic(null);
  setPreview(null);
  setUser((prev) => ({ ...prev, removeImage: true }));
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("bio", bio);
  if (profilePic) {
    formData.append("profilePic", profilePic);
  }
  if (user.removeImage) {
    formData.append("removeImage", "true");
  }

  try {
    await API.put("/users/update-profile", formData);
    toast.success("Profile updated successfully!");
    setTimeout(() => navigate(`/freelancer/${user._id}`), 2000);
  } catch (err) {
    console.error("Update failed", err);
    toast.error("Failed to update profile");
  }
};

  const handleCancel = () => {
    navigate(`/freelancer/${user._id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Profile Preview */}
        {preview && (
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover border shadow"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-red-600 text-sm hover:underline"
            >
              Remove Image
            </button>
          </div>
        )}

        {/* ✅ Upload Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600"
          />
        </div>

        {/* ✅ Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            rows={4}
            placeholder="Write about yourself"
          />
        </div>

        {/* ✅ Buttons */}
        <div className="flex justify-between gap-4 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default EditFreelancerInfo;