const db = require('../config/db');
const { User, Organization, OrganizationInfo, PersonalInfo, IndustryCode, UserIndustry, PaymentMethod, OTP } = db;

// 1. Store Organization Data
exports.storeOrganization = async (req, res) => {
  try {
    const { user_id, organization_type, department, country, state, city, post_code, organization_name, experience, description, id_proof, products_deal_with, supplier_type } = req.body;
    
    // For Buyers, we also get organization_name
    let org = await Organization.findOne({ where: { UserId: user_id } });
    if (org) {
      await org.update({
        organization_name, organization_type, department, country, state, city, post_code,
        experience, description, id_proof, products_deal_with, supplier_type
      });
    } else {
      org = await Organization.create({
        UserId: user_id, organization_name, organization_type, department, country, state, city, post_code,
        experience, description, id_proof, products_deal_with, supplier_type
      });
    }

    res.status(200).json({ message: 'Organization data saved', data: org });
  } catch (error) {
    console.error('Store Organization Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await OTP.upsert({ email, otp: otpCode, expiry_time: expiryTime });
    
    // Mocking email sending
    console.log(`[AUTH] OTP for ${email}: ${otpCode}`);
    
    res.status(200).json({ message: 'OTP sent successfully (Check console)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ where: { email, otp } });
    
    if (!record || record.expiry_time < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await record.update({ is_verified: true });
    res.status(200).json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Create User / Update Account
exports.createUser = async (req, res) => {
  try {
    const { user_id, username, password, confirm_password } = req.body;
    if (password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match' });

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // In a real app, hash password here
    await user.update({ password, name: username, status: 'onboarding_in_progress' });
    
    res.status(200).json({ message: 'Account updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Store Organization Info
exports.storeOrganizationInfo = async (req, res) => {
  try {
    const { user_id, full_address, website, authorized_contact, contact_phone, tax_number, tax_registered } = req.body;
    
    let info = await OrganizationInfo.findOne({ where: { UserId: user_id } });
    if (info) {
      await info.update({ full_address, website, authorized_contact, contact_phone, tax_number, tax_registered });
    } else {
      info = await OrganizationInfo.create({ UserId: user_id, full_address, website, authorized_contact, contact_phone, tax_number, tax_registered });
    }

    res.status(200).json({ message: 'Business info saved', data: info });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Store Personal Info
exports.storePersonalInfo = async (req, res) => {
  try {
    const { user_id, full_name, last_name, designation, national_id, tax_id, contact_phone } = req.body;
    
    let info = await PersonalInfo.findOne({ where: { UserId: user_id } });
    if (info) {
      await info.update({ full_name, last_name, designation, national_id, tax_id, contact_phone });
    } else {
      info = await PersonalInfo.create({ UserId: user_id, full_name, last_name, designation, national_id, tax_id, contact_phone });
    }

    res.status(200).json({ message: 'Personal profile saved', data: info });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Industry Codes
exports.getIndustryCodes = async (req, res) => {
  try {
    const codes = await IndustryCode.findAll();
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. Select Industry
exports.selectIndustry = async (req, res) => {
  try {
    const { user_id, industry_codes } = req.body;
    
    // industry_codes is an array of IDs
    await UserIndustry.destroy({ where: { UserId: user_id } });
    const records = industry_codes.map(codeId => ({ UserId: user_id, IndustryCodeId: codeId }));
    await UserIndustry.bulkCreate(records);

    res.status(200).json({ message: 'Industries updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. Payment Method
exports.storePaymentMethod = async (req, res) => {
  try {
    const { user_id, method_type, bank_name, account_no, ifsc_code, account_holder_name, bank_location } = req.body;
    
    // Store as identifier or separate fields if schema allowed
    const identifier = bank_name ? `${bank_name} | ${account_no}` : method_type;
    
    await PaymentMethod.upsert({ 
      UserId: user_id, 
      method_type, 
      payment_identifier: identifier,
      is_default: true 
    });

    res.status(200).json({ message: 'Payment method saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 10. Get Status
exports.getOnboardingStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id, {
      include: [
        { model: Organization },
        { model: OrganizationInfo },
        { model: PersonalInfo },
        { model: IndustryCode, through: UserIndustry },
        { model: PaymentMethod }
      ]
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ data: user, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 11. Complete
exports.completeOnboarding = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ status: 'pending_approval' });
    res.status(200).json({ message: 'Onboarding complete. Awaiting approval.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
