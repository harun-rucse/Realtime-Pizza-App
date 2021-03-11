const moment = require('moment');
const Order = require('../../../models/orderModel');

function orderController() {
  return {
    async store(req, res) {
      try {
        const { phone, address } = req.body;

        if (!phone || !address) {
          req.flash('error', 'All fields are required');
          return res.redirect('/cart');
        }

        await Order.create({
          customerId: req.user._id,
          items: req.session.cart.items,
          phone,
          address
        });

        req.flash('success', 'Order placed successfully');
        delete req.session.cart;
        res.redirect('/customers/orders');
      } catch (err) {
        req.flash('error', 'Something went wrong');
      }
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }).sort({
        createdAt: -1
      });

      res.header(
        'Cache-Control',
        'no-cache, private, no-this.store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
      );
      res.render('customers/orders', { orders, moment });
    }
  };
}

module.exports = orderController;
