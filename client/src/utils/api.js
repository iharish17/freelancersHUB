import axios from "axios";

const API = axios.create({
  baseURL:"https://freelancershub.onrender.com/api",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // ✅ needed for protect middleware
  }
  return req;
});

export default API;
