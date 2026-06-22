const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.use(protect, authorizeRoles('admin'));
router.get('/dashboard', reportController.getDashboardReport);

module.exports = router;
