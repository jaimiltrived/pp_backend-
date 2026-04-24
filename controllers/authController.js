const { User, OTP } = require('../config/db');
const jwt = require('jsonwebtoken');
const OTPService = require('../utils/OTPService');
const EmailService = require('../utils/EmailService');

// LOGIN FLOW - STEP 1: Check if user exists by email
exports.loginWithEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validation
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    // Case insensitive lookup
    const user = await User.findOne({ 
      where: { email: email.toLowerCase().trim() } 
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Please sign up first',
        action: 'redirect_to_signup'
      });
    }

    res.json({ 
      message: 'User found',
      user_exists: true,
      email: user.email,
      action: 'enter_password'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// LOGIN FLOW - STEP 2: Password verification
exports.loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ 
      where: { email: email.toLowerCase().trim() } 
    });

    if (!user || !(await user.comparePassword(password))) {
      // Increment login attempts
      user.login_attempts = (user.login_attempts || 0) + 1;
      if (user.login_attempts >= 5) {
        user.account_status = 'suspended';
      }
      await user.save();

      return res.status(401).json({ 
        error: 'Invalid credentials',
        attempts: user.login_attempts,
        message: user.login_attempts >= 5 ? 'Account suspended due to multiple failed attempts' : 'Invalid password'
      });
    }

    // Check account status
    if (user.account_status === 'suspended') {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    if (user.account_status === 'rejected') {
      return res.status(403).json({ 
        error: 'Account rejected',
        message: 'Your account was rejected during verification',
        action: 'redirect_to_resubmit'
      });
    }

    // IMPORTANT: Only block pending_approval if they have actually finished onboarding
    // For Sellers, onboarding_step 8 means finished.
    // For Buyers, they might stay at step 1 but should be active.
    if (user.account_status === 'pending_approval' && (user.onboarding_step === 8 || (user.role === 'buyer' && user.status === 'role_selected'))) {
      return res.status(403).json({ 
        error: 'Account pending approval',
        message: 'Your account is awaiting admin approval',
        action: 'show_waiting_screen'
      });
    }

    // Reset login attempts on successful login
    user.login_attempts = 0;
    user.last_login = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, (process.env.JWT_SECRET || '04f058abc86f6e6c016b595d68a1ec8f76609f81e931148e91240c46da68d10f'), { expiresIn: '7d' });

    // Check onboarding status
    // If buyer and just registered, they are "active" for now (or need minimal onboarding)
    if (user.role === 'buyer' && (user.status === 'registered' || user.status === 'role_selected')) {
       // Auto-activate buyers for now, or you can keep them in a specific state
       user.status = 'active';
       user.account_status = 'active';
       await user.save();
    }

    if (user.status !== 'active') {
      return res.json({
        message: 'Onboarding required',
        token,
        user: { id: user.id, email: user.email, role: user.role },
        onboarding_step: user.onboarding_step,
        action: 'redirect_to_onboarding'
      });
    }

    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role },
      action: 'redirect_to_dashboard'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// LOGIN FLOW - STEP 3: Social login (Google)
exports.googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;

    // Verify token
    const ticket = await googleClient.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user without password (social login)
      user = await User.create({
        email,
        name,
        status: 'registered',
        onboarding_step: 0, // Will start at role selection
      });

      return res.status(201).json({
        message: 'New user created via Google',
        user: { id: user.id, email: user.email },
        action: 'redirect_to_role_selection',
        token: null
      });
    }

    // Existing user
    if (user.status === 'pending_approval') {
      return res.status(403).json({ 
        error: 'Account pending approval',
        action: 'show_waiting_screen'
      });
    }

    user.last_login = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, (process.env.JWT_SECRET || '04f058abc86f6e6c016b595d68a1ec8f76609f81e931148e91240c46da68d10f'), { expiresIn: '7d' });

    res.json({
      message: 'Google login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role },
      action: user.status === 'active' ? 'redirect_to_dashboard' : 'redirect_to_onboarding'
    });
  } catch (error) {
    res.status(500).json({ error: 'Google login failed', details: error.message });
  }
};

// LOGIN FLOW - STEP 3: Social login (Apple)
exports.appleLogin = async (req, res) => {
  try {
    let { identity_token, email, name } = req.body;
    
    // Apple sends a JWT identity_token. We can decode it to get the user's email.
    // Note: In production, you MUST verify the identity_token signature with Apple's public keys.
    if (identity_token) {
      const decoded = jwt.decode(identity_token);
      if (decoded && decoded.email) {
        email = decoded.email;
      }
    }

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required', 
        message: 'Could not extract email from Apple identity token' 
      });
    }
    
    let user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      // Create new user without password (social login)
      user = await User.create({
        email: email.toLowerCase().trim(),
        name: name || 'Apple User',
        status: 'registered',
        onboarding_step: 0, // Will start at role selection
      });

      return res.status(201).json({
        message: 'New user created via Apple',
        user: { id: user.id, email: user.email },
        action: 'redirect_to_role_selection',
        token: null
      });
    }

    // Existing user checks
    if (user.account_status === 'suspended') {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    if (user.status === 'pending_approval') {
      return res.status(403).json({ 
        error: 'Account pending approval',
        action: 'show_waiting_screen'
      });
    }

    user.last_login = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, (process.env.JWT_SECRET || '04f058abc86f6e6c016b595d68a1ec8f76609f81e931148e91240c46da68d10f'), { expiresIn: '7d' });

    res.json({
      message: 'Apple login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role },
      action: user.status === 'active' ? 'redirect_to_dashboard' : 'redirect_to_onboarding'
    });
  } catch (error) {
    res.status(500).json({ error: 'Apple login failed', details: error.message });
  }
};

// ROLE SELECTION - User selects Buyer or Seller
exports.selectRole = async (req, res) => {
  try {
    const { user_id, role } = req.body;

    // Validation
    if (!user_id || !role) return res.status(400).json({ error: 'User ID and role required' });
    if (!['buyer', 'seller'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Lock role (cannot be both buyer and seller in same account)
    user.role = role;
    user.status = 'role_selected';
    user.onboarding_step = 1; // Start onboarding
    await user.save();

    res.json({
      message: 'Role selected successfully',
      user: { id: user.id, email: user.email, role: user.role },
      action: 'redirect_to_onboarding',
      next_step: 1
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// REGISTRATION - Create new user (basic)
exports.register = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    // Validation
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    let user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (user) return res.status(400).json({ error: 'User already exists' });

    user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      status: 'registered',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email },
      action: 'redirect_to_role_selection'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// LOGOUT - Clear session
exports.logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.last_login = new Date();
      await user.save();
    }

    res.json({ message: 'Logout successful', action: 'redirect_to_login' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Forgot Password Flow
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate and save OTP
    const otp = OTPService.generateOTP();
    const expiry_time = OTPService.getExpiryTime();

    await OTP.destroy({ where: { email: user.email } });
    await OTP.create({
      email: user.email,
      otp,
      expiry_time
    });

    // Send email
    await EmailService.sendOTP(user.email, otp, 'password_reset');

    res.json({ message: 'Reset OTP sent to email', action: 'enter_reset_otp' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const otpRecord = await OTP.findOne({ where: { email: email.toLowerCase().trim(), otp: otp.toString() } });
    if (!otpRecord) return res.status(400).json({ error: 'Invalid or expired OTP' });

    if (OTPService.isExpired(otpRecord.expiry_time)) {
      await otpRecord.destroy();
      return res.status(400).json({ error: 'OTP expired' });
    }

    // OTP verified, return a temporary "reset token" or just success
    // For simplicity, we mark the OTP as verified and use it to allow the next step
    otpRecord.is_verified = true;
    await otpRecord.save();

    res.json({ message: 'OTP verified successfully', action: 'enter_new_password' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password, confirm_password } = req.body;

    if (!email || !otp || !new_password) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if OTP was verified
    const otpRecord = await OTP.findOne({ 
      where: { 
        email: email.toLowerCase().trim(), 
        otp: otp.toString(),
        is_verified: true 
      } 
    });

    if (!otpRecord) return res.status(400).json({ error: 'Please verify OTP first' });

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update password (will be hashed by model hook)
    user.password = new_password;
    await user.save();

    // Clean up
    await otpRecord.destroy();

    res.json({ message: 'Password reset successful', action: 'redirect_to_login' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Old methods for compatibility
exports.signup = exports.register;
exports.login = exports.loginWithPassword;
