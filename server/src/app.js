// Configure the Express application and middleware.
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/superAdminRoutes');
const itemRoutes = require('./routes/itemRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();

// Enable CORS for frontend requests
app.use(cors());

app.use(express.json());
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Security-Policy',
      "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    );
    next();
  },
  express.static(path.join(__dirname, 'uploads')),
);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Redirect browser visits to admin frontend routes on port 5173
app.get(['/admin', '/admin/login', '/admin/dashboard', '/admin/categories'], (req, res) => {
  res.redirect(`http://localhost:5173${req.originalUrl}`);
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON request body',
    });
  }

  const statusCode = error.statusCode || error.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
