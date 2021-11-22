import { createSlice } from '@reduxjs/toolkit'
import { v1 as uuid } from 'uuid'

const initialState = {}

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, action) => ({ ...state, [uuid()]: action.payload }),
    clearError: (state, action) => {
      const { [action.payload.id]: _, ...newState } = state
      return newState
    },
  },
})

export const { setError, clearError } = errorsSlice.actions

export default errorsSlice.reducer
