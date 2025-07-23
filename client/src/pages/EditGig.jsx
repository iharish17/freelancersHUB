import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Validation schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
});

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // ✅ Load existing gig
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await API.get(`/gigs/${id}`);
        setInitialData(res.data);
        setValue("title", res.data.title);
        setValue("description", res.data.description);
        setValue("price", res.data.price);
        setImageUrl(res.data.coverImage || "");
      } catch (err) {
        toast.error("Failed to load gig.");
      }
    };
    fetchGig();
  }, [id, setValue]);

  // ✅ Handle Cloudinary Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "My_uploads"); // 🔁 Replace with actual preset

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dvyvjenyk/image/upload", form);
      setImageUrl(res.data.secure_url);
    } catch (err) {
      toast.error("Image upload failed.");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        coverImage: imageUrl,
      };
      await API.put(`/gigs/${id}`, payload);
      toast.success("Gig updated successfully");
      navigate("/my-gigs");
    } catch (err) {
      toast.error("Failed to update gig");
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Edit Gig</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            {...register("title")}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter gig title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Describe your service"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Price (INR)</label>
          <input
            type="number"
            {...register("price")}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter price"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Gig Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full"
          />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="mt-2 w-full h-48 object-cover rounded" />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Update Gig"}
        </button>
      </form>
    </div>
  );
};

export default EditGig;