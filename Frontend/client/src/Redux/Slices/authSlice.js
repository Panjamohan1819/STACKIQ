import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import API from '../../api/axios'
// Login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async(data,{rejectWithValue}) =>{
        try{
            const res  = await API.post("/auth/login",data);

            localStorage.setItem("token",res.data.token)

            return res.data
        }
        catch(err){
            return rejectWithValue(err.response?.data || err.message)
        }
    }
);
// Register
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async(data,{rejectWithValue})=>{
        try{
            const res  = await API.post("/auth/register",data);
            return res.data;
        }
        catch(err){
            return rejectWithValue(err.response?.data || err.message)
        }

    }
)

const authslice = createSlice({
    name : "auth",
    initialState:{
        user : null,
        token : localStorage.getItem("token") || null,
        loading: false,
        error: null
    },
    reducers:{
        logout: (state) =>{
            state.token = null;
            localStorage.removeItem("token")
        },
    },
    extraReducers:(builder) => {
        builder
        //login
        .addCase(loginUser.pending,(state) =>{
            state.loading = true;
        })
        .addCase(loginUser.fulfilled,(state,action) => {
            state.loading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = null
        })
        .addCase(loginUser.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // register
        .addCase(registerUser.pending,(state) =>{
            state.loading = true;
        })
        .addCase(registerUser.fulfilled,(state,action) =>{
            state.loading = false;
            state.error = null 
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }

});
export const {logout} = authslice.actions;
export default authslice.reducer;