const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authmiddleware = require('../middleware/authMiddleware');
const adminauthmiddleware = require('../middleware/adminAuthMiddleware');

// Common Dashboard (Public API)
router.get('/common', dashboardController.getCommonDashboard);
router.get('/user', authmiddleware, dashboardController.getUserDashboard);
router.get('/admin', adminauthmiddleware, dashboardController.getAdminDashboard);

module.exports = router;
