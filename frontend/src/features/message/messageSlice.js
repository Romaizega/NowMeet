import { AUTH_STATUS } from "../auth/authConstants";
import { createSlice } from "@reduxjs/toolkit";
import { getInbox } from "../message/messageThunk";

const initialState = {
  inbox: [],
  status: AUTH_STATUS.IDLE,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInbox.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getInbox.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.inbox = action.payload.resultMessages;
      })
      .addCase(getInbox.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
export const { setError, setStatus } = messageSlice.actions;
