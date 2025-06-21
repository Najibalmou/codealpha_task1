import axios from "axios";

// Définir l'URL de base pour les requêtes API
const API_URL = "https://gestion-taches-8dy6.vercel.app/api";

// Configurer axios avec l'URL de base
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;