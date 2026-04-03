require('dotenv').config();
const axios = require('axios')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const transporter = require('../config/mailer');
const generateOTP = require('../utils/generateOTP');


// ⏱ Helper to calculate expiry time
const OTP_EXPIRY_MINUTES = 10;

// exports.sendOTP = async (req, res) => {
//   const { email } = req.body;
//   const otp = generateOTP();
//   const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

//   let user = await User.findOne({ where: { email } });

//   if (!user) {
//     user = await User.create({ email, otp, otpExpires });
//   } else {
//     user.otp = otp;
//     user.otpExpires = otpExpires;
//     await user.save();
//   }

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Your OTP Code',
//     text: `Your verification code is ${otp}. It is valid for ${OTP_EXPIRY_MINUTES} minutes. If you did not request this, please ignore this message.`
//   });

//   res.json({ message: 'OTP sent successfully' });
// };

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({ email, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    const options = {
      method: 'POST',
      url: 'https://api.mailmodo.com/api/v1/triggerCampaign/046780ac-a15d-5d1f-a63c-e41723f2cf1e', // your campaign id
      headers: {
        'Content-Type': 'application/json',
        mmApiKey: process.env.MAILMODO_API_KEY, // set your Mailmodo API key in environment variables
        Accept: 'application/json'
      },
      data: {
        email: email,
        subject: 'Your Verification Code',
        replyTo: 'info@startupyogdan.org',
        fromName: 'Startup Yogdaan Foundation',
        fromEmail: 'no-reply@startupyogdan.org',
        campaign_data: {
          OTP: otp,
        },
        addToList: 'Startup_yogdan_Verification'
      }
    };

    const response = await axios.request(options);
    console.log('Mailmodo mail sent:', response.data);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Failed to send OTP via Mailmodo:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || user.otp !== parseInt(otp) || new Date(user.otpExpires) < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: 'OTP verified successfully' });
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, role = 'user' } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.firstName = firstName;
  user.lastName = lastName;
  user.password = hashedPassword;
  user.role = role; // Optional: allow admin assignment from backend only
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({
    token,
    userId: user.id,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};



// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt']
    });
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};
