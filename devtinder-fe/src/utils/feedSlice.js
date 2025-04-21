import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        items: []
    },
    reducers: {
        addFeed: (state, action) => {
            state.items.push(...action.payload);
          },
          removeFeed: (state) => {
            state.items.shift();
          }
    }
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;