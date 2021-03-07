const express = require('express');
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const router = express.Router();

router.get('/login', authController().login);
router.get('/register', authController().register);
router.get('/cart', cartController().index);
router.get('/', homeController().index);

module.exports = router;
