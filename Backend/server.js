import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"

// Configuration
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Variables globales pour la base de données
let db
let client

// Connexion à MongoDB
async function connectToDatabase() {
  try {
    client = new MongoClient("mongodb://localhost:27017")
    await client.connect()
    console.log("Connecté à MongoDB")

    db = client.db("taskManagerDB")

    // Création des collections si elles n'existent pas
    await db.createCollection("users")
    await db.createCollection("tasks")
    await db.createCollection("notifications")

    console.log("Collections créées ou vérifiées avec succès")

    // Rendre la base de données accessible aux routes
    app.locals.db = db

    return db
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error)
    process.exit(1)
  }
}

// Routes
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)

// Route de test
app.get("/", (req, res) => {
  res.send("API de gestion des tâches fonctionnelle")
})

// Démarrage du serveur après connexion à la base de données
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Impossible de démarrer le serveur:", err)
  })

// Gestion de la fermeture propre
process.on("SIGINT", async () => {
  if (client) {
    await client.close()
    console.log("Connexion MongoDB fermée")
  }
  process.exit(0)
})

