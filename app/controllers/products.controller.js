const Product = require('../models/products'); 
const Category = require('../models/categories');
const SubCategory = require('../models/subCategories');
const Seller = require('../models/users');
const response = require('../utils/responseHelpers'); 
const mongoose = require('mongoose');
const Store = require('../models/store'); // import your Store model

exports.createProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Find the store associated with the seller
    const store = await Store.findOne({ userId : sellerId });

    if (!store) {
      return response.notFound(res, 'Store not found for the seller');
    }

    // Create product and assign seller_id and store_id
    const product = new Product({
      ...req.body,
      seller_id: sellerId,
      store_id: store._id
    });

    await product.save();

    return response.success(res, "Product created successfully", {  product  });

  } catch (error) {
    console.error(error);
    return response.serverError(res, "Failed to create product");
  }
};



// exports.getAllProducts = async (req, res) => {
//     try {

//         const page = parseInt(req.query.page) || 1; // Default to page 1
//         const limit = parseInt(req.query.limit) || 10; // Default to 10 items
//         const skipIndex = (page - 1) * limit;

//         const search = req.query.search || '';
//         const searchRegex = new RegExp(search, 'i');
//         const query = {
//         $or: [
//             { title: { $regex: searchRegex } },
//             { description: { $regex: searchRegex } },
//             {seller_id: { $regex: searchRegex } },
//             {categories: { $regex: searchRegex } },
//           //  {subcategories: { $regex: searchRegex } },
//             { 'categories.name': { $regex: searchRegex } },
//           //  { 'subcategories.name': { $regex: searchRegex } },
//             { 'seller_id.name': { $regex: searchRegex } },
//         ]
//         };
//         const products = await Product.find(query)
//         .sort({ created_at: -1 })
//         .skip(skipIndex)
//         .limit(limit)
//         .populate('seller_id', 'name email')
//         .populate('categories', 'name');

//         const totalProducts = await Product.countDocuments(query);
//         const totalPages = Math.ceil(totalProducts / limit);
//         return response.success(res, 'Product list fetched', {
//         products,
//         total: totalProducts,
//         totalPages,
//         currentPage: page,
//         pageSize: limit,

//         });
//     } catch (error) {
//         console.error(error);
//         return response.serverError(res, 'Failed to fetch products');
//     }
// };

// exports.getAllProducts = async (req, res) => {
//   try {
//     const { search } = req.query;
//     let filter = {};

//     if (search) {
//       const searchRegex = new RegExp(search, 'i');

//       // Step 1: Find matching IDs
//       const matchingCategories = await Category.find({ name: searchRegex }).select('_id');
//     //   const matchingSubcategories = await Subcategory.find({ name: searchRegex }).select('_id');
//       const matchingSellers = await Seller.find({ name: searchRegex }).select('_id');

//       // Step 2: Prepare list of IDs
//       const categoryIds = matchingCategories.map(c => c._id);
//     //   const subcategoryIds = matchingSubcategories.map(sc => sc._id);
//       const sellerIds = matchingSellers.map(s => s._id);

//       // Step 3: Compose $or query
//       filter.$or = [
//         { title: { $regex: searchRegex } },
//         { description: { $regex: searchRegex } },
//         { seller_id: { $in: sellerIds } },
//         { categories: { $in: categoryIds } },
//         // { subcategories: { $in: subcategoryIds } },
//       ];
//     }

//     const products = await Product.find(filter)
//       .populate('categories seller_id');

//     res.status(200).json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

exports.getAllProducts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const {
        title,
        description,
        seller,       // seller name
        store_id,    // store ID for filtering
        category, 
        category_id,    // category name
        subcategory,// if needed later
        subcategory_id, // if needed later
        userId,      // user ID for filtering
      } = req.query;
  
      const filter = {};

      if (userId === 'true') {
        if (!req.user || !req.user._id) {
          return response.unauthorized(res, 'Login required to access your products.');
        }
        filter.seller_id = req.user._id;
        filter.is_active = true;
      } else {
        // Optional filters
        if (title) {
          filter.title = { $regex: new RegExp(title, 'i') };
        }
        if (description) {
          filter.description = { $regex: new RegExp(description, 'i') };
        }
        if (seller) {
          const sellers = await Seller.find({ name: { $regex: new RegExp(seller, 'i') } }).select('_id');
          const sellerIds = sellers.map(s => s._id);
          filter.seller_id = { $in: sellerIds };
        }
        if (store_id) {
          const stores = await Store.find({ _id: store_id }).select('_id');
          const storeIds = stores.map(s => s._id);
          filter.store_id = { $in: storeIds };
        }
        if (category) {
          const categories = await Category.find({ name: { $regex: new RegExp(category, 'i') } }).select('_id');
          const categoryIds = categories.map(c => c._id);
          filter.categories = { $in: categoryIds };
        }
        if(category_id){
            const categories = await Category.find({ _id: category_id }).select('_id');
            const categoryIds = categories.map(c => c._id);
            filter.categories = { $in: categoryIds };

        }
        if (subcategory_id) {
            const subcategories = await SubCategory.find({ _id: subcategory_id }).select('_id');
            const subcategoryIds = subcategories.map(sc => sc._id);
            filter.subcategories = { $in: subcategoryIds };
          }
        if (subcategory) {
            const subcategoryQuery = Array.isArray(subcategory)
              ? req.query.subcategory
              : req.query.subcategory.split(',');
          
            const subcategories = await SubCategory.find({
              name: { $in: subcategoryQuery.map(name => new RegExp(name.trim(), 'i')) }
            }).select('_id');
          
            const subcategoryIds = subcategories.map(sc => sc._id);
            filter.subcategories = { $in: subcategoryIds };
          }
          
      }
  
  
      // Add subcategory filtering if needed later
  
      const [products, totalProducts] = await Promise.all([
        Product.find(filter)
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .populate('seller_id', 'name email')
          .populate('store_id', 'storeName')
          .populate('categories', 'name')
          .populate('subcategories', 'name'),
        Product.countDocuments(filter)
      ]);
  
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

exports.getAllProductsSeller = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, subcategory, category } = req.query;

    if (!req.user || !req.user.id) {
      return response.validationError(
        res,
        "Login required to access your products."
      );
    }

    const sellerId = req.user.id;

    let filter = {
      seller_id: sellerId,
    };

    if (status) {
      filter.status = status;
    }

    if (category) {
      const categories = await Category.find({
        name: { $regex: new RegExp(category, "i") },
      }).select("_id");
      const categoryIds = categories.map((c) => c._id);
      filter.categories = { $in: categoryIds };
    }

    if (subcategory) {
      const subcategoryQuery = Array.isArray(subcategory)
        ? req.query.subcategory
        : req.query.subcategory.split(",");

      const subcategories = await SubCategory.find({
        name: {
          $in: subcategoryQuery.map((name) => new RegExp(name.trim(), "i")),
        },
      }).select("_id");

      const subcategoryIds = subcategories.map((sc) => sc._id);
      filter.subcategories = { $in: subcategoryIds };
    }
    console.log(filter);
    const totalProducts = await Product.countDocuments(filter);

    if (totalProducts === 0) {
      return response.success(res, "No products found.");
    }

    const products = await Product.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate("seller_id", "name email")
      .populate("categories", "name")
      .populate("subcategories", "name");

    const totalPages = Math.ceil(totalProducts / limit);

    return response.success(res, "Product list fetched", {
      products,
      total: totalProducts,
      totalPages,
      currentPage: page,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Failed to fetch products");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("seller_id", "name email")
      .populate("categories", "name")
      .populate("subcategories", "name")
      .lean();

    if (!product) return response.notFound(res, "Product not found");

    return response.success(res, "Product fetched successfully", product);
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Failed to fetch product");
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) return response.notFound(res, "Product not found");

    return response.success(res, "Product updated successfully", {
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Failed to update product");
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return response.notFound(res, "Product not found");

    return response.success(res, "Product deleted successfully");
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Failed to delete product");
  }
};
