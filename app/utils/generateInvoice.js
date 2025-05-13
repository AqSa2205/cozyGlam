// utils/generateInvoice.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order, customer, outputPath) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(outputPath));

  // Header
  doc.fontSize(20).text("Invoice", { align: 'center' });
  doc.moveDown();

  // Order Info
  doc.fontSize(12).text(`Invoice #: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Customer: ${customer.name}`);
  doc.text(`Email: ${customer.email}`);
  doc.moveDown();

  // Products Table
  doc.text("Products:");
  order.products.forEach(p => {
    doc.text(`- ${p.title} | Qty: ${p.quantity} | Unit Price: ${p.price_per_unit} | Total: ${p.total_price}`);
  });

  doc.moveDown();
  doc.text(`Subtotal: ${order.subtotal}`);
  doc.text(`Shipping: ${order.shipping_cost}`);
  doc.text(`Total: ${order.total_amount}`, { bold: true });

  doc.end();
};
module.exports = generateInvoice;
