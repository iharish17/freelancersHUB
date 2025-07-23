// src/utils/upload.js

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "My_uploads"); // 🔁 your preset name
  formData.append("cloud_name", "dvyvjenyk");       // 🔁 your cloud name

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dvyvjenyk/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Image upload failed");
  }

  return data.secure_url;
};