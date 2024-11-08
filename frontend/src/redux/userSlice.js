import { createSlice } from "@reduxjs/toolkit";

const initialState={
    loading : false,
    error : null,
    user: null, 
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        loginStart:(state)=>{
            state.loading = true;
            state.error = null;
            state.user = null;
        },
        login: (state, action) => {
            state.loading = true;
            state.error = null;
            state.user = action.payload;
        },
        logout: (state) => {
            state.loading = false;
            state.error = null;
            state.user = null;
        },
        error: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

export const { loginStart, login, logout, error } = userSlice.actions;

export default userSlice.reducer;