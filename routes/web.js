const express = require('express');
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middlewares/guest');

const router = express.Router();

router.get('/login', guest, authController().login);
router.post('/login', authController().postLogin);
router.get('/register', guest, authController().register);
router.post('/register', authController().postRegister);
router.post('/logout', authController().logout);

router.get('/cart', cartController().index);
router.post('/update-cart', cartController().update);
router.get('/', homeController().index);

module.exports = router;
