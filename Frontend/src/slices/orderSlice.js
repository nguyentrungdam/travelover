import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ordersApi from "../apis/ordersApi";

export const orderTour = createAsyncThunk(
  "orders/create",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await ordersApi.orderTour(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const orderRating = createAsyncThunk(
  "orders/rating",
  async (order, { rejectWithValue }) => {
    try {
      const response = await ordersApi.orderRating(order);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllOrders = createAsyncThunk(
  "orders/list",
  async (rejectWithValue) => {
    try {
      const response = await ordersApi.getAllOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateOrder = createAsyncThunk(
  "orders/status/update",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await ordersApi.updateOrder(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getOrderDetail = createAsyncThunk(
  "orders/detail",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getOrderDetail(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getOrderCheck = createAsyncThunk(
  "orders/payment/check",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getOrderCheck(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const searchOrderAdmin = createAsyncThunk(
  "prders/list/search",
  async (order, { rejectWithValue }) => {
    try {
      const response = await ordersApi.searchOrderAdmin(order);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getTurnover = createAsyncThunk(
  "statistics/turnover",
  async (year, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getTurnover(year);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getProfit = createAsyncThunk(
  "statistics/profit",
  async (year, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getProfit(year);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const orderSlice = createSlice({
  name: "order",
  initialState: {
    totalData: 0,
    orders: [],
    order: {},
    turnover: [],
    profit: [],
    status: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [orderTour.pending]: (state) => {
      state.loading = true;
    },
    [orderTour.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [orderTour.fulfilled]: (state, action) => {
      state.loading = false;
      state.order = action.payload.data.data;
    },
    [orderRating.pending]: (state) => {
      state.loading = true;
    },
    [orderRating.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [orderRating.fulfilled]: (state, action) => {
      state.loading = false;
      state.order = action.payload.data.data;
    },
    [getAllOrders.pending]: (state) => {
      state.loading = true;
    },
    [getAllOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.orders = action.payload.data.data;
    },
    [updateOrder.pending]: (state) => {
      state.loading = true;
    },
    [updateOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.order = action.payload.data.data;
    },
    [getOrderDetail.pending]: (state) => {
      state.loading = true;
    },
    [getOrderDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getOrderDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.order = action.payload.data.data;
    },
    [getOrderCheck.pending]: (state) => {
      state.loading = true;
    },
    [getOrderCheck.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getOrderCheck.fulfilled]: (state, action) => {
      state.loading = false;
      state.status = action.payload.data.data;
      console.log(state.status);
    },
    [searchOrderAdmin.pending]: (state) => {
      state.loading = true;
    },
    [searchOrderAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [searchOrderAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      state.orders = action.payload.data.data;
      state.totalData = action.payload.data.totalData;
    },
    [getTurnover.pending]: (state) => {
      state.loading = true;
    },
    [getTurnover.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getTurnover.fulfilled]: (state, action) => {
      state.loading = false;
      state.turnover = action.payload.data.data.valueList;
    },
    [getProfit.pending]: (state) => {
      state.loading = true;
    },
    [getProfit.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getProfit.fulfilled]: (state, action) => {
      state.loading = false;
      state.profit = action.payload.data.data.valueList;
    },
  },
});
export default orderSlice.reducer;
