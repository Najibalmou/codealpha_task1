import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page non trouvée</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md">
        Retour à l'accueil
      </Link>
    </div>
  )
}

export default NotFound

