import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import zhotelApi from "../apis/zhotelApi";

export const getAllHotelz = createAsyncThunk(
  "ehotels/list",
  async (rejectWithValue) => {
    try {
      const response = await zhotelApi.getAllHotelz();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createZHotel = createAsyncThunk(
  "hotels/create",
  async (hotel, { rejectWithValue }) => {
    try {
      const response = await zhotelApi.createZHotel(hotel);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getZHotelDetail = createAsyncThunk(
  "ehotels/detail",
  async (eHotelId, { rejectWithValue }) => {
    try {
      const response = await zhotelApi.getZHotelDetail(eHotelId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateZHotel = createAsyncThunk(
  "ehotels/update",
  async (hotel, { rejectWithValue }) => {
    try {
      const response = await zhotelApi.updateZHotel(hotel);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getZHotelRoomSearch = createAsyncThunk(
  "ehotels/room/search2",
  async (hotel, { rejectWithValue }) => {
    try {
      const response = await zhotelApi.getZHotelRoomSearch(hotel);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const zhotelSlice = createSlice({
  name: "hotelz",
  initialState: {
    zhotels: [],
    zhotel: {},
    zrooms: [],
    zroom: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [createZHotel.pending]: (state) => {
      state.loading = true;
    },
    [createZHotel.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [createZHotel.fulfilled]: (state, action) => {
      state.loading = false;
      state.zhotel = action.payload.data.data;
    },
    [getAllHotelz.pending]: (state) => {
      state.loading = true;
    },
    [getAllHotelz.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAllHotelz.fulfilled]: (state, action) => {
      state.loading = false;
      state.zhotels = action.payload.data.data;
      console.log(state.zhotels);
    },
    [getZHotelDetail.pending]: (state) => {
      state.loading = true;
    },
    [getZHotelDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getZHotelDetail.fulfilled]: (state, action) => {
      state.loading = false;
      state.zhotel = action.payload.data.data;
    },
    [updateZHotel.pending]: (state) => {
      state.loading = true;
    },
    [updateZHotel.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateZHotel.fulfilled]: (state, action) => {
      state.loading = false;
      state.zhotel = action.payload.data.data;
    },
    [getZHotelRoomSearch.pending]: (state) => {
      state.loading = true;
    },
    [getZHotelRoomSearch.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getZHotelRoomSearch.fulfilled]: (state, action) => {
      state.loading = false;
      state.zrooms = action.payload.data.data;
    },
  },
});
export default zhotelSlice.reducer;
