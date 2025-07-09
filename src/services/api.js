import axios from "axios";

const api = axios.create({
  baseURL: "https://crm-backend-730x.onrender.com/api", 
  withCredentials: false, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
