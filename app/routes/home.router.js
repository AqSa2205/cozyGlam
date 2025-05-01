const express = require("express");
const router = express.Router();
const homectrl = require("../controllers/home.controller");

// GET route to fetch data
router.get("/getData", homectrl.getData);

// UPDATE route to update data by ID
router.put("/updateData/:id", homectrl.updateData);

module.exports = router;
