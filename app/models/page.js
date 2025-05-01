const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  sub_pages: [{
    name: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    }
  }]
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Page', pageSchema);
