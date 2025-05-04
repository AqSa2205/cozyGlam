const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    //unique: true,
    trim: true
  },
  image: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
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

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
