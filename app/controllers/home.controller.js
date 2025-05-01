const Home = require("../models/home");
const response = require("../utils/responseHelpers");

// GET API to fetch data
module.exports.getData = async (req, res) => {
  try {
    const data = await Home.find();
    return response.success(res, "Data retrieved successfully", {data});
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to retrieve data", error);
  }
};

// UPDATE API to update data
module.exports.updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    update.updated_at = new Date();

    const updatedData = await Home.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedData) {
      return response.notFound(res, "Data not found");
    }

    return response.success(res, "Data updated successfully", {updatedData});
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to update data", error);
  }
};
