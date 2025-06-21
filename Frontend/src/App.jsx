"use client"

import { useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import Header from "./components/layout/Header"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import TaskForm from "./pages/TaskForm"
import TaskDetail from "./pages/TaskDetail"
import NotFound from "./pages/NotFound"

// Importer les styles CSS
import "./styles/main.css"
import "./styles/layout.css"
import "./styles/dashboard.css"
import "./styles/task.css"
import "./styles/auth.css"
import "./styles/filters.css"
import "./styles/not-found.css"

function App() {
  const { user, loading } = useContext(AuthContext)

  // Route protégée qui redirige vers la connexion si non authentifié
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="loading-screen">Chargement...</div>
    return user ? children : <Navigate to="/login" />
  }

  // Route publique qui redirige vers le tableau de bord si déjà authentifié
  const PublicRoute = ({ children }) => {
    if (loading) return <div className="loading-screen">Chargement...</div>
    return !user ? children : <Navigate to="/dashboard" />
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <ProtectedRoute>
                  <TaskForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/edit/:id"
              element={
                <ProtectedRoute>
                  <TaskForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App

