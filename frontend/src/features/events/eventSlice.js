import { AUTH_STATUS } from "../auth/authConstants";
import { createEvent, getAllEvents, getEventById, joinToEvent, cancelEvent } from "./eventThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  participants: [],
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
      })
      .addCase(getEventById.pending, (state) => {
        state.status =AUTH_STATUS.LOADING
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED
        state.currentEvent = action.payload.event
        state.participants = action.payload.participants
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload
      })
      .addCase(joinToEvent.pending, (state) => {
        state.status = AUTH_STATUS.LOADING
      })
      .addCase(joinToEvent.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED
        state.participants = action.payload.participants
      })
      .addCase(joinToEvent.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload
      })
      .addCase(cancelEvent.pending, (state) => {
        state.status = AUTH_STATUS.LOADING
      })
      .addCase(cancelEvent.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED
        state.participants = action.payload.participants
      })
      .addCase(cancelEvent.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload
      })
  },
});

export default eventSlice.reducer;
export const { setCurrentEvent, clearCurrentEvent, setError, setStatus } =
  eventSlice.actions;
