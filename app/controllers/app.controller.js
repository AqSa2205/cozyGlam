const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const response = require("../utils/responseHelpers");
const { ObjectId } = require("mongodb");
const logger = require("../logger");
const ISODate = require("isodate");
const fs = require("fs");
const moment = require("moment");
const multer = require("multer");
const { upload } = require("../utils/imageUpload");
const { storage } = require("../utils/imageUpload");
require("dotenv").config();

exports.handleImageUpload = async (req, res) => {
  try {
    return response.success(res, "Successfully uploaded profile picture", {
      imageUrl: req.filepath,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return response.serverError(res, "Failed to upload image", error.message);
  }
};



exports.handleFileUpload = async (req, res) => {
  try {
    // Call the uploadFiles utility function
    //const fileUrl = await uploadFiles(req.file);
    return response.success(res, "Successfully uploaded file", { fileUrl: req.filepath });
  } catch (error) {
    console.error('Error uploading file:', error);
    return response.serverError(res, 'Failed to upload file', error.message);
  }
}
