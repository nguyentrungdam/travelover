import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hotelsApi from "../apis/hotelsApi";

export const createHotel = createAsyncThunk(
  "hotels/create",
  async (hotel, { rejectWithValue }) => {
    try {
      const response = await hotelsApi.createHotel(hotel);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllhotels = createAsyncThunk(
  "hotels/list",
  async (rejectWithValue) => {
    try {
      const response = await hotelsApi.getAllhotels();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const gethotelDetail = createAsyncThunk(
  "hotels/detail",
  async (hotelId, { rejectWithValue }) => {
    try {
      const response = await hotelsApi.gethotelDetail(hotelId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updatehotel = createAsyncThunk(
  "hotels/update",
  async (hotel, { rejectWithValue }) => {
    try {
      const response = await hotelsApi.updatehotel(hotel);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const hotelSlice = createSlice({
  name: "hotel",
  initialState: {
    hotels: [],
    hotel: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [createHotel.pending]: (state) => {
      state.loading = true;
    },
    [createHotel.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [createHotel.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.hotel = action.payload.data.data;
    },
    [updatehotel.pending]: (state) => {
      state.loading = true;
    },
    [updatehotel.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updatehotel.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.hotel = action.payload.data.data;
    },
    [getAllhotels.pending]: (state) => {
      state.loading = true;
    },
    [getAllhotels.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllhotels.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.hotels = action.payload.data.data;
    },
    [gethotelDetail.pending]: (state) => {
      state.loading = true;
    },
    [gethotelDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [gethotelDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.hotel = action.payload.data.data;
    },
  },
});
export default hotelSlice.reducer;
