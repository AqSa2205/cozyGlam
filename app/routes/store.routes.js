const express = require('express');
const router = express.Router();
const sc = require('../controllers/store.controller');
const verifyToken = require("../middleware/auth");
const {uploadFiles} = require('../utils/fileUpload');

// Seller routes
router.post('/createstore', [verifyToken] , sc.createStore);
router.post('/verifystore', [verifyToken] , sc.submitVerification);
router.post('/submitVerification', [verifyToken] , sc.submitVerification);
  
router.get('/getstore', [verifyToken] , sc.getAllStore);
router.put('/updateStore/:id',[verifyToken] , sc.updateStore);
router.delete('/deletestore',[verifyToken] ,  sc.deleteStore);

module.exports = router;
