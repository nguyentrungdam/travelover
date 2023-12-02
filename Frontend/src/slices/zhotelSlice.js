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

export const zhotelSlice = createSlice({
  name: "hotelz",
  initialState: {
    zhotels: [],
    zhotel: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
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
  },
});
export default zhotelSlice.reducer;
