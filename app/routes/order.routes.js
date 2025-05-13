const express = require('express');

const router = express.Router();
const o = require('../controllers/order.controller');
const verifyToken = require("../middleware/auth");

router.post('/createOrder',[verifyToken], o.createOrder);
router.get('/getOrders_customer',[verifyToken], o.getOrders_customer);
router.post('/completePayment',[verifyToken], o.completePayment);
router.get('/getOrders_seller',[verifyToken], o.getOrders_seller);
router.put('/acceptOrder',[verifyToken], o.acceptOrder);
router.put('/updateOrder/:id', o.updateOrderStatus);
router.delete('/deleteOrder/:id', o.deleteOrder);

module.exports = router;