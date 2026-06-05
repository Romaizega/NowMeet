import { AUTH_STATUS } from "../auth/authConstants";
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllInterests,
  getUserInterests,
  addUserInterest,
  deleteUserInterest,
  getEventInterests,
  addEventInterest,
  deleteEventInterest,
} from "../interest/interestThunk";

const initialState = {
  allInterests: [],
  userInterest: [],
  eventInterest: [],
  status: AUTH_STATUS.IDLE,
  error: null,
};

const interestSlice = createSlice({
  name: "interest",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearUserInterest: (state) => {
      state.userInterest = [];
      state.eventInterest = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllInterests.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAllInterests.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.allInterests = action.payload.interests;
      })
      .addCase(getAllInterests.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(getUserInterests.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getUserInterests.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.userInterest = action.payload.interestsUser;
      })
      .addCase(getUserInterests.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(addUserInterest.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(addUserInterest.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.userInterest.push(action.payload.addInterestUser);
      })
      .addCase(addUserInterest.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(deleteUserInterest.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(deleteUserInterest.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.userInterest = state.userInterest.filter(
          (interest) => interest.id !== action.payload.interest_id,
        );
      })
      .addCase(deleteUserInterest.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(getEventInterests.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getEventInterests.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.eventInterest = action.payload.interestsEvent;
      })
      .addCase(getEventInterests.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })

      .addCase(addEventInterest.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(addEventInterest.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.eventInterest.push(action.payload.addInterestEvent);
      })
      .addCase(addEventInterest.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(deleteEventInterest.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(deleteEventInterest.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.eventInterest = state.eventInterest.filter(
          (interest) => interest.id !== action.payload.interest_id,
        );
      })
      .addCase(deleteEventInterest.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      });
  },
});

export default interestSlice.reducer;
export const { setError, setStatus, clearUserInterest } = interestSlice.actions;
