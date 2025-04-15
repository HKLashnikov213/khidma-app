const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Service d'authentification pour l'envoi et la vérification d'OTP.
 * Utilise fetch pour communiquer avec les endpoints backend.
 *
 * @module authAPI
 */

/**
 * Envoie l'OTP à un numéro de téléphone donné.
 * 
 * @param {Object} param0 - Objet contenant le numéro de téléphone.
 * @param {string} param0.phone - Numéro de téléphone de l'utilisateur.
 * @returns {Promise<Object>} Réponse de l'API.
 * @throws {Error} Si l'envoi de l'OTP échoue.
 */
const sendOTP = async ({ phone }) => {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de l’envoi de l’OTP');
  }
  return response.json();
};

/**
 * Vérifie l'OTP saisi par l'utilisateur et renvoie un token JWT en cas de succès.
 * 
 * @param {Object} param0 - Objet contenant les données de vérification.
 * @param {string} param0.phone - Numéro de téléphone de l'utilisateur.
 * @param {string} param0.otp - OTP saisi par l'utilisateur.
 * @returns {Promise<Object>} Réponse contenant le token JWT.
 * @throws {Error} Si la vérification de l'OTP échoue.
 */
const verifyOTP = async ({ phone, otp }) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la vérification de l’OTP');
  }
  return response.json();
};

export default { sendOTP, verifyOTP };
