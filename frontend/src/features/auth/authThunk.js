import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message || error.message || "Registration failed";
      return rejectWithValue(message);
    }
  },
);

const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/verify", { email, code });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Wrong verification code";
      return rejectWithValue(message);
    }
  },
);

const sendCodeNewCode = createAsyncThunk(
  "auth/sendCode",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/send-code", { email });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "No any verification codes";
      return rejectWithValue(message);
    }
  },
);

const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "No any verification codes";
      return rejectWithValue(message);
    }
  },
);

const getMe = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("auth/me");
    return data;
  } catch (error) {
    const message =
      error.response?.data.message || error.message || "Failed to load profile";
    return rejectWithValue(message);
  }
});

const updateUsername = createAsyncThunk(
  "profile/username",
  async ({ username }, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/profiles/username", { username });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to update username";
      return rejectWithValue(message);
    }
  },
);

const updatePassword = createAsyncThunk(
  "profile/password",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/profiles/password", { currentPassword, newPassword });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed update password";
      return rejectWithValue(message);
    }
  },
);

const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async({email}, {rejectWithValue}) => {
    try {
      const {data} = await api.post("auth/forgot-password", {email})
      return data
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to load information about an old password";
      return rejectWithValue(message);
    }
  }
)

const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async({email, code, newPassword} , {rejectWithValue}) => {
    try {
      const {data} = await api.post("auth/reset-password", {email, code, newPassword})
      return data
    } catch (error) {
        const message =
        error.response?.data.message ||
        error.message ||
        "Failed to update an old password";
      return rejectWithValue(message);
    }
  }
)

export {
  registerUser,
  verifyEmail,
  sendCodeNewCode,
  login,
  getMe,
  updateUsername,
  updatePassword,
  forgotPassword,
  resetPassword
};
