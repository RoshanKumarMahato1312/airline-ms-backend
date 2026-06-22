const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/me', userController.getProfile);
router.get('/', authorizeRoles('admin'), userController.getAllUsers);
router.route('/:id')
  .get(authorizeRoles('admin'), userController.getUser)
  .patch(authorizeRoles('admin'), userController.updateUser)
  .delete(authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
