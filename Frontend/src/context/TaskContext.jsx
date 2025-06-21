"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { AuthContext } from "./AuthContext"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    sortBy: "dueDate",
    sortOrder: "asc",
  })

  const { user } = useContext(AuthContext)

  // Charger les tâches quand l'utilisateur est connecté ou les filtres changent
  useEffect(() => {
    if (user) {
      fetchTasks()
    } else {
      setTasks([])
    }
  }, [user, filters])

  // Récupérer les tâches avec filtres
  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Construire l'URL avec les paramètres de filtre
      let url = "/api/tasks?"
      if (filters.status) url += `status=${filters.status}&`
      if (filters.priority) url += `priority=${filters.priority}&`
      if (filters.sortBy) url += `sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}`

      const res = await axios.get(url)
      setTasks(res.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error)
      setError("Impossible de charger les tâches")
      toast.error("Erreur lors du chargement des tâches")
    } finally {
      setLoading(false)
    }
  }

  // Récupérer une tâche par ID
  const getTaskById = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.get(`/api/tasks/${id}`)
      return res.data
    } catch (error) {
      console.error("Erreur lors de la récupération de la tâche:", error)
      setError("Impossible de charger cette tâche")
      toast.error("Erreur lors du chargement de la tâche")
      return null
    } finally {
      setLoading(false)
    }
  }

  // Créer une nouvelle tâche
  const createTask = async (taskData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post("/api/tasks", taskData)
      setTasks([...tasks, res.data])
      toast.success("Tâche créée avec succès")
      return res.data
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error)
      setError("Impossible de créer la tâche")
      toast.error("Erreur lors de la création de la tâche")
      return null
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour une tâche
  const updateTask = async (id, taskData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.put(`/api/tasks/${id}`, taskData)

      // Mettre à jour la liste des tâches
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)))

      toast.success("Tâche mise à jour avec succès")
      return res.data
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error)
      setError("Impossible de mettre à jour la tâche")
      toast.error("Erreur lors de la mise à jour de la tâche")
      return null
    } finally {
      setLoading(false)
    }
  }

  // Supprimer une tâche
  const deleteTask = async (id) => {
    setLoading(true)
    setError(null)

    try {
      await axios.delete(`/api/tasks/${id}`)

      // Mettre à jour la liste des tâches
      setTasks(tasks.filter((task) => task._id !== id))

      toast.success("Tâche supprimée avec succès")
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error)
      setError("Impossible de supprimer la tâche")
      toast.error("Erreur lors de la suppression de la tâche")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour les filtres
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        filters,
        fetchTasks,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        updateFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

