const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminAuthMiddleware');
const adminController = require('../controllers/superAdminController');

// Public SuperAdmin Authentication
router.post('/login', adminController.login);

// Protected SuperAdmin Routes
router.get('/profile', adminMiddleware, adminController.getProfile);
router.get('/users', adminMiddleware, adminController.getUsers);
router.patch('/users/:id/status', adminMiddleware, adminController.updateUserStatus);
router.get('/items', adminMiddleware, adminController.getItems);
router.delete('/items/:id', adminMiddleware, adminController.deleteItem);
router.get('/rentals', adminMiddleware, adminController.getRentals);

module.exports = router;
