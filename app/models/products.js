// const mongoose = require('mongoose');
// const Category = require('./categories');
// const SubCategory = require('./subCategories');
// const reviewSchema = require('./reviews');
// const User = require('./users');

// const ProductSchema = new mongoose.Schema({
//   seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   title: { type: String},
//   description: { type: String },
//   price: Number,
//   discount_price: Number,
//   inventory_count: Number,
//   categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
//   subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
//   tags: [String],
//   images: [String],
//   ratings: {
//     average: { type: Number, default: 0 },
//     count: { type: Number, default: 0 }
//   },
//   quanity: {tpe:Number},
//   reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviewSchema' }],
//   hipping_info: {
//     weight: Number,
//     dimensions: {
//       length: Number,
//       width: Number,
//       height: Number
//     },
//     origin_country: String,
//     shipping_class: String
//   },
//   status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
// },
// {
//     timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
//     versionKey: false
// });
// const Products =  mongoose.model('Products', ProductSchema)
// //export collection
// module.exports =  Products;

const mongoose = require('mongoose');
const Category = require('./categories');
const SubCategory = require('./subCategories');
const reviewSchema = require('./reviews'); // assumed to export a schema
const User = require('./users'); // make sure this registers the 'User' model

const ProductSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount_price: { type: Number },
  inventory_count: { type: Number, default: 0 },
  categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
  tags: [String],
  images: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  quantity: { type: Number, default: 0 }, // ✅ fixed typo from "quanity"
  reviews: [reviewSchema], // ✅ embed review schema (not as ObjectId)
  shipping_info: { // ✅ fixed typo from "hipping_info"
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    origin_country: String,
    shipping_class: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});

// Correct model name
const Products = mongoose.model('Product', ProductSchema);
module.exports = Products;
