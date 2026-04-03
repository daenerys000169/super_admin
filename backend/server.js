require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/applicationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const contactRoutes = require('./routes/contactRoutes');
const donationRoutes = require('./routes/donations');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const eventRegistrationRoutes = require('./routes/eventRegistrationRoutes');
const cors = require('cors');

const app = express();

// Database connection monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 5000) { // Log slow queries (>5 seconds)
      console.log(`🐌 Slow request: ${req.method} ${req.url} took ${duration}ms`);
    }
  });
  next();
});

app.use(cors({
  origin: "*"
}));

app.use(express.json());

// Raw body parser for webhooks (needed for signature verification)
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

app.use('/api/auth', authRoutes);
app.use('/api', appRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/event-registration', eventRegistrationRoutes);
// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection before syncing
    await sequelize.authenticate();
    console.log('✅ Database connection verified');

    // Sync database (only create tables if they don't exist)
    await sequelize.sync({ alter: false });
    // await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT:${PORT}`);
      console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();