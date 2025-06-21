"use client"

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { TaskContext } from "../context/TaskContext"
import TaskItem from "../components/tasks/TaskItem"
import TaskFilter from "../components/tasks/TaskFilter"
import { FaPlus } from "react-icons/fa"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const Dashboard = () => {
  const { tasks, loading, error } = useContext(TaskContext)
  const [view, setView] = useState("list") // 'list' ou 'calendar'

  // Grouper les tâches par statut
  const tasksByStatus = {
    "à faire": tasks.filter((task) => task.status === "à faire"),
    "en cours": tasks.filter((task) => task.status === "en cours"),
    terminée: tasks.filter((task) => task.status === "terminée"),
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <Link
          to="/tasks/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Nouvelle tâche
        </Link>
      </div>

      <TaskFilter />

      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded-md ${view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setView("list")}
        >
          Vue liste
        </button>
        <button
          className={`px-4 py-2 rounded-md ${view === "calendar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setView("calendar")}
        >
          Vue calendrier
        </button>
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 capitalize">
                {status} ({statusTasks.length})
              </h2>
              {statusTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune tâche</p>
              ) : (
                <div className="space-y-3">
                  {statusTasks.map((task) => (
                    <TaskItem key={task._id} task={task} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Calendrier des tâches</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune tâche</p>
          ) : (
            <div className="space-y-2">
              {/* Grouper les tâches par date */}
              {Object.entries(
                tasks.reduce((acc, task) => {
                  const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd")
                  if (!acc[dateKey]) acc[dateKey] = []
                  acc[dateKey].push(task)
                  return acc
                }, {}),
              )
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .map(([dateKey, dateTasks]) => (
                  <div key={dateKey} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-medium text-lg mb-2">
                      {format(new Date(dateKey), "EEEE d MMMM yyyy", { locale: fr })}
                    </h3>
                    <div className="space-y-2 pl-2">
                      {dateTasks.map((task) => (
                        <TaskItem key={task._id} task={task} compact />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard

