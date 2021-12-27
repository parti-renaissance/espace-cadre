import { combineReducers } from 'redux'
import { reducer as auth } from '../auth'
import { reducer as errors } from '../errors'

const rootReducer = combineReducers({
  auth,
  errors,
})

export default rootReducer
