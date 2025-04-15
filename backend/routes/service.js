// backend/routes/service.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// @route   GET /api/services
router.get('/', serviceController.getServices);

module.exports = router;
