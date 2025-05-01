const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const faqSchema = new Schema({
  faqs: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Faqs = mongoose.model("Faq", faqSchema);

module.exports = Faqs;
