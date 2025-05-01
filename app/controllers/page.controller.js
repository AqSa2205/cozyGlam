const Page = require("../models/page");

// Create a new page
exports.createPage = async (req, res) => {
  try {
    const { name, is_active, sub_pages } = req.body;
    const newPage = new Page({ name, is_active, sub_pages });
    await newPage.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Page created successfully",
        page: newPage,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating page", error });
  }
};

// Get all pages
exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json({ success: true, pages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error retrieving pages", error });
  }
};

// Get a single page by ID
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }
    res.status(200).json({ success: true, page });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error retrieving page", error });
  }
};

// Update a page by ID
exports.updatePage = async (req, res) => {
  try {
    const { name, is_active, sub_pages } = req.body;
    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      { name, is_active, sub_pages },
      { new: true, runValidators: true }
    );
    if (!updatedPage) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Page updated successfully",
        page: updatedPage,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating page", error });
  }
};

// Delete a page by ID
exports.deletePage = async (req, res) => {
  try {
    const deletedPage = await Page.findByIdAndDelete(req.params.id);
    if (!deletedPage) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting page", error });
  }
};
