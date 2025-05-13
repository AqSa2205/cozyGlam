const Orders = require('../models/oders');
const Product = require('../models/products');
const store = require('../models/store');
const User = require('../models/users');
const generateInvoice = require('../utils/generateInvoice');
const response = require('../utils/responseHelpers');

// customers flow

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
          store_id: product.store_id,
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

exports.completePayment = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const order = await Orders.findById(orderId).populate('buyer_id');
    if (!order) return response.notFound(res, "Order not found");

    order.payment_status = 'paid';
    await order.save();

    // Generate PDF
    const invoicePath = `invoices/invoice_${order._id}.pdf`;
    generateInvoice(order, order.buyer_id, invoicePath);

    return response.success(res, "Payment completed & invoice generated", {
      invoice_url: `${req.protocol}://${req.get('host')}/${invoicePath}`
    });

  } catch (err) {
    console.error(err);
    return response.serverError(res, err.message || "Failed to complete payment");
  }
};


//selller flow

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

exports.acceptOrder = async (req, res) => {
    try {
      const sellerId = req.user.id;
      const orderId = req.query.orderId;
  
      if (req.user.role !== 'seller') {
        return response.authError(res, "Only sellers can accept orders.");
      }
  
      const order = await Orders.findById(orderId);
      if (!order) {
        return response.notFound(res, "Order not found.");
      }
  
      let sellerHasProduct = false;
  
      for (let item of order.products) {
        if (item.seller_id.toString() === sellerId) {
          sellerHasProduct = true;
  
          const product = await Product.findById(item.product_id);
          if (!product) {
            return response.notFound(res, `Product with ID ${item.product_id} not found.`);
          }
  
          if (product.quantity < item.quantity) {
            return response.badRequest(res, `Insufficient stock for ${product.title}`);
          }
  
          product.quantity -= item.quantity;
          await product.save();
  
          item.status = "accepted";
        }
      }
  
      if (!sellerHasProduct) {
        return response.badRequest(res, "You are not authorized to accept this order.");
      }

      const allAccepted = order.products.every((item) => item.status === "accepted");
      if (allAccepted) {
        order.order_status = "accepted"; // ✅ set the order_status field
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
