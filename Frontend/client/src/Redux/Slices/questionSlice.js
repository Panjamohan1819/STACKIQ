import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";
//fetch question
export const fetchQuestion = createAsyncThunk(
    "/test/fetchQuestion",
    async(data,{rejectWithValue}) => {
        try{
            const res = await API.get("/test/question",{params:{type:data.type,topic:data.topic}})
            return res.data
        }
         catch(err){
            return rejectWithValue(err.response?.data || err.message)
    } 
    }
   
);
//generate questions
export const generateQuestion = createAsyncThunk(
    "/ai/generatequestion",
    async(data,{rejectWithValue}) =>{
        try{
            const res = await API.post("ai/generate",data)
            return res.data
        }
        catch(err){
             return rejectWithValue(err.response?.data || err.message)
        }
    }
    
)
// submit question
export const submitAnswer = createAsyncThunk(
    "test/submitAnswer",
    async(data,{rejectWithValue}) => {
        try{
            const res = await API.post("test/submitAnswer",data)
            return res.data
        }
        catch(err){
             return rejectWithValue(err.response?.data || err.message)
        }
    }
)
const questionSlice = createSlice({ 
    name:"test",
    initialState:{
        questions:[],
        currentIndex :0,
        currentDifficulty: "medium",
        result:null,
        data : null,
        loading:false,
        error: false,   
    },
    reducers:{
        nextQuestion: (state) => { state.currentIndex += 1 },
        setDifficulty: (state, action) => { state.currentDifficulty = action.payload }
    },
    extraReducers:(builder) =>{
        builder
        .addCase(fetchQuestion.pending,(state) =>{
            state.loading = true;
        })
        .addCase(fetchQuestion.fulfilled,(state,action) =>{
            state.loading = false;
            state.questions = action.payload;
        })
        .addCase(fetchQuestion.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
         // generate questions
        .addCase(generateQuestion.pending,(state) =>{
            state.loading = true;
        })
        .addCase(generateQuestion.fulfilled,(state,action) =>{
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(generateQuestion.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    //    submitanswer
        .addCase(submitAnswer.pending,(state) =>{
            state.loading = true;
        })
        .addCase(submitAnswer.fulfilled,(state,action) =>{
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(submitAnswer.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
       

    }
})
export const { nextQuestion, setDifficulty } = questionSlice.actions
export default questionSlice.reducer