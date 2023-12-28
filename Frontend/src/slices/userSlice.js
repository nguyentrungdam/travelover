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
export const updateRole = createAsyncThunk(
  "accounts/set-role",
  async (user, { rejectWithValue }) => {
    try {
      const response = await userApi.updateRole(user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const searchUser = createAsyncThunk(
  "accounts/list/search",
  async (user, { rejectWithValue }) => {
    console.log(1);
    try {
      const response = await userApi.searchUser(user);
      console.log(response);
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
    user: {},
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
    [searchUser.pending]: (state) => {
      state.loading = true;
    },
    [searchUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [searchUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload.data.data;
    },
  },
});
export default userSlice.reducer;
