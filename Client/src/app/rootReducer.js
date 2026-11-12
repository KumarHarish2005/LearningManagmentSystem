import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice.js"
import { authApi } from "@/features/api/authapi.js"
import { courseApi } from "@/features/api/courseapi.js";
import { purchaseApi } from "@/features/api/purchaseapi.js";
import { courseProgressApi } from "@/features/api/courseProgressapi.js";

const rootReducer  = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    auth:authReducer,
    
})

export default rootReducer;