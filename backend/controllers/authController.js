import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Password is hashed by User model pre-save hook
    // Only allow 'admin' role if explicitly set via seed; public register stays 'user'
    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // password has select:false — explicitly include it for login
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

export const updateFavorites = async (req, res) => {
  try {
    const { favoriteLegends } = req.body;

    if (!Array.isArray(favoriteLegends)) {
      return res.status(400).json({
        success: false,
        message: 'favoriteLegends must be an array of legend ids'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { favoriteLegends: favoriteLegends.map(String) },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Favorites updated successfully',
      user
    });
  } catch (error) {
    console.error('Update favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating favorites'
    });
  }
};

export const updateDreamTeam = async (req, res) => {
  try {
    const { dreamTeamLegends } = req.body;

    if (!Array.isArray(dreamTeamLegends)) {
      return res.status(400).json({
        success: false,
        message: 'dreamTeamLegends must be an array of legend ids'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { dreamTeamLegends: dreamTeamLegends.map(String).slice(0, 11) },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Dream team saved',
      user
    });
  } catch (error) {
    console.error('Update dream team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving dream team'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};
