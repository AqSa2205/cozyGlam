const Product = require('../models/products'); 
const response = require('../utils/responseHelpers'); 
const mongoose = require('mongoose');


exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    product.seller_id = req.user.id; // Assuming you have the seller ID from the token
    await product.save();
    return response.success(res, 'Product created successfully', {product});
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to create product');
  }
};


exports.getAllProducts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items
        const skipIndex = (page - 1) * limit;

        const search = req.query.search || '';
        const searchRegex = new RegExp(search, 'i');
        const query = {
        $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } }
        ]
        };
        const products = await Product.find(query)
        .sort({ created_at: -1 }) 
        .skip(skipIndex)
        .limit(limit)
        .populate('seller_id', 'name email')
        .populate('categories', 'name');

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        return response.success(res, 'Product list fetched', {
        products,
        total: totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
        
        });
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
