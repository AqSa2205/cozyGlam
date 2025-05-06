const express = require("express");
const user = require("../controllers/users.controller");
// const verifyToken = require("../middleware/auth");
const user_route = express.Router();
const verifyToken = require("../middleware/auth");


user_route.post('/login', user.login);
// user_route.patch('/v2/accSetting',[verifyToken], user.accSetting);
// user_route.post('/login', user.loginAdmin);
user_route.post('/signup', user.signup);
user_route.get('/getProfile',[verifyToken], user.getProfile); // Get all users
module.exports = user_route;

