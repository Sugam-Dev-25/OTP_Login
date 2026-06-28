const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const connectDB = require("./app/config/db");

const authRoutes = require("./app/routes/authRoutes");



connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Default Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "OTP Login Backend Running Successfully",
  });
});

app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});