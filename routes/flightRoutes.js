const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const flightController = require('../controllers/flightController');

const router = express.Router();

router.get('/search', flightController.searchFlights);
router.get('/:id/seats', flightController.getFlightSeats);

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin', 'staff', 'passenger'), flightController.getFlights)
  .post(authorizeRoles('admin', 'staff'), flightController.createFlight);

router.route('/:id')
  .get(authorizeRoles('admin', 'staff', 'passenger'), flightController.getFlight)
  .patch(authorizeRoles('admin', 'staff'), flightController.updateFlight)
  .delete(authorizeRoles('admin'), flightController.deleteFlight);

module.exports = router;
