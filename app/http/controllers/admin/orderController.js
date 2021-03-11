const Order = require('../../../models/orderModel');

function orderController() {
  return {
    async index(req, res) {
      const orders = await Order.find({ status: { $ne: 'completed' } })
        .populate('customerId')
        .sort({
          createdAt: -1
        });

      if (req.xhr) {
        return res.json(orders);
      } else {
        return res.render('admin/orders');
      }
    }
  };
}

module.exports = orderController;
