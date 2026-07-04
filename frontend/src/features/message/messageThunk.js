import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

const getInbox = createAsyncThunk(
  "messages/inbox",
  async(_, {rejectWithValue}) => {
    try {
      const {data} = await api.get('/messages/inbox')
      return data
    } catch (error) {
      const message =
        error.response?.data.message ||
        error.message ||
        "Failed to get users messages";
      return rejectWithValue(message);
    }
    }
)
export {getInbox}