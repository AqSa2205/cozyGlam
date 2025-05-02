const express = require('express');
const router = express.Router();
const sc = require('../controllers/store.controller');
const verifyToken = require("../middleware/auth");

// Seller routes
router.post('/createstore', [verifyToken] , sc.createStore);
router.get('/getstore', [verifyToken] , sc.getAllStores);
router.put('/updatestore',[verifyToken] , sc.updateStore);
router.delete('/deletestore',[verifyToken] ,  sc.deleteStore);

module.exports = router;
