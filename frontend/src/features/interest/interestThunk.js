import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

const getAllInterests = createAsyncThunk(
  "interests/allInterests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/interests/all");
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to load all interests";
      return rejectWithValue(message);
    }
  },
);

const getUserInterests = createAsyncThunk(
  "interests/userInterests",
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

const addUserInterest = createAsyncThunk(
  "interests/postUserInterest",
  async ({ interest_id }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/interests/user", { interest_id });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to add interest";
      return rejectWithValue(message);
    }
  },
);

const deleteUserInterest = createAsyncThunk(
  "interests/deleteUserInterest",
  async ({ interest_id }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/interests/user", {
        data: { interest_id },
      });
      return { ...data, interest_id };
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to delete interest";
      return rejectWithValue(message);
    }
  },
);

const getEventInterests = createAsyncThunk(
  "interests/eventInterests",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/interests/event/${id}`);
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to get event interests";
      return rejectWithValue(message);
    }
  },
);

const addEventInterest = createAsyncThunk(
  "interests/postEventInterest",
  async ({ id, interest_id }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/interests/event/${id}`, { interest_id });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to add interest to event";
      return rejectWithValue(message);
    }
  },
);

const deleteEventInterest = createAsyncThunk(
  "interests/deleteEventInterest",
  async ({ id, interest_id }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/interests/event/${id}`, {
        data: { interest_id },
      });
      return { ...data, interest_id };
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to delete interest from event";
      return rejectWithValue(message);
    }
  },
);

export {
  getAllInterests,
  getUserInterests,
  addUserInterest,
  deleteUserInterest,
  getEventInterests,
  addEventInterest,
  deleteEventInterest,
};
