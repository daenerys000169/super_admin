const Subscription = require('../models/Subscription');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

console.log('🔧 Razorpay initialized with key_id:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
console.log('🔧 Razorpay secret:', process.env.RAZORPAY_SECRET ? 'Present' : 'Missing');

// Subscription plan configurations with Razorpay plan IDs
const subscriptionPlans = {
  changemaker: {
    planId: process.env.RAZORPAY_CHANGEMAKER_PLAN_ID || 'plan_S28rJrYONPQAzA',
    amount: 500, // ₹500 in rupees
    name: 'Changemaker',
    description: 'Make a meaningful impact with monthly support'
  },
  impact_partner: {
    planId: process.env.RAZORPAY_IMPACT_PARTNER_PLAN_ID || 'plan_S28tpcFw3KRcZO',
    amount: 1000, // ₹1000 in rupees
    name: 'Impact Partner',
    description: 'Partner with us to create lasting change'
  },
  empowerment_ally: {
    planId: process.env.RAZORPAY_EMPOWERMENT_ALLY_PLAN_ID || 'plan_S28uewX9htWiCH',
    amount: 2500, // ₹2500 in rupees
    name: 'Empowerment Ally',
    description: 'Support women empowerment initiatives'
  },
  growth_contributor: {
    planId: process.env.RAZORPAY_GROWTH_CONTRIBUTOR_PLAN_ID || 'plan_S28vG72iX0OCat',
    amount: 5000, // ₹5000 in rupees
    name: 'Growth Contributor',
    description: 'Drive comprehensive growth across programs'
  },
  change_guardian: {
    planId: process.env.RAZORPAY_CHANGE_GUARDIAN_PLAN_ID || 'plan_S28wPfEyaCXvOS',
    amount: 10000, // ₹10000 in rupees
    name: 'Change Guardian',
    description: 'Become a guardian of change'
  }
};

// 🟢 Create Subscription Entry (before payment)
exports.createSubscription = async (req, res) => {
  const startTime = Date.now();
  console.log('🔄 Starting subscription creation at:', new Date().toISOString());

  try {
    const { planType, amount, currency = 'INR', frequency = 'monthly', name, email, contact } = req.body;

    console.log('📝 Creating subscription for:', { planType, name, contact, amount, email });
    console.log('📋 Full request body:', req.body);

    if (!planType || !name || !contact) {
      return res.status(400).json({
        error: 'Plan type, name, and contact are required.'
      });
    }

    if (!subscriptionPlans[planType]) {
      return res.status(400).json({
        error: 'Invalid subscription plan type.'
      });
    }

    // Get plan details
    const planDetails = subscriptionPlans[planType];
    console.log('📋 Plan details:', planDetails);

    const subscriptionAmount = amount || planDetails.amount; // amount comes in rupees from frontend

    // Create subscription record
    const subscription = await Subscription.create({
      name,
      email: email || null,
      contact,
      planType,
      amount: subscriptionAmount, // Store in rupees (frontend sends in rupees)
      currency,
      frequency,
      status: 'pending_payment' // Will be updated after payment
    });

    // Create Razorpay subscription using existing plan
    console.log(`📝 Creating Razorpay subscription for ${planType} plan using existing plan ID: ${planDetails.planId}`);

    // Create a customer first
    let customer;
    try {
      customer = await razorpayInstance.customers.create({
        name: name,
        email: email || undefined,
        contact: contact,
      });
      console.log('✅ Razorpay customer created:', customer.id);
    } catch (customerError) {
      console.error('❌ Failed to create Razorpay customer:', customerError);
      console.error('❌ Full error details:', JSON.stringify(customerError, null, 2));
      // Don't proceed if customer creation fails
      const errorMessage = customerError?.message || customerError?.error?.description || 'Unknown customer creation error';
      throw new Error(`Failed to create payment customer: ${errorMessage}`);
    }

    // Create Razorpay subscription using existing plan
    const razorpaySubscriptionData = {
      plan_id: planDetails.planId,
      customer_id: customer.id,
      total_count: 120, // 10 years of monthly payments (can be adjusted)
      notes: {
        subscription_id: subscription.id,
        plan_type: planType,
        customer_name: name,
        customer_email: email,
        customer_contact: contact
      }
    };

    console.log('🔄 Creating Razorpay subscription with data:', razorpaySubscriptionData);

    let razorpaySubscription;
    try {
      razorpaySubscription = await razorpayInstance.subscriptions.create(razorpaySubscriptionData);
      console.log('✅ Razorpay subscription created:', razorpaySubscription.id);
      console.log('📊 Subscription status:', razorpaySubscription.status);
    } catch (subscriptionError) {
      console.error('❌ Failed to create Razorpay subscription:', subscriptionError.message);
      console.error('❌ Full error details:', subscriptionError);
      console.error('Plan ID used:', planDetails.planId);

      // Try to fetch the plan to verify it exists
      try {
        const planDetails = await razorpayInstance.plans.fetch(planDetails.planId);
        console.log('📋 Plan exists:', { id: planDetails.id, item: planDetails.item });
      } catch (planFetchError) {
        console.error('❌ Plan fetch error:', planFetchError.message);
        console.error('The plan ID might be incorrect or the plan might not be active');
      }

      throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
    }

    // Update subscription with Razorpay details
    await Subscription.update(
      {
        razorpaySubscriptionId: razorpaySubscription.id,
        razorpayCustomerId: razorpaySubscription.customer_id,
        status: 'created'
      },
      { where: { id: subscription.id } }
    );

    // Update the subscription object
    subscription.razorpaySubscriptionId = razorpaySubscription.id;
    subscription.razorpayCustomerId = razorpaySubscription.customer_id;

    console.log(`✅ Subscription created successfully in ${Date.now() - startTime}ms`);
    res.status(201).json({
      subscription,
      razorpaySubscriptionId: razorpaySubscription.id,
      isManual: razorpaySubscription.id.startsWith('manual_'),
      message: 'Subscription created successfully.'
    });

  } catch (err) {
    console.error(`❌ Subscription creation failed after ${Date.now() - startTime}ms:`, err);
    console.error('❌ Error stack:', err.stack);

    // Ensure we always send a response
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Server error while creating subscription.',
        details: err.message
      });
    }
  }
};

// 🟢 Handle Razorpay Subscription Webhooks
exports.handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    const signature = req.headers['x-razorpay-signature'];

    // For raw body webhook, parse the JSON
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature. Expected:', expectedSignature, 'Got:', signature);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const webhookData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const event = webhookData.event;
    const subscriptionData = webhookData.payload?.subscription?.entity;

    if (!subscriptionData) {
      console.error('No subscription data in webhook payload');
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    console.log('📥 Webhook received:', event, 'for subscription:', subscriptionData.id);

    switch (event) {
      case 'subscription.activated':
        await Subscription.update(
          {
            status: 'active',
            currentStart: new Date(subscriptionData.current_start * 1000),
            currentEnd: new Date(subscriptionData.current_end * 1000),
            nextChargeAt: new Date(subscriptionData.charge_at * 1000)
          },
          { where: { razorpaySubscriptionId: subscriptionData.id } }
        );
        break;

      case 'subscription.charged':
        await Subscription.update(
          {
            paymentId: req.body.payload.payment.entity.id,
            nextChargeAt: new Date(subscriptionData.charge_at * 1000)
          },
          { where: { razorpaySubscriptionId: subscriptionData.id } }
        );
        break;

      case 'subscription.cancelled':
        await Subscription.update(
          { status: 'cancelled' },
          { where: { razorpaySubscriptionId: subscriptionData.id } }
        );
        break;

      case 'subscription.paused':
        await Subscription.update(
          { status: 'paused' },
          { where: { razorpaySubscriptionId: subscriptionData.id } }
        );
        break;

      case 'subscription.completed':
        await Subscription.update(
          { status: 'completed' },
          { where: { razorpaySubscriptionId: subscriptionData.id } }
        );
        break;
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// 🟢 Verify Payment and Update Subscription
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionId
    } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        error: 'Subscription ID is required.'
      });
    }

    // Check if this is a manual subscription (no Razorpay integration)
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found.'
      });
    }

    // Handle manual subscription payments (one-time payment for first month)
    if (subscription.razorpaySubscriptionId && subscription.razorpaySubscriptionId.startsWith('manual_')) {
      // This is a one-time payment for manual subscription
      // Verify the payment signature
      if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          error: 'Missing required payment verification fields for manual subscription.'
        });
      }

      // For manual subscriptions, we receive order_id as subscription_id
      // Verify signature using order_id (from donation create-order)
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_subscription_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature === razorpay_signature) {
        // Update subscription with payment details and activate
        await Subscription.update(
          {
            paymentId: razorpay_payment_id,
            status: 'active',
            metadata: {
              ...subscription.metadata,
              first_payment_date: new Date(),
              payment_method: 'razorpay_manual'
            }
          },
          { where: { id: subscriptionId } }
        );

        return res.json({
          success: true,
          message: 'Manual subscription payment verified and activated.'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature for manual subscription.'
        });
      }
    }

    // For real Razorpay subscriptions, verify the signature
    if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Missing required payment verification fields.'
      });
    }

    // Verify signature for subscription payment
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Update subscription with payment details
      await Subscription.update(
        {
          paymentId: razorpay_payment_id,
          status: 'active'
        },
        { where: { id: subscriptionId } }
      );

      res.json({
        success: true,
        message: 'Subscription payment verified and updated.'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature.'
      });
    }
  } catch (err) {
    console.error('Error verifying subscription payment:', err);
    res.status(500).json({
      error: 'Payment verification failed.',
      details: err.message
    });
  }
};

// 🟢 Get Subscription Details
exports.getSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found.' });
    }

    res.json({ subscription });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    res.status(500).json({ error: 'Server error while fetching subscription.' });
  }
};

// 🟢 Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelAtEnd = true } = req.body;

    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found.' });
    }

    // Cancel in Razorpay
    await razorpayInstance.subscriptions.cancel(subscription.razorpaySubscriptionId, {
      cancel_at_end: cancelAtEnd
    });

    // Update status
    await Subscription.update(
      { status: 'cancelled' },
      { where: { id } }
    );

    res.json({ message: 'Subscription cancelled successfully.' });
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    res.status(500).json({ error: 'Server error while cancelling subscription.' });
  }
};

// 🟢 Get All Subscriptions (Admin)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({ subscriptions });
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
    res.status(500).json({ error: 'Server error while fetching subscriptions.' });
  }
};

// 🟢 Activate Subscription (Admin)
exports.activateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId, notes } = req.body;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found.' });
    }

    await Subscription.update(
      {
        status: 'active',
        paymentId: paymentId || `admin_activated_${Date.now()}`,
        metadata: {
          ...subscription.metadata,
          activated_by: 'admin',
          activated_at: new Date(),
          notes: notes || 'Activated by admin'
        }
      },
      { where: { id } }
    );

    res.json({ message: 'Subscription activated successfully.' });
  } catch (err) {
    console.error('Error activating subscription:', err);
    res.status(500).json({ error: 'Server error while activating subscription.' });
  }
};
