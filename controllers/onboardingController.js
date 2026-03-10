const { User, Organization, OrganizationInfo, PersonalInfo, IndustryCode, PaymentMethod, OTP, UserIndustry } = require('../config/db');
const OTPService = require('../utils/OTPService');
const EmailService = require('../utils/EmailService');

// STEP 1: Store Organization Data
exports.storeOrganization = async (req, res) => {
  try {
    const { user_id, organization_type, department, country, state, city, post_code } = req.body;

    // Validation
    if (!user_id || !organization_type || !country) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if already in step 1
    if (user.onboarding_step !== 1) {
      return res.status(400).json({ error: 'Invalid step order' });
    }

    // Create or update organization
    let organization = await Organization.findOne({ where: { UserId: user_id } });
    if (organization) {
      await organization.update({ organization_type, department, country, state, city, post_code });
    } else {
      organization = await Organization.create({
        organization_type,
        department,
        country,
        state,
        city,
        post_code,
        UserId: user_id
      });
    }

    // Move to next step
    user.onboarding_step = 2;
    user.status = 'onboarding_in_progress';
    await user.save();

    res.json({
      message: 'Organization data saved',
      next_step: 2,
      action: 'redirect_to_email_verification'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// STEP 2A: Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { user_id } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.onboarding_step !== 2) {
      return res.status(400).json({ error: 'Out of order' });
    }

    // Generate OTP
    const otp = OTPService.generateOTP();
    const expiry_time = OTPService.getExpiryTime();

    // Delete previous OTPs
    await OTP.destroy({ where: { email: user.email } });

    // Save OTP
    await OTP.create({
      email: user.email,
      otp,
      expiry_time,
      attempts: 0
    });

    // Send email
    await EmailService.sendOTP(user.email, otp);

    res.json({
      message: 'OTP sent to email',
      email: user.email,
      action: 'show_otp_input'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// STEP 2B: Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { user_id, otp } = req.body;

    if (!user_id || !otp) {
      return res.status(400).json({ error: 'User ID and OTP required' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find OTP record
    const otpRecord = await OTP.findOne({ where: { email: user.email } });
    if (!otpRecord) {
      return res.status(404).json({ error: 'OTP not found or expired' });
    }

    // Check expiry
    if (OTPService.isExpired(otpRecord.expiry_time)) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Check OTP match
    if (otpRecord.otp !== otp.toString()) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        await otpRecord.destroy();
        return res.status(400).json({ error: 'Too many attempts, request new OTP' });
      }
      await otpRecord.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark as verified
    user.email_verified = true;
    user.onboarding_step = 3;
    await user.save();

    // Delete OTP
    await otpRecord.destroy();

    res.json({
      message: 'Email verified successfully',
      next_step: 3,
      action: 'redirect_to_create_user_id'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// STEP 3: Create User ID and Password
exports.createUser = async (req, res) => {
  try {
    const { user_id, username, password, confirm_password } = req.body;

    // Validation
    if (!user_id || !username || !password) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.onboarding_step !== 3) {
      return res.status(400).json({ error: 'Invalid step order' });
    }

    // Validate password
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check username uniqueness
    const existingUser = await User.findOne({ where: { user_id: username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Update user
    user.user_id = username;
    user.password = password; // Will be hashed by User model beforeCreate hook
    user.onboarding_step = 4;
    await user.save();

    res.json({
      message: 'User ID created successfully',
      next_step: 4,
      action: 'redirect_to_organization_info'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// STEP 4: Store Organization Info
exports.storeOrganizationInfo = async (req, res) => {
  try {
    const { user_id, full_address, website, authorized_contact, contact_phone, tax_number, tax_registered } = req.body;

    // Validation
    if (!user_id || !full_address || !authorized_contact) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.onboarding_step !== 4) {
      return res.status(400).json({ error: 'Invalid step order' });
    }

    // If tax_registered, tax_number is required
    if (tax_registered && !tax_number) {
      return res.status(400).json({ error: 'Tax number required for registered organizations' });
    }

    // Create or update organization info
    let orgInfo = await OrganizationInfo.findOne({ where: { UserId: user_id } });
    if (orgInfo) {
      await orgInfo.update({
        full_address,
        website,
        authorized_contact,
        contact_phone,
        tax_number,
        tax_registered
      });
    } else {
      orgInfo = await OrganizationInfo.create({
        full_address,
        website,
        authorized_contact,
        contact_phone,
        tax_number,
        tax_registered,
        UserId: user_id
      });
    }

    user.onboarding_step = 5;
    await user.save();

    res.json({
      message: 'Organization info saved',
      next_step: 5,
      action: 'redirect_to_personal_info'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// STEP 5: Store Personal Info
exports.storePersonalInfo = async (req, res) => {
  try {
    const { user_id, full_name, last_name, designation, national_id, tax_id } = req.body;

    // Validation
    if (!user_id || !full_name) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.onboarding_step !== 5) {
      return res.status(400).json({ error: 'Invalid step order' });
    }

    // Create or update personal info
    let personalInfo = await PersonalInfo.findOne({ where: { UserId: user_id } });
    if (personalInfo) {
      await personalInfo.update({
        full_name,
        last_name,
        designation,
        national_id,
        tax_id
      });
    } else {
      personalInfo = await PersonalInfo.create({
        full_name,
        last_name,
        designation,
        national_id,
        tax_id,
        UserId: user_id
      });
    }

    user.onboarding_step = 6;
    await user.save();

    res.json({
      message: 'Personal info saved',
      next_step: 6,
      action: 'redirect_to_industry_selection'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// STEP 6: Get Industry Codes and Select
exports.getIndustryCodes = async (req, res) => {
  try {
    const industries = await IndustryCode.findAll() || [];
    res.json({
      message: 'Industry codes retrieved',
      industries
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

exports.selectIndustry = async (req, res) => {
  try {
    const { user_id, industry_codes } = req.body;

    // Validation
    if (!user_id || !industry_codes || !Array.isArray(industry_codes)) {
      return res.status(400).json({ error: 'User ID and industry codes array required' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.onboarding_step !== 6) {
      return res.status(400).json({ error: 'Invalid step order' });
    }

    // Create pivot table entries in UserIndustry
    if (industry_codes && industry_codes.length > 0) {
      await UserIndustry.destroy({ where: { UserId: user_id } }); // Clear existing if any
      const entries = industry_codes.map(codeId => ({
        UserId: user_id,
        IndustryCodeId: codeId
      }));
      await UserIndustry.bulkCreate(entries);
    }

    user.onboarding_step = 7;
    await user.save();

    res.json({
      message: 'Industry codes selected',
      next_step: 7,
      action: 'redirect_to_payment_method'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// STEP 7: Store Payment Method
exports.storePaymentMethod = async (req, res) => {
  try {
    const { user_id, method_type, payment_identifier } = req.body;

    // Validation
    if (!user_id || !method_type) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const validMethods = ['internet_banking', 'paypal', 'google_pay', 'other'];
    if (!validMethods.includes(method_type)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.onboarding_step !== 7) {
      return res.status(400).json({ error: 'Invalid step order' });
    }

    // Create payment method
    const paymentMethod = await PaymentMethod.create({
      method_type,
      payment_identifier,
      is_default: true,
      UserId: user_id
    });

    // Mark onboarding as completed
    user.onboarding_step = 8; // Completed
    user.status = 'pending_approval'; // Send to admin
    user.account_status = 'pending_approval';
    await user.save();

    // TODO: Send notification to admin for review

    res.json({
      message: 'Onboarding completed, awaiting admin approval',
      status: 'pending_approval',
      action: 'show_approval_waiting_screen'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
