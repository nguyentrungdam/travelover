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
export const getAllHotel = createAsyncThunk(
  "hotels/list",
  async (rejectWithValue) => {
    try {
      const response = await hotelsApi.getAllHotel();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getHotelDetail = createAsyncThunk(
  "hotels/detail",
  async (hotelId, { rejectWithValue }) => {
    try {
      const response = await hotelsApi.getHotelDetail(hotelId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateHotel = createAsyncThunk(
  "hotels/update",
  async (hotel, { rejectWithValue }) => {
    try {
      const response = await hotelsApi.updateHotel(hotel);
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
      state.hotel = action.payload.data.data;
    },
    [updateHotel.pending]: (state) => {
      state.loading = true;
    },
    [updateHotel.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateHotel.fulfilled]: (state, action) => {
      state.loading = false;
      state.hotel = action.payload.data.data;
    },
    [getAllHotel.pending]: (state) => {
      state.loading = true;
    },
    [getAllHotel.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllHotel.fulfilled]: (state, action) => {
      state.loading = false;
      state.hotels = action.payload.data.data;
    },
    [getHotelDetail.pending]: (state) => {
      state.loading = true;
    },
    [getHotelDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getHotelDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.hotel = action.payload.data.data;
    },
  },
});
export default hotelSlice.reducer;
