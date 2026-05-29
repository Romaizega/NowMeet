import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

const createEvent = createAsyncThunk(
  "events/createEvent",
  async (
    {
      title,
      description,
      event_start,
      duration,
      max_participants,
      place_name,
      latitude,
      longitude,
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/event/create", {
        title,
        description,
        event_start,
        duration,
        max_participants,
        place_name,
        latitude,
        longitude,
      });
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to create an event";
      return rejectWithValue(message);
    }
  },
);

const getAllEvents = createAsyncThunk(
  "events/getAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/event/events");
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to get all events";
      return rejectWithValue(message);
    }
  },
);

const getEventById = createAsyncThunk(
  "events/getEventById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/event/${id}`);
      return data;
    } catch (error) {
      const message =
        error.response?.data.message || error.message || "Failed to get event";
      return rejectWithValue(message);
    }
  },
);

const joinToEvent = createAsyncThunk(
  "event/joinToEvent",
  async ( id , { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/event/${id}/join`);
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to join to event";
      return rejectWithValue(message);
    }
  },
);

export { createEvent, getAllEvents, getEventById, joinToEvent };
