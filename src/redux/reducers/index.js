import { combineReducers } from 'redux'
import { reducer as auth } from '../auth'
import { reducer as dashboard } from '../dashboard'
import { reducer as adherents } from '../adherents'

const rootReducer = combineReducers({
  auth,
  dashboard,
  adherents,
})

export default rootReducer
