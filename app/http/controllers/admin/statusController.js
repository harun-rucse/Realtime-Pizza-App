const Order = require('../../../models/orderModel');

function statusController() {
  return {
    async update(req, res) {
      try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        return res.redirect('/admin/orders');
      } catch (err) {
        return res.redirect('/admin/orders');
      }
    }
  };
}

module.exports = statusController;
