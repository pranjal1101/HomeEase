import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'homeease_jwt_secret_key_2026_super_secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { userId: user._id, role: user.role || 'customer' },
    secret,
    { expiresIn }
  );
};

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  return {
    id: userObj._id,
    _id: userObj._id,
    name: userObj.name,
    email: userObj.email,
    phone: userObj.phone || '',
    address: userObj.address || '',
    role: userObj.role || 'customer',
    createdAt: userObj.createdAt,
    updatedAt: userObj.updatedAt
  };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, password).'
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? String(phone).trim() : '',
      address: address ? String(address).trim() : '',
      role: role || 'customer'
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: sanitizeUser(savedUser),
      data: sanitizeUser(savedUser),
      token
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please log in.'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: messages || 'Validation error during registration.'
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
      data: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
      data: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile.'
    });
  }
};
