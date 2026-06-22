const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin', 'staff', 'passenger'), bookingController.getBookings)
  .post(authorizeRoles('passenger'), bookingController.createBooking);

router.route('/:id')
  .get(authorizeRoles('admin', 'staff', 'passenger'), bookingController.getBooking)
  .patch(authorizeRoles('admin', 'staff', 'passenger'), bookingController.updateBooking)
  .delete(authorizeRoles('admin'), bookingController.deleteBooking);

router.patch('/:id/cancel', authorizeRoles('admin', 'staff', 'passenger'), bookingController.cancelBooking);
router.get('/:id/ticket', authorizeRoles('admin', 'staff', 'passenger'), bookingController.downloadTicket);

module.exports = router;
