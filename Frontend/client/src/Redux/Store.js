import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Slices/authSlice'
import questionReducer from './Slices/questionSlice'
import dashboardReducer from './Slices/dashboardSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        question: questionReducer,
        dashboard : dashboardReducer
    }
})