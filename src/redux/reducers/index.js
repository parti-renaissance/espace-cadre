import { combineReducers } from 'redux';
import { reducer as auth } from '../auth';
import { reducer as template } from '../template';

const rootReducer = combineReducers({
    auth,
    template,
});

export default rootReducer;
