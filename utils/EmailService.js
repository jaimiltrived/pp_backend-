const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using environment variables
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER || 'jeniliinnovation812@gmail.com';
  const smtpPass = process.env.SMTP_PASS || 'wjow aggr nfvt ykmj';
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpSecure = process.env.SMTP_SECURE === 'true' ? true : false;

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

class EmailService {
  static async sendOTP(email, otp, type = 'registration') {
    try {
      const transporter = createTransporter();
      
      const isReset = type === 'password_reset';
      const subject = isReset ? 'Reset Your Password - Purchase Point' : 'Your Verification Code - Purchase Point';
      const title = isReset ? 'Password Reset' : 'Welcome to Purchase Point';
      const actionText = isReset ? 'reset your password' : 'registration';

      const mailOptions = {
        from: `"Purchase Point" <${process.env.SMTP_USER || 'no-reply@purchasepoint.com'}>`,
        to: email,
        subject: subject,
        text: `Your OTP for Purchase Point ${actionText} is: ${otp}. This code expires in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #1DB954; text-align: center;">${title}</h2>
            <p>Your one-time password (OTP) for ${actionText} is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #f9f9f9; padding: 10px; border-radius: 5px;">${otp}</div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">© 2026 Purchase Point Inc. All rights reserved.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Success: ${type} email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  static async sendApprovalNotification(email, status, message) {
    try {
      const transporter = createTransporter();
      const subject = `Account ${status.charAt(0).toUpperCase() + status.slice(1)} - Purchase Point`;
      
      const mailOptions = {
        from: `"Purchase Point" <${process.env.SMTP_USER || 'no-reply@purchasepoint.com'}>`,
        to: email,
        subject: subject,
        text: `Your account status has been updated to: ${status}. ${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: ${status === 'approved' ? '#1DB954' : '#E91E63'}; text-align: center;">Account ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <p>Hello,</p>
            <p>Your account status has been updated to <strong>${status}</strong>.</p>
            <p>${message}</p>
            <div style="margin: 20px 0; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #1DB954; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Purchase Point</a>
            </div>
            <p style="font-size: 12px; color: #999; text-align: center;">© 2026 Purchase Point Inc. All rights reserved.</p>
          </div>
        `
      };

      if (transporter) {
        await transporter.sendMail(mailOptions);
      }
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(email, name) {
    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: `"Purchase Point" <${process.env.SMTP_USER || 'no-reply@purchasepoint.com'}>`,
        to: email,
        subject: 'Welcome to Purchase Point!',
        text: `Hi ${name}, welcome to Purchase Point! Your account is now active.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #1DB954; text-align: center;">Welcome, ${name}!</h2>
            <p>We're excited to have you on board. Your account is now fully active and you can start exploring RFQs and placing bids.</p>
            <div style="margin: 20px 0; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #1DB954; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
            </div>
            <p style="font-size: 12px; color: #999; text-align: center;">© 2026 Purchase Point Inc. All rights reserved.</p>
          </div>
        `
      };

      if (transporter) {
        await transporter.sendMail(mailOptions);
      }
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

module.exports = EmailService;
