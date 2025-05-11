const Orders = require('../models/oders');
const Product = require('../models/products');
const User = require('../models/users');
const response = require('../utils/responseHelpers');

exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      shipping_address,
      payment_method,
    //   transaction_id
    } = req.body;

    if (!products || products.length === 0) {
      return response.validationError(res, 'No products provided.');
    }

    const buyer_id = req.user.id;

    const populatedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product_id).populate('seller_id');
        if (!product) throw new Error('Product not found');

        return {
          product_id: product._id,
          title: product.title,
          quantity: item.quantity,
          price: product.price,
          total_price: product.price * item.quantity,
          seller_id: product.seller_id._id,
        };
      })
    );
    console.log(populatedProducts);

    // const seller_id = populatedProducts[0].seller_id; // assuming all products are from same seller
    const subtotal = populatedProducts.reduce((sum, p) => sum + p.total_price, 0);
    const shipping_cost = 50; // flat or calculated shipping
    const total_amount = subtotal + shipping_cost;

    const order = new Orders({
      buyer_id,
      products: populatedProducts,      
      subtotal,
      shipping_cost,
      total_amount,
      payment_method,
    //   transaction_id,
      shipping_address
    });
    console.log(order);
    await order.save();

    // Notify seller logic here (email, socket, etc.)

    return response.success(res, 'Order placed successfully.', { order });
  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message, 'Failed to place order');
  }
};


exports.getOrders_customer = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      let query = {};
  
      if (req.user.role === 'seller') {
        query.seller_id = userId;
      } else if (req.user.role === 'customer') {
        query.buyer_id = userId;
      } else {
        return response.badRequest(res, 'Unauthorized role for fetching orders', 404);
      }
  
      const [orders, total] = await Promise.all([
        Orders.find(query)
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit),
        Orders.countDocuments(query)
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      return response.success(res, 'Orders fetched successfully', {
        orders,
        total,
        totalPages,
        currentPage: page,
        pageSize: limit
      });
  
    } catch (error) {
      console.error(error);
      return response.serverError(res, error.message, 'Failed to get orders');
    }
};

exports.getOrders_seller = async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      let query = {};
  
      if (req.user.role === 'seller') {
        // Match orders that include products from this seller
        query['products.seller_id'] = userId;
      } else if (req.user.role === 'customer') {
        query.buyer_id = userId;
      } else {
        return response.badRequest(res, 'Unauthorized role for fetching orders');
      }
  
      const [orders, total] = await Promise.all([
        Orders.find(query)
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .populate('products.product_id', 'title price') // optional
          .populate('buyer_id', 'name email') // optional
          .populate('products.seller_id', 'name email'),
        Orders.countDocuments(query)
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      return response.success(res, 'Orders fetched successfully', {
        orders,
        total,
        totalPages,
        currentPage: page,
        pageSize: limit
      });
  
    } catch (error) {
      console.error(error);
      return response.serverError(res, error.message, 'Failed to get orders');
    }
  };
  
  

exports.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) return response.notFound(res, 'Order not found');
    return response.success(res, 'Order details fetched', { order });
  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message, 'Failed to get order');
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status } = req.body;
    const order = await Orders.findByIdAndUpdate(
      req.params.id,
      { order_status },
      { new: true }
    );
    if (!order) return response.notFound(res, 'Order not found');
    return response.success(res, 'Order status updated', { order });
  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message, 'Failed to update order');
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Orders.findByIdAndDelete(req.params.id);
    if (!order) return response.notFound(res, 'Order not found');
    return response.success(res, 'Order deleted successfully');
  } catch (error) {
    console.error(error);
    return response.serverError(res, error.message, 'Failed to delete order');
  }
};
