"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { TaskContext } from "../context/TaskContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa"

const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTaskById, deleteTask, loading } = useContext(TaskContext)

  const [task, setTask] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      const taskData = await getTaskById(id)
      if (taskData) {
        setTask(taskData)
      } else {
        navigate("/dashboard")
      }
    }

    fetchTask()
  }, [id, getTaskById, navigate])

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche?")) {
      setIsDeleting(true)
      const success = await deleteTask(id)
      if (success) {
        navigate("/dashboard")
      }
      setIsDeleting(false)
    }
  }

  if (loading || !task) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Déterminer la couleur de la priorité
  const priorityColor = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  // Déterminer la couleur du statut
  const statusColor = {
    "à faire": "bg-gray-100 text-gray-800",
    "en cours": "bg-blue-100 text-blue-800",
    terminée: "bg-purple-100 text-purple-800",
  }

  // Traduire la priorité
  const priorityLabel = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/dashboard" className="flex items-center gap-2 text-blue-500 mb-4 hover:underline">
        <FaArrowLeft /> Retour au tableau de bord
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{task.title}</h1>

          <div className="flex gap-2">
            <Link
              to={`/tasks/edit/${id}`}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              title="Modifier"
            >
              <FaEdit />
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              title="Supprimer"
              disabled={isDeleting}
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Détails</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Date d'échéance:</span>
                <p className="font-medium">{format(new Date(task.dueDate), "EEEE d MMMM yyyy", { locale: fr })}</p>
              </div>
              <div>
                <span className="text-gray-600">Priorité:</span>
                <p>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${priorityColor[task.priority]}`}>
                    {priorityLabel[task.priority]}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-600">Statut:</span>
                <p>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${statusColor[task.status]}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-600">Créée le:</span>
                <p className="font-medium">{format(new Date(task.createdAt), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
              </div>
              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <div>
                  <span className="text-gray-600">Dernière mise à jour:</span>
                  <p className="font-medium">
                    {format(new Date(task.updatedAt), "dd/MM/yyyy à HH:mm", { locale: fr })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div className="bg-gray-50 p-4 rounded-md min-h-[150px]">
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="text-gray-500 italic">Aucune description</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail

