import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { uploadToCloudinary } from "../utils/upload";
import { toast } from "react-toastify";

const CreateGig = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [gig, setGig] = useState({
    title: "",
    description: "",
    price: "",
    coverImage: "",
  });

  const handleChange = (e) => {
    setGig({ ...gig, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setGig((prev) => ({ ...prev, coverImage: imageUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gig.title || !gig.description || !gig.price || !gig.coverImage) {
      toast.error("All fields including image are required!");
      return;
    }

    try {
      setCreating(true);
      await API.post("/gigs", gig);
      toast.success("Gig created!");
      navigate("/my-gigs");
    } catch (err) {
      toast.error("Error creating gig");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Create New Gig</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={gig.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={gig.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={gig.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />

        {gig.coverImage && (
          <img
            src={gig.coverImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded"
          />
        )}

        <button
          type="submit"
          disabled={uploading || creating}
          className={`w-full py-2 rounded font-semibold text-white transition ${
            uploading || creating
              ? "bg-indigo-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {uploading
            ? "Uploading Image..."
            : creating
            ? "Creating Gig..."
            : "Create Gig"}
        </button>
      </form>
    </div>
  );
};

export default CreateGig;