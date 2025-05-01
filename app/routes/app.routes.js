const express = require("express");
const ctrl = require("../controllers/app.controller");
const verifyToken = require("../middleware/auth");
const route = express.Router();
const {upload} = require('../utils/imageUpload');

//const { handleImageUpload, handleFileUpload } = require('../controllers/app.controller');

route.post('/uploadImage',[ upload.single('image')], ctrl.handleImageUpload);

module.exports = route;

