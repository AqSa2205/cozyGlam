const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    name: { type: String, required: true },
    images: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
