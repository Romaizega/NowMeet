import { AUTH_STATUS } from "../auth/authConstants";
import { profileView } from "./profileThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState ={
  publicProfile: null,
  status: AUTH_STATUS.IDLE,
  error: null,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers:{
    setError: (state, action) => {
      state.error = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setPublicProfile: (state, action) => {
      state.publicProfile = action.payload
    },
    clearPublicProfile: (state, action) => {
      state.publicProfile = null
       state.userInterests = []
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(profileView.pending, (state) => {
      state.status = AUTH_STATUS.LOADING
      state.error = null
    })
    .addCase(profileView.fulfilled, (state, action) => {
      state.status = AUTH_STATUS.SUCCEEDED
      state.publicProfile = action.payload.profile
    })
    .addCase(profileView.rejected, (state, action) => {
      state.status = AUTH_STATUS.FAILED
      state.error = action.payload
    })
  }
})


export default profileSlice.reducer
export const {setError, setPublicProfile, setStatus, clearPublicProfile} = profileSlice.actions