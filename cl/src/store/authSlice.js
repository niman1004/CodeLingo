import { createSlice } from '@reduxjs/toolkit'

const userDataFromStorage = localStorage.getItem("userData");

const initialState = {
    status: !!userDataFromStorage,
    userData: userDataFromStorage ? JSON.parse(userDataFromStorage) : null,
    accessToken: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.accessToken = action.payload.accessToken
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.accessToken = null;
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer