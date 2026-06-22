const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const aircraftController = require('../controllers/aircraftController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin', 'staff', 'passenger'), aircraftController.getAircrafts)
  .post(authorizeRoles('admin'), aircraftController.createAircraft);

router.route('/:id')
  .get(authorizeRoles('admin', 'staff', 'passenger'), aircraftController.getAircraft)
  .patch(authorizeRoles('admin'), aircraftController.updateAircraft)
  .delete(authorizeRoles('admin'), aircraftController.deleteAircraft);

module.exports = router;
