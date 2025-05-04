const express = require('express');
const category_router = express.Router();
const cc = require('../controllers/categories.controller');
const verifyToken = require("../middleware/auth");


category_router.post('/createcategories', [verifyToken], cc.createCategory);
category_router.get('/allcategories',  cc.getAllCategories);
// category_router.get('/allcategoriesWEB', cc.getAllCategories);
// category_router.get('/categoriesId/:id',[verifyToken], cc.getCategoryById);
category_router.put('/update/:id',[verifyToken], cc.updateCategory);
category_router.delete('/delete/:id',[verifyToken], cc.deleteCategory);

module.exports = category_router;
