const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth");
const FaqsController = require('../controllers/faqs.controller');

router.post('/createFaqs',[verifyToken], FaqsController.createFaqs);
router.get('/getFaqs', FaqsController.getFaqs);
router.put('/updateFaqs/:id',[verifyToken], FaqsController.updateFaqs);
router.delete('/deleteFaqs/:id',[verifyToken], FaqsController.deleteFaqs);

module.exports = router;
