const express = require("express");
const ctrl = require("../controllers/app.controller");
const verifyToken = require("../middleware/auth");
const route = express.Router();
const {upload} = require('../utils/imageUpload');


route.post('/uploadImage',[ upload.single('image')], ctrl.handleImageUpload);
route.post('/uploadFile',[ upload.single('file')], ctrl.handleFileUpload);

module.exports = route;

