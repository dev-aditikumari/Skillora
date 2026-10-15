import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token :localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
    signupData : null , 
    loading : false 

}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        setToken(state ,action ) {
state.token = action.payload;
        },
           setSignUpData(state ,action ) {
state.signupData= action.payload;
        },
           setLoading(state ,action ) {
state.loading = action.payload;
        }
    }
});

export const {setSignUpData , setToken , setLoading } =  authSlice.actions;
export default authSlice.reducer;
