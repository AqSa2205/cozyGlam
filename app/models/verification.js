// models/Verification.js
const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  
  identity_document: { type: String, required: true },
  crn_number: { type: String, required: true },
  crn_document: { type: String, required: true },
  
  vat_number: { type: String, required: true },
  vat_document: { type: String, required: true },

  utility_bill: { type: String, required: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  submitted_at: { type: Date, default: Date.now },
  reviewed_at: { type: Date }
});

module.exports = mongoose.model('Verification', verificationSchema);
