import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountApi from "../apis/accountApi";

export const signin = createAsyncThunk(
  "accounts/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await accountApi.signin(user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  "accounts/register",
  async (user, { rejectWithValue }) => {
    try {
      const response = await accountApi.signup(user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAccountProfile = createAsyncThunk(
  "accounts/profile/detail",
  async ({ rejectWithValue }) => {
    try {
      const response = await accountApi.getAccountProfile(
        localStorage.getItem("token")
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateUserInfo = createAsyncThunk(
  "accounts/profile/update",
  async (user, { rejectWithValue }) => {
    try {
      const response = await accountApi.updateUserInfo(user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateUserPassword = createAsyncThunk(
  "accounts/password/change",
  async (user, { rejectWithValue }) => {
    try {
      const response = await accountApi.updateUserPassword(user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendOtpToEmail = createAsyncThunk(
  "accounts/password/request-reset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await accountApi.sendOtpToEmail(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateResetPassword = createAsyncThunk(
  "accounts/password/reset",
  async (user, { rejectWithValue }) => {
    try {
      const response = await accountApi.updateResetPassword(user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// export const updateUserInfo = createAsyncThunk(
//   "user/updateUserInfo",
//   async (user, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await accountApi.updateUserInfo(user);
//       await dispatch(isUserLoggedIn());
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const sendOtpToEmail = createAsyncThunk(
//   "accounts/sendOtpToEmail",
//   async (user, { rejectWithValue }) => {
//     try {
//       const response = await accountApi.sendOtpToEmail(user);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const verifyOtp = createAsyncThunk(
//   "accounts/verifyOtp",
//   async (user, { rejectWithValue }) => {
//     try {
//       const response = await accountApi.verifyOtp(user);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
const initialIsAuthenticated = localStorage.getItem("token") ? true : false;
export const accountSlice = createSlice({
  name: "account",
  initialState: {
    account: {},
    loading: false,
    isAuthenticated: initialIsAuthenticated,
    error: null,
  },
  reducers: {
    signout: (state, action) => {
      state.isAuthenticated = false;
      state.account = {};
      console.log(state.account);
      localStorage.removeItem("token");
      localStorage.removeItem("fullName");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("phoneNumber");
    },
  },
  extraReducers: {
    [signin.pending]: (state) => {
      state.loading = true;
    },
    [signin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [signin.fulfilled]: (state, action) => {
      state.loading = false;
      state.account = action.payload.data;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.data.data.accessToken);
    },
    [signup.pending]: (state) => {
      state.loading = true;
    },
    [signup.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [signup.fulfilled]: (state, action) => {
      state.loading = false;
      state.account = action.payload.data;
    },
    [getAccountProfile.pending]: (state) => {
      state.loading = true;
    },
    [getAccountProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAccountProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.account = action.payload.data;
    },
    [updateUserInfo.pending]: (state) => {
      state.loading = true;
    },
    [updateUserInfo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateUserInfo.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.account = action.payload.data;
      console.log(state.account);
    },
    [updateUserPassword.pending]: (state) => {
      state.loading = true;
    },
    [updateUserPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateUserPassword.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [sendOtpToEmail.pending]: (state) => {
      state.loading = true;
    },
    [sendOtpToEmail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [sendOtpToEmail.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [updateResetPassword.pending]: (state) => {
      state.loading = true;
    },
    [updateResetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateResetPassword.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});
export const { signout } = accountSlice.actions;
export default accountSlice.reducer;
