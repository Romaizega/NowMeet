import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

const createEvent = createAsyncThunk(
  "events/createEvent",
  async (
     formData, { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/event/create", formData);
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
  async ({page=1 , limit=10, city, country} = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/event/events", {params: {page, limit, city, country}});
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
  async (id, { rejectWithValue }) => {
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

const cancelEvent = createAsyncThunk(
  "event/cancelEvent",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/event/${id}/cancel`);
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to cancel event";
      return rejectWithValue(message);
    }
  },
);

const updateEvent = createAsyncThunk(
  "event/update",
  async (
    {id, formData}, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/event/${id}/edit`, formData);
      return data;
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to update event";
      return rejectWithValue(message);
    }
  },
);

const deleteEventById = createAsyncThunk(
  "event/deleteEvent",
  async(id, {rejectWithValue}) => {
    try {
      const {data} = await api.delete(`/event/${id}`)
      return data
    } catch (error) {
        const message =
        error.response?.data.message ||
        error.message ||
        "Failed to delete event";
      return rejectWithValue(message);
    }
  }
)

const getMyEvents = createAsyncThunk(
  "event/getMyEvents",
  async(_, {rejectWithValue}) => {
    try {
      const {data} = await api.get('/event/my')
      return data
    } catch (error) {
        const message =
        error.response?.data.message ||
        error.message ||
        "Failed to get mly event";
      return rejectWithValue(message);
    }
  }
)

export {
  createEvent,
  getAllEvents,
  getEventById,
  joinToEvent,
  cancelEvent,
  updateEvent,
  deleteEventById,
  getMyEvents
};
