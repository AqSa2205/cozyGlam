const Faqs = require("../models/faqs");
const response = require("../utils/responseHelpers");

exports.createFaqs = async (req, res) => {
  try {
    const newFaqsObj = req.body;
    const newFaqs = new Faqs(newFaqsObj);
    await newFaqs.save();
    return response.success(
      res,
      "Faqs created successfully",
      {newFaqs}
    );
  } catch (error) {
    console.log(error)
    return response.serverError(res, "An error occurred", error);
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const Faqss = await Faqs.find();
    return response.success(
      res,
      "Faqss fetched successfully",
      {Faqss}
    );
  } catch (error) {
    return response.serverError(res, "An error occurred", error);
  }
};

exports.updateFaqs = async (req, res) => {
        try {
          const FaqsId = req.params.id;
          const FaqsObj = req.body;
      
          // Use $set to update specific fields
          const Faq = await Faqs.findByIdAndUpdate(
            FaqsId,
            { $set: FaqsObj },
            { new: true, runValidators: true } // 'new: true' returns the updated document
          );
      
          if (!Faq) {
            return response.badRequest(res, "Faqs not found");
          }
      
          return response.success(res, "Faqs updated successfully", { Faq });
        } catch (error) {
          console.log(error);
          return response.serverError(res, "An error occurred", error);
        }
      };
      

exports.deleteFaqs = async (req, res) => {
  try {
    const Faqs = await Faqs.findByIdAndDelete(req.params.id);
    if (!Faqs) {
      return response.notFound(res, "Faqs not found");
    }
    return response.success(res, "Faqs deleted successfully");
  } catch (error) {
    return response.serverError(res, "An error occurred", error);
  }
};
