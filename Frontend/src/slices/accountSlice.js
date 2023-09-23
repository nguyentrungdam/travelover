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
  async (user, { rejectWithValue, dispatch }) => {
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
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.data.data.accessToken);
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
    // ,
    // [isUserLoggedIn.pending]: (state) => {
    //   state.loading = true;
    // },
    // [isUserLoggedIn.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.error = action.error;
    // },
    // [isUserLoggedIn.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   state.user = action.payload.data.user;
    //   state.isAuthenticated = true;
    // },
  },
});
export const { signout } = accountSlice.actions;
export default accountSlice.reducer;
