import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./authConstants";
import {registerUser} from "./authThunk"

const initialState = {
  user: null,
  accessToken: null,
  status: AUTH_STATUS.IDLE,
  error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.status = AUTH_STATUS.IDLE
      state.error = null
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(registerUser.pending, (state) =>{
      state.status = AUTH_STATUS.LOADING
      state.error = null
    })
    .addCase(registerUser.fulfilled, (state) =>{
      state.status = AUTH_STATUS.SUCCEEDED
    })
    .addCase(registerUser.rejected, (state, action) =>{
      state.status = AUTH_STATUS.FAILED
      state.error = action.payload
    })
  }
})

export default authSlice.reducer
export const {
  setCredentials,
  setUser,
  setError,
  setStatus,
  clearAuth

} = authSlice.actions