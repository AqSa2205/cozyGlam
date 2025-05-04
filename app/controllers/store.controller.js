const Store = require('../models/store');
const User = require('../models/users');
const response = require('../utils/responseHelpers');
const mongoose = require('mongoose');

// Create a new store
exports.createStore = async (req, res) => {
  try {
    const userId  = req.user.id; // From auth middleware
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

exports.getAllStore = async (req, res) => {
  try {
    const { search, isActive, isOnline } = req.query;
    let query = {};

    // Optional filters
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (isOnline !== undefined) query.isOnline = isOnline === "true";

    // Search on storeName or userId or user's name
    if (search) {
      const searchRegex = new RegExp(search, 'i');

      const matchedUsers = await User.find({
        $or: [
          { name: searchRegex },
          { _id: mongoose.Types.ObjectId.isValid(search) ? search : null }
        ]
      }).select('_id');
      // const userIds =  req.user.id;
      const userIds = matchedUsers.map(user => user._id);

      query.$or = [
        { storeName: searchRegex },
        { userId: { $in: userIds } }
      ];
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const stores = await Store.find(query)
      .populate('userId', 'name email phone_number')
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit);

    const totalStore = await Store.countDocuments(query);
    const totalPages = Math.ceil(totalStore / limit);

    const message = stores.length === 0 ? "No stores found" : "Stores loaded successfully";

    return response.success(res, message, {
      stores,
      totalPages,
      currentPage: page,
      totalStore
    });

  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message, "Failed to load Stores");
  }
};



exports.updateStore = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    const store = await Store.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );

    if (!store) return response.notFound(res, 'Store not found');
    return response.success(res, 'Store updated successfully', store);
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
