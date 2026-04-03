require('dotenv').config();
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

async function testRazorpay() {
  try {
    console.log('🔍 Testing Razorpay integration...');

    // Test 1: Fetch all plans
    console.log('\n📋 Fetching all plans...');
    const plans = await razorpayInstance.plans.all();
    console.log('✅ Available plans:');
    plans.items.forEach(plan => {
      console.log(`  - ${plan.id}: ${plan.item.name} - ₹${plan.item.amount / 100}`);
    });

    // Test 2: Check specific plan IDs
    const planIds = [
      'plan_S28rJrYONPQAzA', // Changemaker
      'plan_S28tpcFw3KRcZO', // Impact Partner
      'plan_S28uewX9htWiCH', // Empowerment Ally
      'plan_S28vG72iX0OCat', // Growth Contributor
      'plan_S28wPfEyaCXvOS'  // Change Guardian
    ];

    console.log('\n🔍 Checking specific plan IDs...');
    for (const planId of planIds) {
      try {
        const plan = await razorpayInstance.plans.fetch(planId);
        console.log(`✅ ${planId}: ${plan.item.name} - ₹${plan.item.amount / 100}`);
        console.log(`   Status: ${plan.status || 'active'}, Created: ${new Date(plan.created_at * 1000).toISOString()}`);
      } catch (error) {
        console.log(`❌ ${planId}: Not found or error - ${error.message}`);
      }
    }

    // Test 3: Try creating a test customer
    console.log('\n👤 Testing customer creation...');
    try {
      const testCustomer = await razorpayInstance.customers.create({
        name: 'Test Customer ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        contact: '99999' + Math.floor(Math.random() * 10000),
      });
      console.log('✅ Test customer created:', testCustomer.id);

      // Test 4: Try creating a test subscription
      console.log('\n📝 Testing subscription creation...');
      try {
        const testSubscription = await razorpayInstance.subscriptions.create({
          plan_id: 'plan_S28rJrYONPQAzA', // Changemaker plan
          customer_id: testCustomer.id,
          notes: {
            test_subscription: 'true',
            created_by: 'test_script'
          }
        });
        console.log('✅ Test subscription created:', testSubscription.id);
        console.log('   Status:', testSubscription.status);
        console.log('   Current start:', testSubscription.current_start);
        console.log('   Charge at:', testSubscription.charge_at);
      } catch (subscriptionError) {
        console.error('❌ Test subscription creation failed:', subscriptionError.message);
        console.error('Full error:', subscriptionError);
      }
    } catch (customerError) {
      console.error('❌ Test customer creation failed:', customerError.message);
      console.error('Full error:', customerError);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testRazorpay();
