import { AUTH_STATUS } from "../auth/authConstants";
import { createSlice } from "@reduxjs/toolkit";
import { getAIMatch } from "./aiThunk";

const initialState = { 
  matches: [],
  status: AUTH_STATUS.IDLE,
  error: null,
}

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    clearMatches: (state) => {
      state.matches = []
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getAIMatch.pending, (state) => {
      state.status = AUTH_STATUS.LOADING
      state.error = null
    })
    .addCase(getAIMatch.fulfilled, (state, action) => {
      state.status = AUTH_STATUS.SUCCEEDED
      state.matches = action.payload.result
    })
    .addCase(getAIMatch.rejected, (state, action) => {
      state.status = AUTH_STATUS.FAILED
      state.error = action.payload
    })
  }
})


export default aiSlice.reducer
export const {setError, setStatus, clearMatches} = aiSlice.actions