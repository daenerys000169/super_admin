const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
    },
    retry: {
      max: 3, // Maximum retry attempts
    },
    // Additional MySQL-specific options
    dialectOptions: {
      connectTimeout: 60000, // Connection timeout in milliseconds
      acquireTimeout: 60000, // Acquire timeout in milliseconds
      timeout: 60000, // Query timeout in milliseconds
    },
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to RDS successfully!');
    console.log('🔧 Database connection pool configured: max=5, min=0');

    // Setup pool monitoring after successful connection
    try {
      // For Sequelize v6+, pool monitoring is different
      if (sequelize.connectionManager && sequelize.connectionManager.pool) {
        console.log('🔍 Pool monitoring enabled');

        // Log pool status every 5 minutes (less frequent in production)
        const logInterval = process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 5 * 60 * 1000; // 15 min in prod, 5 min in dev
        setInterval(() => {
          try {
            const pool = sequelize.connectionManager.pool;
            if (pool) {
              console.log(`📊 DB Pool Status: size=${pool.size || 'N/A'}, available=${pool.available || 'N/A'}`);
            }
          } catch (poolError) {
            console.log('⚠️ Pool status check failed:', poolError.message);
          }
        }, logInterval);
      } else {
        console.log('⚠️ Pool monitoring not available (this is normal for some Sequelize versions)');
      }
    } catch (monitorError) {
      console.log('⚠️ Pool monitoring setup failed:', monitorError.message);
    }
  })
  .catch(err => {
    console.error('❌ Unable to connect to RDS:', err);
    console.error('🔧 Connection pool config may need adjustment');
  });

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('🔄 Closing database connections...');
  await sequelize.close();
  console.log('✅ Database connections closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Closing database connections...');
  await sequelize.close();
  console.log('✅ Database connections closed');
  process.exit(0);
});

module.exports = sequelize;
