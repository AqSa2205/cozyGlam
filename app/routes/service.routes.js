const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth");
const serviceController = require('../controllers/services.controller');
const bodyTreatmentctrl = require("../controllers/bodyTreatement.controller");

router.post('/createService', [verifyToken], serviceController.createService);
router.get('/getService', serviceController.getServices);
router.put('/updateServices/:id', [verifyToken], serviceController.updateServiceName);

// appointments

router.post('/applyAppointment', serviceController.createAppointment);
router.get('/getAppointments', serviceController.getAppointmentsWithService);


// GET route to fetch data
router.get("/bodyTreatment/getData", bodyTreatmentctrl.getData);
router.put("/bodyTreatment/updateData/:id", bodyTreatmentctrl.updateData);

module.exports = router;