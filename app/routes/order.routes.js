const express = require('express');

const router = express.Router();
const o = require('../controllers/order.controller');
const verifyToken = require("../middleware/auth");

router.post('/createOrder',[verifyToken], o.createOrder);
router.get('/getOrder',[verifyToken], o.getOrders);
router.put('/updateOrder/:id', o.updateOrderStatus);
router.delete('/deleteOrder/:id', o.deleteOrder);

module.exports = router;