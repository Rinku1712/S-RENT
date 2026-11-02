const dashboardService = require('../services/dashboardService');

// Get Common Dashboard
const getCommonDashboard = async (req, res) => {
  try {
    const dashboardData = await dashboardService.getCommonDashboard();

    return res.status(200).json({
      success: true,
      message: 'Common Dashboard Data Fetched Successfully',
      data: dashboardData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUserDashboard = async (req, res) => {
  const userId = req.user._id;
  const userData = await dashboardService.getUserDashboard(userId);
  return res.status(200).json({
    success: true,
    message: 'User Dashboard Data Fetched Successfully',
    data: userData,
  });
};
const getAdminDashboard = async (req, res) => {
  const AdminDashboard = await dashboardService.getAdminDashboard();
  res.status(200).json({ message: 'Here is Admin Dashboard  ', data: AdminDashboard });
};

module.exports = {
  getCommonDashboard,
  getUserDashboard,
  getAdminDashboard,
};
