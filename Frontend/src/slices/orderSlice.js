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
  },
});
export default orderSlice.reducer;
