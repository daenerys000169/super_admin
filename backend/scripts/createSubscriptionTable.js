const sequelize = require('../config/db');
const Subscription = require('../models/Subscription');

async function createSubscriptionTable() {
  try {
    // Sync the model to create the table
    await Subscription.sync({ force: false }); // force: false to not drop existing tables

    console.log('✅ Subscription table created successfully!');

    // Optional: Create some test data
    const testSubscription = await Subscription.create({
      name: 'Test User',
      email: 'test@example.com',
      contact: '9999999999',
      planType: 'changemaker',
      amount: 500.00,
      status: 'pending_payment'
    });

    console.log('✅ Test subscription created:', testSubscription.id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating subscription table:', error);
    process.exit(1);
  }
}

createSubscriptionTable();
