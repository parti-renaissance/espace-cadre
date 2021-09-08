import { combineReducers } from 'redux';
import { reducer as auth } from '../auth';
import { reducer as template } from '../template';
import { reducer as dashboard } from '../dashboard';
import { reducer as adherents } from '../adherents';

const rootReducer = combineReducers({
    auth,
    template,
    dashboard,
    adherents,
});

export default rootReducer;
