'use strict';

let express = require('express');
let router = express.Router();
const user = require('./user.routes');
const category_router = require('./categories.routes');
const product = require('./products.routes');
const store = require('./store.routes');
// const service = require('./service.routes');
// const testimonial = require('./testimonial.routes');
// const blog = require('./blog.routes');
// const setting = require('./setting.routes');
// const app = require('./app.routes');
// const link = require('./links.routes');
// const home = require('./home.router');
// const faqs = require('./faqs.routes');
// const aboutUs = require('./aboutUs.routes');
// const page = require('./pages.routes');


router.use('/users', user);
router.use('/categories', category_router);
router.use('/products', product);
router.use('/store', store);
// router.use('/services', service);
// router.use('/testimonials', testimonial);
// router.use('/blogs', blog);
// router.use('/settings', setting);
// router.use('/app', app);
// router.use('/links', link);
// router.use('/home', home);
// router.use('/faqs', faqs);      
// router.use('/aboutUs', aboutUs);
// router.use('/pages', page);


module.exports = router;