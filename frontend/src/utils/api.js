import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://localhost:4000/api",
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // ✅ khusus admin
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminAxios;
