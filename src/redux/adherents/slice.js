import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const adherentsSlice = createSlice({
  name: 'adherents',
  initialState,
  reducers: {
    resetAdherentsState() {
      return initialState
    },
  },
})

export const { resetAdherentsState } = adherentsSlice.actions

export default adherentsSlice.reducer
