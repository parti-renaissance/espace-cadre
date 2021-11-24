import { combineReducers } from 'redux'
import { reducer as auth } from '../auth'
import { reducer as dashboard } from '../dashboard'
import { reducer as errors } from '../errors'

const rootReducer = combineReducers({
  auth,
  dashboard,
  errors,
})

export default rootReducer
