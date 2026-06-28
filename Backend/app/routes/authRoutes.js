const express = require("express");
const router = express.Router();
const { register } = require("../controller/authController");
const { sendOTP } = require("../controller/authController");
const { verifyOTP } = require("../controller/authController");
const { profile } = require("../controller/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const { logout } = require("../controller/authController");
const { resendOTP } = require("../controller/authController");


router.post("/register", register);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/profile", verifyToken, profile);
router.post("/resend-otp", resendOTP);
router.post("/logout", verifyToken, logout);



module.exports = router;