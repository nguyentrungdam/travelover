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
export const getToursDiscount = createAsyncThunk(
  "tours/list-discount-tour",
  async (rejectWithValue) => {
    try {
      const response = await toursApi.getToursDiscount();
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
export const updateTourStatus = createAsyncThunk(
  "tours/status/update",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await toursApi.updateTourStatus(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const searchTour = createAsyncThunk(
  "tours/search",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await toursApi.searchTour(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const searchTour2 = createAsyncThunk(
  "tours/search2",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await toursApi.searchTour2(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const searchTourAdmin = createAsyncThunk(
  "tours/list/search",
  async (tour, { rejectWithValue }) => {
    try {
      const response = await toursApi.searchTourAdmin(tour);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const tourSlice = createSlice({
  name: "tour",
  initialState: {
    totalData: 0,
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
      state.tour = action.payload.data.data;
    },
    [searchTour.pending]: (state) => {
      state.loading = true;
    },
    [searchTour.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [searchTour.fulfilled]: (state, action) => {
      state.loading = false;
      state.tours = action.payload.data.data;
      state.totalData = action.payload.data.totalData;
    },
    [searchTour2.pending]: (state) => {
      state.loading = true;
    },
    [searchTour2.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [searchTour2.fulfilled]: (state, action) => {
      state.loading = false;
      state.tours = action.payload.data.data;
      state.totalData = action.payload.data.totalData;
    },
    [searchTourAdmin.pending]: (state) => {
      state.loading = true;
    },
    [searchTourAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [searchTourAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      state.tours = action.payload.data.data;
      state.totalData = action.payload.data.totalData;
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
      state.tour = action.payload.data.data;
    },
    [getToursDiscount.pending]: (state) => {
      state.loading = true;
    },
    [getToursDiscount.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getToursDiscount.fulfilled]: (state, action) => {
      state.loading = false;
      state.tours = action.payload.data.data;
    },
    [updateTourStatus.pending]: (state) => {
      state.loading = true;
    },
    [updateTourStatus.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateTourStatus.fulfilled]: (state, action) => {
      state.loading = false;
      state.tour = action.payload.data.data;
    },
  },
});
export default tourSlice.reducer;
