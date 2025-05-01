const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  isActive:{
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
