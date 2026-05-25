import { AUTH_STATUS } from "../auth/authConstants";
import { createEvent, getAllEvents } from "./eventThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  currentEvent: null,
  status: AUTH_STATUS.IDLE,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    clearCurrentEvent: (state, action) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEvents.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.events = action.payload.events;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.events.push(action.payload.event);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
export const { setCurrentEvent, clearCurrentEvent, setError, setStatus } =
  eventSlice.actions;
