// backend/controllers/serviceController.js
const Service = require('../models/Service');

// Fonction pour obtenir les services avec filtrage
exports.getServices = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (status) filters.status = status;

    const services = await Service.find(filters);
    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
