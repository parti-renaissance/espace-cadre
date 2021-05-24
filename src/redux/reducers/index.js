import { combineReducers } from 'redux';
import { reducer as auth } from '../auth';
import { reducer as template } from '../template';
import { reducer as dashboard } from '../dashboard';

const rootReducer = combineReducers({
    auth,
    template,
    dashboard,
});

export default rootReducer;
