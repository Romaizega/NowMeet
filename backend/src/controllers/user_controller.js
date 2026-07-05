const bcrypt = require("bcrypt");
const userModel = require("../models/users_model");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const updateProfileUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(403).json({ message: "User is unauthorized" });
    }
    const { first_name, last_name, date_of_birth, about } = req.body || {};

    let photo = undefined;
    if (req.file) {
      const filename = `${Date.now()}-avatar.webp`;
      const outputPath = path.join(__dirname, "../../uploads", filename);
      await sharp(req.file.buffer)
        .resize(200, 200, { fit: "cover" })
        .webp({ quality: 80 })
        .toFile(outputPath);
      photo = filename;
    }
    const minAge = 18;

    if (first_name !== undefined && first_name.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "First name must be at least 2 characters" });
    }
    if (last_name !== undefined && last_name.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Last name must be at least 2 characters" });
    }
    if (
      (date_of_birth !== undefined && new Date(date_of_birth) > new Date()) ||
      new Date().getFullYear() - new Date(date_of_birth).getFullYear() < minAge
    ) {
      return res.status(400).json({
        message:
          "Date of birth cannot be in the future and you must be at least 18",
      });
    }
    if (about !== undefined && about.length < 25) {
      return res
        .status(400)
        .json({ message: "Section about must be at least 25 characters" });
    }
    const updateProfile = await userModel.updateUserprofile(
      user_id,
      first_name,
      last_name,
      date_of_birth,
      photo,
      about,
    );

    return res
      .status(200)
      .json({ message: "Profile user updated", updateProfile });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateUsername = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(403).json({ message: "User is unauthorized" });
    }
    const { username } = req.body;
    if (username.trim().length < 3)
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    const existingUsername = await userModel.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUsername = await userModel.updateUsername(user_id, username);
    return res.status(200).json({ message: "Username updated", newUsername });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(403).json({ message: "User is unauthorized" });
    }
    const { email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingEmail = await userModel.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exist" });
    }
    const newEmail = await userModel.updateEmail(user_id, email);
    res.status(200).json({ message: "Email updated", newEmail });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(403).json({ message: "User is unauthorized" });
    }
    const user = await userModel.getUserById(user_id);
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(404)
        .json({ message: "Current password and new password are required" });
    }
    const isMatchesPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );
    if (!isMatchesPassword) {
      return res
        .status(400)
        .json({ message: "Current password is not correct" });
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
    await userModel.updatePassword(user_id, hashNewPassword);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const viewProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await userModel.viewProfile(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ message: "View profile", profile });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  updateProfileUser,
  updateUsername,
  updateEmail,
  updatePassword,
  viewProfile,
};
