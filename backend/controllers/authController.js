// backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * Envoie un code OTP et stocke temporairement dans Redis.
 * @route POST /api/auth/send-otp
 */
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Code à 6 chiffres

  try {
    // Simuler l'envoi (ex: SMS)
    console.log(`📲 Code OTP envoyé à ${phone} : ${otp}`);

    // Stocker le code dans Redis pour 2 min
    await redisClient.setEx(`otp:${phone}`, 120, otp);

    // Créer l'utilisateur s'il n'existe pas
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    res.status(200).json({ message: 'Code OTP envoyé', phone });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Vérifie le code OTP, retourne un JWT si valide.
 * @route POST /api/auth/verify-otp
 */
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const storedOtp = await redisClient.get(`otp:${phone}`);

    if (storedOtp !== otp) {
      return res.status(401).json({ error: 'Code invalide ou expiré' });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Générer le token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Supprimer l’OTP
    await redisClient.del(`otp:${phone}`);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Middleware de vérification JWT pour protéger les routes.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = payload; // contient userId
    next();
  });
};
