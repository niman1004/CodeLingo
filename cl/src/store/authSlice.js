import {createSlice} from '@reduxjs/toolkit'




const initialState={
    status: false,
    userData: null,
    accessToken: null
}

const authSlice = createSlice({
    name: "auth", 
    initialState,
    reducers:{
        login:(state , action)=>{
            state.status=true;
            state.userData= action.payload.userData;
            state.accessToken= action.payload.accessToken
        },
      setUserData:(state , action)=>{
        state.userData= action.payload.data;
      },
        logout:(state)=>{
            state.status= false;
            state.userData=null;
            state.accessToken=null;
        }
    }
})

export const {login , logout , setUserData}= authSlice.actions
export default authSlice.reducer