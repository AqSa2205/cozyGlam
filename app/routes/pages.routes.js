const express = require('express');
const router = express.Router();
const pageController = require('../controllers/page.controller');

router.post('/createPage', pageController.createPage);

router.get('/getPages', pageController.getPages);

router.put('/updatePage/:id', pageController.updatePage);

router.delete('/deletePage/:id', pageController.deletePage);

module.exports = router;
