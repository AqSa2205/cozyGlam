const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth");
const settingsController = require('../controllers/settings.controller');

router.get('/getSettings', settingsController.getSettings);
router.put('/updateSettings',[verifyToken], settingsController.updateSettings);

module.exports = router;
