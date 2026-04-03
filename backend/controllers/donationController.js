const Donation = require('../models/Donation');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// console.log(process.env.RAZORPAY_KEY_ID);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 🟢 Create Donation Entry (before payment)
exports.createDonation = async (req, res) => {
  try {
    const { name, contact, email, pan, amount } = req.body;
    // const { name, contact, email, pan, amount, campaign } = req.body;

    if (!name || !contact || !amount) {
      return res.status(400).json({ error: 'Name, contact, and amount are required.' });
    }

    const donation = await Donation.create({
      name,
      contact,
      email: email || null,
      pan: pan || null,
      amount,
      campaign: campaign || 'Generic',
    });

    res.status(201).json({ donation, message: 'Donation record created successfully.' });
  } catch (err) {
    console.error('Error creating donation:', err);
    res.status(500).json({ error: 'Server error while creating donation.' });
  }
};

// 🟢 Create Razorpay Order
exports.createOrder = async (req, res) => {
  console.log("Incoming body:", req.body);

  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required.' });
    }

    const order = await razorpayInstance.orders.create({
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Razorpay order creation failed.' });
  }
};

// 🟢 Verify Payment and Update Donation
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !donationId) {
      return res.status(400).json({ error: 'Missing required payment verification fields.' });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      await Donation.update(
        { payment_id: razorpay_payment_id },
        { where: { id: donationId } }
      );

      res.json({ success: true, message: 'Payment verified and donation updated.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: 'Payment verification failed.' });
  }
};



// const Donation = require('../models/Donation');
// const Razorpay = require('razorpay');
// const crypto = require('crypto');

// console.log(process.env.RAZORPAY_KEY_ID);

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// exports.createDonation = async (req, res) => {
//   try {
//     const { name, contact, pan, amount } = req.body;

//     if (!name || !contact || !pan || !amount) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     const donation = await Donation.create({ name, contact, pan, amount });

//     res.status(201).json({ donation, message: 'Donation saved' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     const { amount, currency } = req.body;
//     const order = await razorpayInstance.orders.create({
//       amount,
//       currency,
//       receipt: `receipt_${Date.now()}`,
//     });
//     res.json(order);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Razorpay order creation failed' });
//   }
// };

// exports.verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     const generated_signature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     if (generated_signature === razorpay_signature) {
//       // Update donation with payment_id
//       await Donation.update(
//         { payment_id: razorpay_payment_id },
//         { where: { id: req.body.donationId } } // frontend should send donationId
//       );

//       res.json({ success: true });
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid signature' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Payment verification failed' });
//   }
// };
