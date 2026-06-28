const User = require("../models/User");
const sendEmail = require("../../utils/sendEmail");
const generateOTP = require("../../utils/generateOTP");
const generateToken = require("../../utils/generateToken");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, phoneNumber, address } = req.body;

      if (!name || !email || !phoneNumber || !address) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered.",
        });
      }

      const user = await User.create({
        name,
        email,
        phoneNumber,
        address,
      });

      await sendEmail(
        email,
        "Welcome to OTP Login App 🎉",
        `
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome, ${name} 👋</h2>
      <p>Your account has been created successfully.</p>
      <p>You can now login using <b>Email OTP Authentication</b>.</p>
      <br>
      <p>Thank you for joining us ❤️</p>
    </div>
  `,
      );

      return res.status(200).json({
        success: true,
        message: "Registration Successful",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async sendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Check User
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate OTP
      const otp = generateOTP();

      // OTP Expire Time (5 Minutes)
      const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

      // Save OTP
      user.otp = otp;
      user.otpExpire = otpExpire;

      await user.save();

      // Send Email
      await sendEmail(
        email,
        "Your Login OTP",
        `
      <div style="font-family:Arial,sans-serif">
        <h2>Hello ${user.name} 👋</h2>

        <p>Your Login OTP is</p>

        <h1 style="letter-spacing:5px;color:#0d6efd">
          ${otp}
        </h1>

        <p>
          This OTP is valid for
          <strong>5 minutes</strong>.
        </p>

        <p>Do not share this OTP with anyone.</p>

        <hr>

        <small>OTP Login App</small>
      </div>
      `,
      );

      return res.status(200).json({
        success: true,
        message: "OTP Sent Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      if (new Date() > user.otpExpire) {
        return res.status(400).json({
          success: false,
          message: "OTP Expired",
        });
      }

      user.otp = null;
      user.otpExpire = null;
      user.isVerified = true;

      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async profile(req, res) {
    try {
      return res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async resendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate New OTP
      const otp = generateOTP();

      user.otp = otp;
      user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);

      await user.save();

      // Send OTP Email
      await sendEmail(
        email,
        "Resend Login OTP",
        `
      <div style="font-family:Arial,sans-serif">
        <h2>Hello ${user.name} 👋</h2>

        <p>Your new OTP is</p>

        <h1 style="letter-spacing:5px;color:#0d6efd;">
          ${otp}
        </h1>

        <p>This OTP is valid for <b>5 minutes</b>.</p>

        <p>Do not share this OTP with anyone.</p>

        <hr>

        <small>OTP Login App</small>
      </div>
      `,
      );

      return res.status(200).json({
        success: true,
        message: "OTP Resent Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async logout(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Logout Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
