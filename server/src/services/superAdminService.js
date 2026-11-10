const User = require('../models/userModel');
const Item = require('../models/itemModel');
const Rental = require('../models/rentalModel');
const generateToken = require('../utils/generateToken');

async function loginAdmin(email, password) {
  if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
    return {
      success: false,
      statusCode: 500,
      message: 'Super Admin credentials are not configured',
    };
  }

  if (email !== process.env.SUPER_ADMIN_EMAIL || password !== process.env.SUPER_ADMIN_PASSWORD) {
    return {
      success: false,
      statusCode: 401,
      message: 'Invalid admin email or password',
    };
  }

  const token = generateToken('super-admin', true);

  return {
    success: true,
    statusCode: 200,
    message: 'Super Admin login successful',
    token,
  };
}

async function getAdminProfile() {
  return {
    success: true,
    statusCode: 200,
    data: {
      name: process.env.ADMIN_NAME || 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com',
      phone: process.env.ADMIN_PHONE || '9991053089',
      role: 'super-admin',
    },
  };
}

async function getUsers({ search = '', status = '', page = 1, limit = 10 }) {
  const query = { isDeleted: false };

  if (status) {
    query.accountStatus = status;
  }

  if (search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash -emailOTP')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  return {
    success: true,
    statusCode: 200,
    data: {
      users,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

async function updateUserStatus(userId, status) {
  if (!['active', 'blocked', 'suspended'].includes(status)) {
    return {
      success: false,
      statusCode: 400,
      message: 'Invalid status value. Must be active, blocked, or suspended.',
    };
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { accountStatus: status },
    { new: true }
  ).select('-passwordHash -emailOTP');

  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: 'User not found',
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: `User status successfully updated to ${status}`,
    data: user,
  };
}

async function getItems({ search = '', category = '', status = '', page = 1, limit = 10 }) {
  const query = { isDeleted: false };

  if (status) {
    query.availabilityStatus = status;
  }

  if (category) {
    query.categoryId = category;
  }

  if (search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { brand: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Item.find(query)
      .populate('ownerId', 'name email phone')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Item.countDocuments(query),
  ]);

  return {
    success: true,
    statusCode: 200,
    data: {
      items,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

async function deleteItem(itemId) {
  const item = await Item.findByIdAndUpdate(
    itemId,
    { isDeleted: true, availabilityStatus: 'paused' },
    { new: true }
  );

  if (!item) {
    return {
      success: false,
      statusCode: 404,
      message: 'Item not found',
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: 'Item successfully deleted by admin',
    data: item,
  };
}

async function getRentals({ status = '', page = 1, limit = 10 }) {
  const query = { isDeleted: false };

  if (status) {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [rentals, total] = await Promise.all([
    Rental.find(query)
      .populate('itemId', 'name images pricePerDay securityDeposit location')
      .populate('renterId', 'name email phone')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Rental.countDocuments(query),
  ]);

  return {
    success: true,
    statusCode: 200,
    data: {
      rentals,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

module.exports = {
  loginAdmin,
  getAdminProfile,
  getUsers,
  updateUserStatus,
  getItems,
  deleteItem,
  getRentals,
};
