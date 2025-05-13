const Store = require('../models/store');
const User = require('../models/users');
const Product = require('../models/products');
const Orders = require('../models/oders');
const Verification = require('../models/verification');
const response = require('../utils/responseHelpers');
const mongoose = require('mongoose');


exports.createStore = async (req, res) => {
  try {
    const userId  = req.user.id; 
    const {
      storeName,
      storeDescription,
      storeLogo,
      storeType,
      businessEmail,
      businessPhone,
      businessAddress,
      postcode,
      country,
      city,
      state,
      website,
      socialLinks
    } = req.body;

    const storeExists = await Store.findOne({ userId });
    if (storeExists) {
      return response.badRequest(res, 'Store already exists for this seller');
    }
    console.log('userId this is workking');
    console.log(userId);
    const newStore = new Store({
      userId,
      storeName,
      storeDescription,
      storeLogo,
      storeType,
      businessEmail,
      businessPhone,
      businessAddress,
      postcode,
      country,
      city,
      state,
      website,
      socialLinks
    });

    await newStore.save();

    await User.findByIdAndUpdate(userId, { isStoreCreated: true });

    return response.success(res, 'Store created successfully', {newStore});
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to create store');
  }
};

exports.submitVerification = async (req, res) => {
  try {
    const seller_id = req.user.id;
    const {
      store_id,
      crn_number,
      vat_number,
      identity_document,
      utility_bill,
      crn_document,
      vat_document,
    } = req.body;
  
    // Validate required fields
    if (
      !store_id ||
      !crn_number ||
      !vat_number ||
      !identity_document ||
      !utility_bill||
      !crn_document ||
      !vat_document
    ) {
      return response.validationError(res, "All fields and document URLs are required.");
    }
  
    // Check if verification already exists
    const existing = await Verification.findOne({ seller_id });
    if (existing) {
      return response.badRequest(res, "Verification already submitted.");
    }
  
    const verification = new Verification({
      store_id,
      seller_id,
      crn_number,
      vat_number,
      identity_document,
      utility_bill,
      crn_document,
      vat_document,
    });
  
    await verification.save();
  
    return response.success(res, "Verification submitted successfully", { verification });
  
  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message || "Failed to submit verification");
  }
  
};



exports.getAllStore = async (req, res) => {
  try {
    const { search, isActive, isOnline } = req.query;
    let query = {};

    if (req.user && req.user.id) {
      query.userId = req.user.id;
    }

    if (isActive !== undefined) query.isActive = isActive === "true";
    if (isOnline !== undefined) query.isOnline = isOnline === "true";

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchedUsers = await User.find({
        $or: [
          { name: searchRegex },
          { _id: mongoose.Types.ObjectId.isValid(search) ? search : null }
        ]
      }).select('_id');

      const userIds = matchedUsers.map(user => user._id);
      const searchCondition = [
        { storeName: searchRegex },
        { userId: { $in: userIds } }
      ];

      if (req.user && req.user.id) {
        query.$and = [
          { userId: req.user.id },
          { $or: searchCondition }
        ];
      } else {
        query.$or = searchCondition;
      }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const stores = await Store.find(query)
      .populate('userId', 'name email phone_number')
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit);

    // Get product count for each store
    const storeWithProductCount = await Promise.all(
      stores.map(async (store) => {
        const productCount = await Product.countDocuments({ store_id: store._id });
        return {
          ...store.toObject(),
          productCount
        };
      })
    );

    const totalStore = await Store.countDocuments(query);
    const totalPages = Math.ceil(totalStore / limit);
    const message = stores.length === 0 ? "No stores found" : "Stores loaded successfully";

    return response.success(res, message, {
      stores: storeWithProductCount,
      totalPages,
      currentPage: page,
      totalStore
    });

  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message || "Failed to load Stores");
  }
};


exports.updateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const store = await Store.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );

    console.log(userId);

    if (!store) return response.notFound(res, 'Store not found');
    return response.success(res, 'Store updated successfully', {store});
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to update store');
  }
};

// Delete store
exports.deleteStore = async (req, res) => {
  try {
    const { userId } = req.user;
    const store = await Store.findOneAndDelete({ userId });

    if (!store) return response.notFound(res, 'Store not found');
    return response.success(res, 'Store deleted successfully');
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to delete store');
  }
};

// Admin: Get all stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    return response.success(res, 'All stores fetched', stores);
  } catch (error) {
    console.error(error);
    return response.serverError(res, 'Failed to fetch stores');
  }
};

// accept order by store
exports.acceptOrder = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { orderId } = req.params;

    if (req.user.role !== 'seller') {
      return response.unauthorized(res, "Only sellers can accept orders.");
    }

    const order = await Orders.findById(orderId);
    if (!order) {
      return response.notFound(res, "Order not found.");
    }

    let sellerHasProduct = false;

    // Update product statuses and stock
    for (let item of order.products) {
      if (item.seller_id.toString() === sellerId) {
        sellerHasProduct = true;

        // Decrease stock
        const product = await Product.findById(item.product_id);
        if (!product) {
          return response.notFound(res, `Product with ID ${item.product_id} not found.`);
        }

        if (product.quantity < item.quantity) {
          return response.badRequest(res, `Insufficient stock for ${product.title}`);
        }

        product.quantity -= item.quantity;
        await product.save();

        // Mark order item as accepted
        item.status = "accepted";
      }
    }

    if (!sellerHasProduct) {
      return response.badRequest(res, "You are not authorized to accept this order.");
    }

    // If all products are accepted, update overall order status
    const allAccepted = order.products.every((item) => item.status === "accepted");
    if (allAccepted) {
      order.status = "processing"; // Or another appropriate status
    }

    await order.save();

    return response.success(res, "Order accepted and stock updated", {
      orderId: order._id,
      updated: true
    });

  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message || "Failed to accept order");
  }
};
