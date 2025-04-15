// frontend/src/services/websocket.js

import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialise la connexion WebSocket.
 * @param {string} token - JWT d’authentification pour handshake sécurisé.
 * @returns {Socket} Instance du socket connecté.
 */
export const connectSocket = (token) => {
  socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connecté:', socket.id);
  });

  socket.on('disconnect', () => {
    console.warn('⚠️ Socket déconnecté');
  });

  return socket;
};

/**
 * Envoie un message via le socket connecté.
 * @param {Object} message - Le message à envoyer.
 * @param {string} message.to - ID du destinataire.
 * @param {string} message.text - Contenu du message.
 */
export const sendMessage = ({ to, text }) => {
  if (!socket) return console.error('Socket non connecté');
  socket.emit('send_message', { to, text });
};

/**
 * Écoute les messages entrants.
 * @param {(msg: Object) => void} callback - Fonction de traitement du message.
 */
export const listenMessages = (callback) => {
  if (!socket) return console.error('Socket non connecté');
  socket.on('receive_message', callback);
};

/**
 * Déconnecte le socket proprement.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
