const Team = require("../models/ourTeam");
const ChooseUs = require("../models/chooseUs");
const Clinic = require("../models/clinic");
const response = require("../utils/responseHelpers");

// GET API to fetch data
module.exports.getTeamData = async (req, res) => {
  try {
    const data = await Team.find();
    console.log(data);
    return response.success(res, "Data retrieved successfully", { data });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to retrieve data", error);
  }
};

// UPDATE API to update data
module.exports.updateTeamData = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    update.updated_at = new Date();

    const updatedData = await Team.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedData) {
      return response.notFound(res, "Data not found");
    }

    return response.success(res, "Data updated successfully", { updatedData });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to update data", error);
  }
};

module.exports.getChooseUsData = async (req, res) => {
  try {
    const data = await ChooseUs.find();
    return response.success(res, "Data retrieved successfully", { data });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to retrieve data", error);
  }
};

// UPDATE API to update data
module.exports.updateChooseUsData = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    update.updated_at = new Date();

    const updatedData = await ChooseUs.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedData) {
      return response.notFound(res, "Data not found");
    }

    return response.success(res, "Data updated successfully", { updatedData });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to update data", error);
  }
};

module.exports.getClinicData = async (req, res) => {
  try {
    const data = await Clinic.find();
    return response.success(res, "Data retrieved successfully", { data });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to retrieve data", error);
  }
};

// UPDATE API to update data
module.exports.updateClinicData = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    update.updated_at = new Date();

    const updatedData = await Clinic.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedData) {
      return response.notFound(res, "Data not found");
    }

    return response.success(res, "Data updated successfully", { updatedData });
  } catch (error) {
    console.error(error);
    return response.serverError(res, "Unable to update data", error);
  }
};
