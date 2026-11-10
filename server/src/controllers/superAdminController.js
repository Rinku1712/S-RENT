const adminService = require('../services/superAdminService');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await adminService.loginAdmin(email, password);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      ...(result.token && { token: result.token }),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Super Admin login failed',
    });
  }
}

async function getProfile(req, res) {
  try {
    const result = await adminService.getAdminProfile();
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin profile',
    });
  }
}

async function getUsers(req, res) {
  try {
    const { search, status, page, limit } = req.query;
    const result = await adminService.getUsers({ search, status, page, limit });
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;
    const result = await adminService.updateUserStatus(id, accountStatus);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user status',
    });
  }
}

async function getItems(req, res) {
  try {
    const { search, category, status, page, limit } = req.query;
    const result = await adminService.getItems({ search, category, status, page, limit });
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch catalog items',
    });
  }
}

async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const result = await adminService.deleteItem(id);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete item',
    });
  }
}

async function getRentals(req, res) {
  try {
    const { status, page, limit } = req.query;
    const result = await adminService.getRentals({ status, page, limit });
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rental bookings',
    });
  }
}

module.exports = {
  login,
  getProfile,
  getUsers,
  updateUserStatus,
  getItems,
  deleteItem,
  getRentals,
};
