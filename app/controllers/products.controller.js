const Product = require('../models/products'); 
const response = require('../utils/responseHelpers'); 
const mongoose = require('mongoose');


exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    return response.success(res, 'Product created successfully', {product});
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to create product');
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller_id', 'name email')
      .populate('categories', 'name');
    //   .populate('subcategories', 'name');

    return response.success(res, 'Product list fetched', {products});
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to fetch products');
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('seller_id', 'name email')
      .populate('categories', 'name')
      .populate('subcategories', 'name');

    if (!product) return response.notFound(res, 'Product not found');

    return response.success(res, 'Product fetched successfully', product);
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to fetch product');
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) return response.notFound(res, 'Product not found');

    return response.success(res, 'Product updated successfully', updatedProduct);
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to update product');
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return response.notFound(res, 'Product not found');

    return response.success(res, 'Product deleted successfully');
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to delete product');
  }
};
