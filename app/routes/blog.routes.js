const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth");
const blogController = require('../controllers/blogs.controller');

router.post('/createBlog', [verifyToken], blogController.createBlog);
router.get('/getBlogs', blogController.getBlogs);
router.put('/updateBlog/:id', [verifyToken], blogController.updateBlog);
router.delete('/deleteBlog/:id', [verifyToken], blogController.deleteBlog);

module.exports = router;
