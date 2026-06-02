import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

const profileView = createAsyncThunk(
  "profile/viewProfile",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/profiles/${id}`);
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to load profile";
      return rejectWithValue(message);
    }
  },
);

const getUserInterests = createAsyncThunk(
  "profile/userInterests",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/interests/user/${id}`);
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to get user interests";
      return rejectWithValue(message);
    }
  },
);

export { profileView, getUserInterests };
