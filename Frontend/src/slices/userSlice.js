import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../apis/userApi";

export const getAllUsers = createAsyncThunk(
  "accounts/list",
  async (rejectWithValue) => {
    try {
      const response = await userApi.getAllUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getAllUsers.pending]: (state) => {
      state.loading = true;
    },
    [getAllUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.users = action.payload.data.data;
    },
  },
});
export default userSlice.reducer;
