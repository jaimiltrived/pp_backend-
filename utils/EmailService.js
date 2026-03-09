// Email Service - Stub for integration with Nodemailer/SendGrid
class EmailService {
  static async sendOTP(email, otp) {
    try {
      // TODO: Configure Nodemailer or SendGrid
      console.log(`OTP for ${email}: ${otp}`);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  static async sendApprovalNotification(email, status, message) {
    try {
      // TODO: Send approval/rejection email
      console.log(`${status} notification sent to ${email}: ${message}`);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(email, name) {
    try {
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }
}

module.exports = EmailService;
