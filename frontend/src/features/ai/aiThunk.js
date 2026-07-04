import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

const getAIMatch = createAsyncThunk(
  "ai/getMatch",
  async(_, {rejectWithValue}) => {
    try {
      const {data} = await api.post("/ai/match")
      return data
    } catch (error) {
            const message =
        error.response?.data.message ||
        error.message ||
        "Failed to get any matches";
      return rejectWithValue(message);
    }
  }
)

export {
  getAIMatch
}