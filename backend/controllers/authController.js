import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ecochain_super_secret_key_123', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email or username' });
    }

    // First user becomes admin automatically to make admin panel easy to test
    const count = await User.countDocuments({});
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({
      name,
      username,
      email,
      phone,
      password,
      role
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        carbonWallet: user.carbonWallet,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          carbonWallet: user.carbonWallet,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          carbonWallet: updatedUser.carbonWallet,
          token: generateToken(updatedUser._id),
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
