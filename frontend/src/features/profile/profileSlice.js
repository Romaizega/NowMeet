import { AUTH_STATUS } from "../auth/authConstants";
import { profileView, getAllProfiles, getUserEvents } from "./profileThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publicProfile: null,
  allProfiles: null,
  userEvents: [],
  status: AUTH_STATUS.IDLE,
  error: null,
  pagination: {
    page: 1,
    total: 0,
    totalPages: 1,
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setPublicProfile: (state, action) => {
      state.publicProfile = action.payload;
    },
    clearPublicProfile: (state, action) => {
      state.publicProfile = null;
      state.userInterests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileView.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(profileView.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.publicProfile = action.payload.profile;
      })
      .addCase(profileView.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(getAllProfiles.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAllProfiles.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.allProfiles = action.payload.profiles;
        state.pagination.page = action.payload.page
        state.pagination.total = action.payload.total
        state.pagination.totalPages = action.payload.totalPages
      })
      .addCase(getAllProfiles.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(getUserEvents.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.userEvents = action.payload.userEvents;
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
export const { setError, setPublicProfile, setStatus, clearPublicProfile } =
  profileSlice.actions;
