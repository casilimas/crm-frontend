import axios from "axios";

const api = axios.create({
  baseURL: "https://crm-backend-730x.onrender.com/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Inyectar token JWT automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
