import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import discountsApi from "../apis/discountApi";

export const createDiscount = createAsyncThunk(
  "discounts/create",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await discountsApi.createDiscount(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllDiscounts = createAsyncThunk(
  "discounts/list",
  async (rejectWithValue) => {
    try {
      const response = await discountsApi.getAllDiscounts();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getDiscountDetail = createAsyncThunk(
  "discounts/detail",
  async (discountId, { rejectWithValue }) => {
    try {
      const response = await discountsApi.getDiscountDetail(discountId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getCheckDiscount = createAsyncThunk(
  "discounts/actual-discount-value",
  async ({ discountCode, totalPrice }, { rejectWithValue }) => {
    try {
      const response = await discountsApi.getCheckDiscount(
        discountCode,
        totalPrice
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateDiscount = createAsyncThunk(
  "discounts/update",
  async (discount, { rejectWithValue }) => {
    try {
      const response = await discountsApi.updateDiscount(discount);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const searchDiscountAdmin = createAsyncThunk(
  "discounts/list/search",
  async (discount, { rejectWithValue }) => {
    try {
      const response = await discountsApi.searchDiscountAdmin(discount);
      console.log("0009999");
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const discountSlice = createSlice({
  name: "discount",
  initialState: {
    totalData: 0,
    discounts: [],
    discount: {},
    totalSale: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [createDiscount.pending]: (state) => {
      state.loading = true;
    },
    [createDiscount.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [createDiscount.fulfilled]: (state, action) => {
      state.loading = false;
      state.discount = action.payload.data.data;
    },
    [getAllDiscounts.pending]: (state) => {
      state.loading = true;
    },
    [getAllDiscounts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllDiscounts.fulfilled]: (state, action) => {
      state.loading = false;
      state.discounts = action.payload.data.data;
    },
    [getDiscountDetail.pending]: (state) => {
      state.loading = true;
    },
    [getDiscountDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getDiscountDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.discount = action.payload.data.data;
    },
    [getCheckDiscount.pending]: (state) => {
      state.loading = true;
    },
    [getCheckDiscount.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCheckDiscount.fulfilled]: (state, action) => {
      state.loading = false;
      state.totalSale = action.payload.data.data;
    },
    [updateDiscount.pending]: (state) => {
      state.loading = true;
    },
    [updateDiscount.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateDiscount.fulfilled]: (state, action) => {
      state.loading = false;
      state.discount = action.payload.data.data;
    },
    [searchDiscountAdmin.pending]: (state) => {
      state.loading = true;
    },
    [searchDiscountAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [searchDiscountAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      state.discounts = action.payload.data.data;
      state.totalData = action.payload.data.totalData;
    },
  },
});
export default discountSlice.reducer;
