import { combineReducers } from 'redux';
import { reducer as auth } from '../auth';
import { reducer as template } from '../template';
import { reducer as dashboard } from '../dashboard';
import { reducer as contacts } from '../contacts';

const rootReducer = combineReducers({
    auth,
    template,
    dashboard,
    contacts,
});

export default rootReducer;
