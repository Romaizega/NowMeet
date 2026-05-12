import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "./authConstants";

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