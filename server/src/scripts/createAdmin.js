const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/userModel');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected');

    // Check whether admin already exists
    const existingAdmin = await User.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('Admin already exists');
      } else {
        console.log('This email already belongs to another user');
      }

      return;
    }

    // Hash admin password
    const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

    // Create admin account
    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      passwordHash: passwordHash,
      phone: process.env.ADMIN_PHONE,
      role: 'admin',
      accountStatus: 'active',
      isEmailVerified: true,
    });

    console.log('Admin created successfully');
    console.log('Admin ID:', admin._id);
  } catch (error) {
    console.log('Admin creation failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
