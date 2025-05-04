const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String, required: true },
  storeDescription: { type: String },
  storeLogo: { type: String },
  businessEmail: { type: String },
  businessPhone: { type: String },
  businessAddress: { type: String },
  postcode: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  website: { type: String },
  socialLinks: {
    instagram: { type: String },
    facebook: { type: String },
    tiktok: { type: String }
  },
  storeType: { type: String, enum: ['online', 'instore']},
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  productsCount: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
