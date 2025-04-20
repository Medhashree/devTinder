import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'connections',
    initialState: [],
    reducers: {
        addConnections: (state, action) => {
            state.push(...action.payload);
        },
        removeConnections: (state, action) => {
            return state.filter(r => r._id !== action.payloadload);
        }
    }
});

export const {addConnections, removeConnections} = connectionSlice.actions;
export default connectionSlice.reducer;