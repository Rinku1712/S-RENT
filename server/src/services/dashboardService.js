const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');
const Rental = require('../models/rentalModel');
const User = require('../models/userModel');

// Common Dashboard
const getCommonDashboard = async () => {
  // Get dashboard data together
  const [totalAvailableItems, totalCategories, recentItems] = await Promise.all([
    // Count available items
    Item.countDocuments({
      isDeleted: false,
      availabilityStatus: 'available',
    }),

    // Count active categories
    Category.countDocuments({
      isDeleted: false,
      isActive: true,
    }),

    // Get recently added items
    Item.find({
      isDeleted: false,
      availabilityStatus: 'available',
    })
      .populate('categoryId', 'name slug')
      .populate('ownerId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(8),
  ]);

  return {
    totalAvailableItems,
    totalCategories,
    recentItems,
  };
};
// User Dashboard
const getUserDashboard = async (userId) => {
  const [
    totalListedItems,
    activeListings,
    totalRentalRequests,
    pendingRentals,
    approvedRentals,
    totalMyRentalRequests,
    myPendingRentals,
    myApprovedRentals,
    rentalRevenue,
  ] = await Promise.all([
    // Items listed by logged-in user
    Item.countDocuments({
      ownerId: userId,
      isDeleted: false,
    }),

    // Active listings
    Item.countDocuments({
      ownerId: userId,
      isDeleted: false,
      availabilityStatus: 'available',
    }),

    // Rental requests received as owner
    Rental.countDocuments({
      ownerId: userId,
      isDeleted: false,
    }),

    // Pending requests received
    Rental.countDocuments({
      ownerId: userId,
      isDeleted: false,
      status: 'pending',
    }),

    // Approved requests received
    Rental.countDocuments({
      ownerId: userId,
      isDeleted: false,
      status: 'approved',
    }),

    // Total rental requests sent by logged-in user
    Rental.countDocuments({
      renterId: userId,
      isDeleted: false,
    }),

    // Pending rental requests sent
    Rental.countDocuments({
      renterId: userId,
      isDeleted: false,
      status: 'pending',
    }),

    // Approved rental requests sent
    Rental.countDocuments({
      renterId: userId,
      isDeleted: false,
      status: 'approved',
    }),

    // Sum rent amounts for completed rentals owned by the logged-in user.
    Rental.aggregate([
      {
        $match: {
          ownerId: userId,
          isDeleted: { $ne: true },
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalRentalRevenue: { $sum: '$totalAmount' },
          completedRentalCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const revenueSummary = rentalRevenue[0] || {
    totalRentalRevenue: 0,
    completedRentalCount: 0,
  };

  return {
    totalListedItems,
    activeListings,

    // Requests received as owner
    totalRentalRequests,
    pendingRentals,
    approvedRentals,

    // Requests sent as renter
    totalMyRentalRequests,
    myPendingRentals,
    myApprovedRentals,
    totalRentalRevenue: revenueSummary.totalRentalRevenue,
    completedRentalCount: revenueSummary.completedRentalCount,
  };
};
// Admin Dashboard
const getAdminDashboard = async () => {
  const [
    totalUsers,
    activeUsers,
    deletedUsers,
    totalItems,
    availableItems,
    pausedItems,
    totalCategories,
    totalRentals,
    pendingRentals,
    approvedRentals,
    rejectedRentals,
    completedRentals,
  ] = await Promise.all([
    // Total registered users (SuperAdmin is not included)
    User.countDocuments({ isDeleted: false }),

    // Active users
    User.countDocuments({
      isDeleted: false,
      accountStatus: 'active',
    }),

    // Deleted users
    User.countDocuments({ isDeleted: true }),

    // Total listed items
    Item.countDocuments({ isDeleted: false }),

    // Available items
    Item.countDocuments({
      isDeleted: false,
      availabilityStatus: 'available',
    }),

    // Paused items
    Item.countDocuments({
      isDeleted: false,
      availabilityStatus: 'paused',
    }),

    // Total active categories
    Category.countDocuments({
      isDeleted: false,
      isActive: true,
    }),

    // Total rental requests
    Rental.countDocuments({ isDeleted: false }),

    // Pending rentals
    Rental.countDocuments({
      isDeleted: false,
      status: 'pending',
    }),

    // Approved rentals
    Rental.countDocuments({
      isDeleted: false,
      status: 'approved',
    }),

    // Rejected rentals
    Rental.countDocuments({
      isDeleted: false,
      status: 'rejected',
    }),

    // Completed rentals
    Rental.countDocuments({
      isDeleted: false,
      status: 'completed',
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    deletedUsers,
    totalItems,
    availableItems,
    pausedItems,
    totalCategories,
    totalRentals,
    pendingRentals,
    approvedRentals,
    rejectedRentals,
    completedRentals,
  };
};

module.exports = {
  getCommonDashboard,
  getUserDashboard,
  getAdminDashboard,
};
