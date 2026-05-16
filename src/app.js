const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const employeeRoutes = require('./routes/employees');
const leaveRequestRoutes = require('./routes/leaveRequests');
const performanceReviewRoutes = require('./routes/performanceReviews');
const jobPostingRoutes = require('./routes/jobPostings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Novem Eco Resort HR App is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/performance-reviews', performanceReviewRoutes);
app.use('/api/job-postings', jobPostingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Novem Eco Resort HR App running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
  });
}

module.exports = app;
