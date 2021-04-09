import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    initAuth: false,
    isAuthenticated: false,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        initializeAuth(state) {
            state.initAuth = true
        },
    },
})

export const {initializeAuth} = authSlice.actions
export default authSlice.reducer
