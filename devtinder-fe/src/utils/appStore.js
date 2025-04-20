import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice.js';
import feedReducer from './feedSlice.js';
import connectionsReducer from './connectionSlice.js'

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        connections: connectionsReducer,
    }
});

export default appStore;