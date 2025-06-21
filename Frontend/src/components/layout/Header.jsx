"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Header = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Gestion des Tâches
        </Link>

        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Bonjour, <span className="font-medium">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Connexion
              </Link>
              <Link to="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                Inscription
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

