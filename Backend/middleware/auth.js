import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." })
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_jwt_key")

    // Ajouter l'utilisateur à la requête
    req.user = decoded

    next()
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    res.status(401).json({ message: "Token invalide ou expiré" })
  }
}

export default auth

