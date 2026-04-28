import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchDashboard = createAsyncThunk(
    "/dash/fetchDashboard",
    async(__,{rejectWithValue}) =>{
        try{
            const res = await API.get("/dash/dashboard")
            return res.data;
        }catch(err){
            return rejectWithValue(err.response?.data || err.message)
        }

    }
);

export const fetchRecentAttempts = createAsyncThunk(
  "dashboard/recentAttempts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/dash/attempts");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const dashSlice = createSlice({
    name: "dashboard",
    initialState: {
        data: null,
        recentAttempts: [],
        loading: false,
        error: false
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchDashboard.pending,(state) => {
            state.loading = true;
        })
        .addCase(fetchDashboard.fulfilled,(state,action) => {
            state.loading = false;
            state.data  = action.payload;
        })
        .addCase(fetchDashboard.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchRecentAttempts.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchRecentAttempts.fulfilled, (state, action) => {
            state.loading = false;
            state.recentAttempts = action.payload;
        })
        .addCase(fetchRecentAttempts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default dashSlice.reducer