import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commissionsApi from "../apis/commissionApi";

export const createCommission = createAsyncThunk(
  "commissions/create",
  async (commissions, { rejectWithValue }) => {
    try {
      const response = await commissionsApi.createCommission(commissions);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllCommissions = createAsyncThunk(
  "commissions/list",
  async (rejectWithValue) => {
    try {
      const response = await commissionsApi.getAllCommissions();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getCommissionDetail = createAsyncThunk(
  "commissions/detail",
  async (commissionId, { rejectWithValue }) => {
    try {
      const response = await commissionsApi.getCommissionDetail(commissionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getCommissionEnable = createAsyncThunk(
  "commissions/enable",
  async (commissionId, { rejectWithValue }) => {
    try {
      const response = await commissionsApi.getCommissionEnable(commissionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateCommission = createAsyncThunk(
  "commissions/update",
  async (discount, { rejectWithValue }) => {
    try {
      const response = await commissionsApi.updateCommission(discount);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const commissionSlice = createSlice({
  name: "commission",
  initialState: {
    totalData: 0,
    commissions: [],
    commission: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [createCommission.pending]: (state) => {
      state.loading = true;
    },
    [createCommission.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [createCommission.fulfilled]: (state, action) => {
      state.loading = false;
      state.commission = action.payload.data.data;
    },
    [getAllCommissions.pending]: (state) => {
      state.loading = true;
    },
    [getAllCommissions.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllCommissions.fulfilled]: (state, action) => {
      state.loading = false;
      state.commissions = action.payload.data.data;
    },
    [getCommissionDetail.pending]: (state) => {
      state.loading = true;
    },
    [getCommissionDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCommissionDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.commission = action.payload.data.data;
    },
    [getCommissionEnable.pending]: (state) => {
      state.loading = true;
    },
    [getCommissionEnable.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCommissionEnable.fulfilled]: (state, action) => {
      state.loading = false;
      state.commission = action.payload.data.data;
    },
    [updateCommission.pending]: (state) => {
      state.loading = true;
    },
    [updateCommission.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateCommission.fulfilled]: (state, action) => {
      state.loading = false;
      state.commission = action.payload.data.data;
    },
  },
});
export default commissionSlice.reducer;
