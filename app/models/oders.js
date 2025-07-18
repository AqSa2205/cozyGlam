const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
      quantity: Number,
      price: Number,
      seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
  ],
  shipping_cost: Number,
  total_amount: Number,
  payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  order_status: { type: String, enum: ['pending','accepted','shipped', 'delivered', 'cancelled'], default: 'pending' },
  shipping_address: {
    street: String,
    city: String,
    state: String,
    zip_code: String,
    country: String
  },
  payment_method: { type: String, enum: ['COD', 'credit_card', 'paypal', 'klarna', 'google_pay'] },
  transaction_id: String,
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});
const Order = mongoose.model('orders', orderSchema)
module.exports = Order;