const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const response = require("../utils/responseHelpers");
const logger = require("../logger");
const {ROLE_IDS} = require("../utils/utility")
require("dotenv").config();

// module.exports.login = async (req, res) => {
//   try {
//     let { email, password } = req.body;
//     email = email ? email.trim() : undefined;

//     var user = await User.aggregate([
//       {
//         $match: { $or: [{ email: { $regex: new RegExp(email, "i") } }] },
//       },
//       { $limit: 1 },
//     ]);

//     if (user.length == 0) return response.notFound(res, "Invalid Credentials");
//     else user = user[0];

//     if (user && (await bcrypt.compare(password, user.password))) {
//       const token = jwt.sign(
//         { name: user.name, email: user.email, id: user._id },
//         process.env.SECRET_KEY,
//         {
//           expiresIn: "1d",
//         }
//       );

//       let obj = {
//         name: user.name,
//         email: user.email,
//         // token: token,
//       };

//       return response.success(res, "Login Successful", obj);
//     } else {
//       return response.notFound(res, "Invalid Credentials");
//     }
//   } catch (error) {
//     console.log(error);
//     logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
//     return response.serverError(res, "Something bad happened! Try Again Later");
//   }
// };

module.exports.login = async (req, res) => {
  try {
    let { phone_Number, email, password, fcmToken } = req.body;
    phone_Number = phone_Number ? phone_Number.trim() : undefined;

    //const user = await User.findOne({ phone_Number: phone_Number });
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) return response.notFound(res, "user not found");
    if (await bcrypt.compare(password, user.password)) {
      // User found and password is correct, create a JWT token
      const token = jwt.sign(
        {
          name: user.name,
          phone_number: user.phone_number,
          email: user.email,
          id: user._id,
          role_id: user.roles,
        },
        process.env.SECRET_KEY
      );
      //res.json({ token });
      // Create object to send as response
      let userShallow = user.toJSON();
      delete userShallow.password;
      const obj = {
        ...userShallow,
        //roles: user.ROLE_IDS,
        token: token,
        //fcmToken:  user.fcmToken,
      };

      // let fcmObj = {
      //   user_id: user._id,
      //   device_uid: req.headers.deviceid,
      //   token: req.body.fcmToken,
      // };
      // let fcm = new FcmToken(fcmObj);
      // await fcm.save();

      // Return success response
      return response.success(res, "Login Successful", { user: obj });
    } else {
      // Passwords do not match
      return response.notFound(res, "Invalid Credentials");
    }
  } catch (error) {
    // Log the error and return a server error response
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
};


module.exports.accSetting = async (req, res) => {
  try {
    const { name, old_password, new_password } = req.body;
    let updateQuery = {};
    let picturePath;

    if (name) {
      updateQuery.name = name.trim();
    }

    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return response.notFound(res, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(old_password, user.password);
    console.log(old_password + " " + user.password);

    if (!isPasswordValid) {
      return response.badRequest(res, "Old Password does not Match");
    }

    const encryptedPassword = await bcrypt.hash(new_password, 12);

    await User.updateOne({ _id: req.user.id }, { password: encryptedPassword });

    if (req.file) {
      picturePath = req.file.path;
      updateQuery.picture = picturePath;
    }

    await User.updateOne({ _id: req.user.id }, updateQuery);

    return response.success(res, "User details updated successfully");
  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return response.serverError(res, "Error! Try again later", error);
  }
};

module.exports.loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email ? email.trim() : undefined;
    let matchQuery = {};
    if (email) {
      matchQuery.email = { $regex: new RegExp(email, "i") };
    }

    var user = await User.aggregate([
      {
        $match: {
          email: email,
          // role_id: new ObjectId(adminRoleID),
        },
      },
      { $limit: 1 },
    ]);

    if (user.length == 0) return response.notFound(res, "Invalid Credentials");
    else user = user[0];

    // if (!user.is_active) return response.authError(res, "User is not active");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          // first_name: user.first_name,
          // last_name: user.last_name,
          email: user.email,
          id: user._id,
          // phone: user.phone,
          // role_id: user.role_id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      let obj = {
        // first_name: user.first_name,
        // last_name: user.last_name,
        email: user.email,
        _id: user._id,
        phone: user.phone,
        // role: "admin",
        token: token,
      };

      // if (req.body.fcm_token) {
      //   let fcmObj = {
      //     user_id: user._id,
      //     device_uid: req.headers.deviceuid,
      //     token: req.body.fcm_token,
      //   };
      //   await FcmToken.findOneAndDelete({ user_id: fcmObj.user_id });
      //   let fcm = new FcmToken(fcmObj);
      //   await fcm.save();
      // }

      return response.success(res, "Login Successful", obj);
    } else {
      return response.notFound(res, "Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
};

module.exports.signup = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      phone_number,
      role,
     // fcm_token,
      // image,
      // country,
      // city,
      // state,
      // additional,
    } = req.body;

    // Validate and process inputs
    if (!email || !password || !phone_number || !role) {
      return response.badRequest(
        res,
        "Email, Password, and Phone Number are required"
      );
    }

    email = email.toLowerCase().trim();
    phone_number = phone_number.trim();

    var roleId;
    console.log(role);
    switch (role) {
      case "seller":
        roleId = ROLE_IDS.seller;
        break;
      case "customer":
        roleId = ROLE_IDS.customer;
        break;
      case "admin":
        roleId = ROLE_IDS.admin;
        break;
      default:
        return response.badRequest(res, "Invalid role name");
    }

    // Encrypt the password and create new user
    const encryptedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    const newUser = new User({
      name,
      email,
      password: encryptedPassword,
      role: roleId, // Save the role ID
      phone_number: phone_number,
    });
    await newUser.save();
    console.log(newUser);
    // let fcmObj = {
    //   user_id: newUser._id,
    //   //device_uid: req.headers.deviceid,
    //   token: req.body.fcm_token,
    // };
    // let fcm = new FcmToken(fcmObj);
    // await fcm.save();

    // Generate JWT token
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id, role: roleId },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    console.log(token);
    return response.success(res, "Signup Successful", { user: newUser, token });
  } catch (error) {
    console.log(error.message);
    logger.error(`ip: ${req.ip}, url: ${req.url}, error: ${error.stack}`);
    return response.serverError(res, error.message, "Something bad happened! Try Again Later");
  }
};