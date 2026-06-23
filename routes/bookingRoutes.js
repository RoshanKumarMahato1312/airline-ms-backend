const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin', 'staff', 'passenger'), bookingController.getBookings)
  .post(authorizeRoles('passenger'), bookingController.createBooking);

// Flight-specific bookings (staff/admin)
router.get('/flight/:flightId', authorizeRoles('admin', 'staff'), bookingController.getBookingsByFlight);
router.patch('/flight/:flightId/boarding', authorizeRoles('admin', 'staff'), bookingController.bulkUpdateBoardingStatus);

router.route('/:id')
  .get(authorizeRoles('admin', 'staff', 'passenger'), bookingController.getBooking)
  .patch(authorizeRoles('admin', 'staff', 'passenger'), bookingController.updateBooking)
  .delete(authorizeRoles('admin'), bookingController.deleteBooking);

router.patch('/:id/cancel', authorizeRoles('admin', 'staff', 'passenger'), bookingController.cancelBooking);
router.patch('/:id/boarding', authorizeRoles('admin', 'staff'), bookingController.updateBoardingStatus);
router.get('/:id/ticket', authorizeRoles('admin', 'staff', 'passenger'), bookingController.downloadTicket);

module.exports = router;

