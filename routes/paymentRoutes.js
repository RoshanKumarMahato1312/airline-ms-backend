const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin', 'staff', 'passenger'), paymentController.getPayments)
  .post(authorizeRoles('admin', 'staff', 'passenger'), paymentController.createPayment);

router.route('/:id')
  .get(authorizeRoles('admin', 'staff', 'passenger'), paymentController.getPayment)
  .patch(authorizeRoles('admin', 'staff'), paymentController.updatePayment)
  .delete(authorizeRoles('admin'), paymentController.deletePayment);

module.exports = router;
