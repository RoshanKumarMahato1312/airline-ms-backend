const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const airportController = require('../controllers/airportController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin', 'staff', 'passenger'), airportController.getAirports)
  .post(authorizeRoles('admin'), airportController.createAirport);

router.route('/:id')
  .get(authorizeRoles('admin', 'staff', 'passenger'), airportController.getAirport)
  .patch(authorizeRoles('admin'), airportController.updateAirport)
  .delete(authorizeRoles('admin'), airportController.deleteAirport);

module.exports = router;
