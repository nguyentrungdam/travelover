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
  },
});
export default tourSlice.reducer;
