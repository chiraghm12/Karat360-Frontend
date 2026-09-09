import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/user/userSlice"; // Adjust the import path as necessary

export const store = configureStore({
    reducer: {
        // Add your reducers here
        user: userReducer,
    },
});