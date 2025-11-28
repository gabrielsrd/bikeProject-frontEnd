import axios from "axios";

// Prefer relative `/api` so Nginx can proxy to backend in Docker
const BASE_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;