import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

export const seedAdmin = async (req, res) => {
  try {
    await User.deleteMany();
    await User.create({
      name: 'navaneeth9788',
      email: 'navaneeth9788@gmail.com',
      password: 'Navaneeth@530',
      role: 'admin'
    });
    res.json({ message: 'Database successfully seeded with new admin credentials!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'navaneeth9788@gmail.com';
  const ADMIN_PASS = 'Navaneeth@530';

  // Check if this is the admin trying to log in
  const isAdminLogin = (email === ADMIN_EMAIL) && (password === ADMIN_PASS);

  try {
    let user = await User.findOne({ email });

    if (!user && isAdminLogin) {
      // Admin doesn't exist yet — create it
      user = await User.create({
        name: 'navaneeth9788',
        email: ADMIN_EMAIL,
        password: ADMIN_PASS,
        role: 'admin'
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let isMatch = await user.matchPassword(password);

    // If password doesn't match but it's the admin with correct creds, fix the DB
    if (!isMatch && isAdminLogin) {
      user.password = ADMIN_PASS;
      await user.save(); // pre-save hook will bcrypt hash it
      isMatch = true;
    }

    if (isMatch) {
      const token = generateToken(user._id);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // If DB is completely down, allow admin login with a temporary token
    if (isAdminLogin) {
      const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
      return res.json({
        _id: 'admin',
        name: 'navaneeth9788',
        email: ADMIN_EMAIL,
        role: 'admin'
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user (Usually Admin setup once)
// @route   POST /api/auth/register
// @access  Public / Admin
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
