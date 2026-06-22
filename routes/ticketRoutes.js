const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.use(protect);
router.get('/:bookingId', authorizeRoles('admin', 'staff', 'passenger'), ticketController.downloadTicket);

module.exports = router;
