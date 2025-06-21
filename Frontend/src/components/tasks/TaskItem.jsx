import { Link } from "react-router-dom"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const TaskItem = ({ task, compact = false }) => {
  // Déterminer la couleur de la priorité
  const priorityColor = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  // Traduire la priorité
  const priorityLabel = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
  }

  // Vérifier si la tâche est en retard
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "terminée"

  if (compact) {
    return (
      <Link
        to={`/tasks/${task._id}`}
        className={`block p-3 border rounded-md hover:shadow-md transition-shadow ${
          isOverdue ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[task.priority]}`}>
            {priorityLabel[task.priority]}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/tasks/${task._id}`}
      className={`block p-4 border rounded-md hover:shadow-md transition-shadow ${
        isOverdue ? "border-red-300 bg-red-50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[task.priority]}`}>
          {priorityLabel[task.priority]}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        {isOverdue ? (
          <p className="text-red-600 font-medium">
            En retard - {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: fr })}
          </p>
        ) : (
          <p>Échéance: {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: fr })}</p>
        )}
      </div>

      {task.description && <p className="text-sm text-gray-500 truncate">{task.description}</p>}
    </Link>
  )
}

export default TaskItem

