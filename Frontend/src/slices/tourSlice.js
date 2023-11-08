import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toursApi from "../apis/toursApi";

export const createTour = createAsyncThunk(
  "tours/create",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await toursApi.createTour(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllTours = createAsyncThunk(
  "tours/list",
  async (rejectWithValue) => {
    try {
      const response = await toursApi.getAllTours();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getTourDetail = createAsyncThunk(
  "tours/detail",
  async (tourId, { rejectWithValue }) => {
    try {
      const response = await toursApi.getTourDetail(tourId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateTour = createAsyncThunk(
  "tours/update",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await toursApi.updateTour(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const tourSlice = createSlice({
  name: "tour",
  initialState: {
    tours: [],
    tour: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [createTour.pending]: (state) => {
      state.loading = true;
    },
    [createTour.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [createTour.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.tour = action.payload.data.data;
    },
    [updateTour.pending]: (state) => {
      state.loading = true;
    },
    [updateTour.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateTour.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.tour = action.payload.data.data;
    },
    [getAllTours.pending]: (state) => {
      state.loading = true;
    },
    [getAllTours.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllTours.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.tours = action.payload.data.data;
    },
    [getTourDetail.pending]: (state) => {
      state.loading = true;
    },
    [getTourDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getTourDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.tour = action.payload.data.data;
    },
  },
});
export default tourSlice.reducer;
