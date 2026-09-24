const express = require('express');
const router = express.Router();
const {
  createOrder,
  createPaymentIntent,
  markOrderPaid,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect); // every order route requires login

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/create-payment-intent', createPaymentIntent);
router.put('/:id/pay', markOrderPaid);

module.exports = router;
