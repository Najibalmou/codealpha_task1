"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // Configurer le token pour toutes les requêtes
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Récupérer les informations de l'utilisateur
          const res = await axios.get("/api/users/profile")
          setUser(res.data)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Fonction d'inscription
const register = async (userData) => {
  try {
    const res = await axios.post('http://localhost:5000/api/users/register', userData);
    
    // Stocker le token et configurer axios
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
    setUser(res.data);
    toast.success('Inscription réussie!');
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
    toast.error(message);
    return false;
  }
}

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      const res = await axios.post("/api/users/login", credentials)

      // Stocker le token et configurer axios
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

      setUser(res.data)
      toast.success("Connexion réussie!")
      return true
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la connexion"
      toast.error(message)
      return false
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    toast.info("Vous êtes déconnecté")
  }

  return <AuthContext.Provider value={{ user, loading, register, login, logout }}>{children}</AuthContext.Provider>
}

