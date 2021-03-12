const express = require('express');
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

const router = express.Router();

router.get('/login', guest, authController().login);
router.post('/login', authController().postLogin);
router.get('/register', guest, authController().register);
router.post('/register', authController().postRegister);
router.post('/logout', authController().logout);

// Customer routes
router.get('/cart', cartController().index);
router.post('/update-cart', cartController().update);

router.post('/orders', auth, orderController().store);
router.get('/customers/orders', auth, orderController().index);
router.get('/customer/orders/:id', auth, orderController().show);

// Admin routes
router.get('/admin/orders', auth, admin, adminOrderController().index);
router.post('/admin/order/status', auth, admin, statusController().update);

router.get('/', homeController().index);

module.exports = router;
