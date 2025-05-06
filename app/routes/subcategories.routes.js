const express = require('express');
const category_router = express.Router();
const sc = require('../controllers/subcategories.controller');
const verifyToken = require("../middleware/auth");


category_router.post('/createsubcategories', [verifyToken], sc.createsubCategory);
category_router.get('/getsubcategories/',  sc.getAllSubCategories);
category_router.get('/subcategoriesId/:id',[verifyToken], sc.updateSubCategory);
category_router.delete('/delete/:id',[verifyToken], sc.deleteSubCategory);


module.exports = category_router;