const { default: mongoose } = require("mongoose");
const SubCategory = require("../models/subCategories");
const response = require("../utils/responseHelpers");
const { ROLE_IDS } = require("../utils/utility");

const createsubCategory = async (req, res) => {
  if (req.user.role !== ROLE_IDS.admin)
    return response.authError(
      res,
      "You don't have permission to perform this action"
    );
  try {
    console.log(req.user);
    const { name, image, type, category } = req.body;
    const subcategory = new SubCategory({
      name,
      image: req.body.imageUrl,
      type,
      category,
    });
    await subcategory.save();
    return response.success(res, "Subategory created successfully", {
      subcategory,
    });
  } catch (error) {
    return response.badRequest(
      res,
      error.message,
      "Sorry something went wrong."
    );
  }
};
// const getAllSubCategories = async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = {};
//     if (search) {
//       query = { name: { $regex: new RegExp(search, "i") } };
//     }
//     if (req.query.type) {
//       query.type = req.query.type;
//     }
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
//     const limit = parseInt(req.query.limit) || 10; // Default limit to 10 items per page
//     const skipIndex = (page - 1) * limit;
//     const subcategories = await SubCategory.find(query)
//     .populate("category", "name")
//       .sort({ createdAt: -1 })
//       .skip(skipIndex)
//       .limit(limit);
//     const totalSubCategory = await SubCategory.countDocuments(query);
//     const totalPages = Math.ceil(totalSubCategory / limit);
//      // Use a consistent structure for the response
//     const message = subcategories.length === 0 ? "No categories found" : "Sub Categories loaded successfully";
//     return response.success(res, message, { subcategories, totalPages, currentPage: page, totalSubCategory});

//   } catch (error) {
//     console.log(error);
//     return response.serverError(res, error.message, "Failed to load sub Categories");
//   }
// };

const getAllSubCategories = async (req, res) => {
  try {
    const { search, type, categoryId } = req.query;
    // const { categoryId } = req.params;

    let query = {};

    // Filter by category (from params)
    if (categoryId) {
      query.category = categoryId;
    }

    // Search by name
    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const subcategories = await SubCategory.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit);

    const totalSubCategory = await SubCategory.countDocuments(query);
    const totalPages = Math.ceil(totalSubCategory / limit);

    const message =
      subcategories.length === 0
        ? "No subcategories found"
        : "Subcategories loaded successfully";

    return response.success(res, message, {
      subcategories,
      totalPages,
      currentPage: page,
      totalSubCategory,
    });
  } catch (error) {
    console.error(error);
    return response.serverError(
      res,
      error.message || "Failed to load subcategories"
    );
  }
};

const updateSubCategory = async (req, res) => {
  try {
    if (req.user.role !== ROLE_IDS.admin) {
      return response.forbidden(
        res,
        "You don't have permission to perform this action"
      );
    }
    const subcategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!subcategory) {
      return response.notFound(
        res,
        `No Sub Category was found with the id of ${req.params.id}`
      );
    }
    return response.success(res, "Sub Category updated successfully.", {
      subcategory,
    });
  } catch (error) {
    response.serverError(
      res,
      error.message,
      `There was an error updating the
    Category with the id of ${req.params.id}`
    );
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return response.notFound(
        res,
        `No Sub Category was found with the id of ${req.params.id}`
      );
    }
    response.success(res, "The Sub Category has been deleted successfully");
  } catch (error) {
    response.serverError(
      res,
      error.message,
      `There was a problem deleting the sub Category
    with the id of ${req.params.id}`
    );
  }
};

module.exports = {
  createsubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
};
