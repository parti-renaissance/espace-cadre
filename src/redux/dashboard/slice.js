import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  adherents: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateAdherents(state, action) {
      state.adherents = action.payload
    },
    resetStatsState() {
      return initialState
    },
  },
})

export const { updateAdherents, resetStatsState } = dashboardSlice.actions
export default dashboardSlice.reducer
