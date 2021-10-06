import { combineReducers } from 'redux';
import { reducer as auth } from '../auth';
import { reducer as dashboard } from '../dashboard';
import { reducer as adherents } from '../adherents';
import { reducer as messagerie } from '../messagerie';

const rootReducer = combineReducers({
    auth,
    dashboard,
    adherents,
    messagerie,
});

export default rootReducer;
