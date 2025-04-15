const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Initialisation du serveur Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Exemple de route API
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de Khidma");
});

// Socket.io - Exemple de gestion de messages en temps réel
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("disconnect", () => {
    console.log("Un utilisateur a quitté");
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
