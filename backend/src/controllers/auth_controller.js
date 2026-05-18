const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users_model");
const { sendverificationEmail } = require("../utild/sendEmail");
const { first } = require("../../db/db");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required to fill out" });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Usename must be at least 3 characters long" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  if (!strongPassword.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one capital letter and one number",
    });
  }
  try {
    if (await userModel.getUserByUsername(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (await userModel.getUserByEmail(email)) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(username, email, hashPassword);
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await userModel.generateCode(newUser.id, code, expiresAt);
    await sendverificationEmail(email, code);

    res
      .status(201)
      .json({
        message: "New user created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required to fill out" });
  }
  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      user.password_hash,
    );
    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const getToken = jwt.sign(
      {
        user_id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_DAY },
    );
    return res
      .status(200)
      .json({ message: "Logged in successfully", token: getToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.user_id);
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth,
        photo: user.photo,
        about: user.about,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const sendCode = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    if (!user_id) {
      return res.status(403).json({ message: "User is unauthorized" });
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const user = await userModel.getUserById(user_id);
    await userModel.generateCode(user_id, code, expiresAt);
    await sendverificationEmail(user.email, code);
    return res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!code) {
      return res
        .status(400)
        .json({ message: "You must to enter your verification code" });
    }
    if (Number(code) != user.verification_code) {
      return res.status(400).json({ message: "Wrong the verification code" });
    }
    if (Date.now() > user.code_expires_at) {
      return res
        .status(400)
        .json({ message: "Your verification code expired" });
    }
    await userModel.clearCode(user.id);
    return res.status(200).json({ message: "Verification code is correct" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(403).json({ message: "Email not found" });
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const user = await userModel.getUserByEmail(email);
    await userModel.generateCode(user.id, code, expiresAt);
    await sendverificationEmail(user.email, code);
    return res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await userModel.getUserByEmail(email);
    if (!code) {
      return res
        .status(400)
        .json({ message: "You must to enter your verification code" });
    }
    if (Number(code) != user.verification_code) {
      return res.status(400).json({ message: "Wrong the verification code" });
    }
    if (Date.now() > user.code_expires_at) {
      return res
        .status(400)
        .json({ message: "Your verification code expired" });
    }
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one capital letter and one number",
      });
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(user.id, hashNewPassword);
    await userModel.clearCode(user.id);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  sendCode,
  verifyCode,
  forgotPassword,
  resetPassword,
};
