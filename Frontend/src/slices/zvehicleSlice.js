import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import zvehicleApi from "../apis/zvehicleApi";

export const getAllVehiclez = createAsyncThunk(
  "evehicles/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await zvehicleApi.getAllVehiclez();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createZVehicle = createAsyncThunk(
  "evehicles/create",
  async (vehicle, { rejectWithValue }) => {
    try {
      const response = await zvehicleApi.createZVehicle(vehicle);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getZVehicleDetail = createAsyncThunk(
  "evehicles/detail",
  async (eVehicleId, { rejectWithValue }) => {
    try {
      const response = await zvehicleApi.getZVehicleDetail(eVehicleId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateZVehicle = createAsyncThunk(
  "evehicles/update",
  async (vehicle, { rejectWithValue }) => {
    try {
      const response = await zvehicleApi.updateZVehicle(vehicle);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const zvehicleSlice = createSlice({
  name: "vehiclez",
  initialState: {
    zvehicles: [],
    zvehicle: {},
    totalData: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [createZVehicle.pending]: (state) => {
      state.loading = true;
    },
    [createZVehicle.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [createZVehicle.fulfilled]: (state, action) => {
      state.loading = false;
      state.zvehicle = action.payload.data.data;
    },
    [getAllVehiclez.pending]: (state) => {
      state.loading = true;
    },
    [getAllVehiclez.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllVehiclez.fulfilled]: (state, action) => {
      state.loading = false;
      state.zvehicles = action.payload.data.data;
    },
    [getZVehicleDetail.pending]: (state) => {
      state.loading = true;
    },
    [getZVehicleDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getZVehicleDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.zvehicle = action.payload.data.data;
    },

    [updateZVehicle.pending]: (state) => {
      state.loading = true;
    },
    [updateZVehicle.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateZVehicle.fulfilled]: (state, action) => {
      state.loading = false;
      state.zvehicle = action.payload.data.data;
    },
  },
});
export default zvehicleSlice.reducer;
