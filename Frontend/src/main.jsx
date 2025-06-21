import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext"
import { TaskProvider } from "./context/TaskContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <TaskProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </TaskProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)

