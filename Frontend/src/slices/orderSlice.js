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
export const orderSlice = createSlice({
  name: "order",
  initialState: {
    totalData: 0,
    orders: [],
    order: {},
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
      state.tour = action.payload.data.data;
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
  },
});
export default orderSlice.reducer;
