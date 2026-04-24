// OTP Service
const crypto = require('crypto');

class OTPService {
  // Generate 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Get OTP expiry time (10 minutes from now)
  static getExpiryTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    return now;
  }

  // Verify OTP is not expired
  static isExpired(expiry_time) {
    return new Date() > new Date(expiry_time);
  }
}

module.exports = OTPService;
