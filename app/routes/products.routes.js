const express = require('express');

const router = express.Router();

// Controller functions (import your actual controller functions here)
const product = require('../controllers/products.controller');

// Routes
router.get('/getProduct', product.getAllProducts); // Get all products
router.post('/createproduct', product.createProduct); // Create a new product
router.put('/:id', product.updateProduct); // Update a product by ID
router.delete('/:id', product.deleteProduct); // Delete a product by ID

module.exports = router;