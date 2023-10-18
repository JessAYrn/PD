import { combineReducers } from "redux";
import journalReducer from "./journalReducer";
import walletReducer from './walletReducer';
import homePageReducer from './homePageReducer';
import actorReducer from './actorReducer';
import accountReducer from './accountReducer';
import notificationsReducer from './notificationsReducer';
import treasuryReducer  from "./treasuryReducer";

const rootReducer = combineReducers({
    journal: journalReducer,
    wallet: walletReducer,
    actor: actorReducer,
    account: accountReducer,
    homePage: homePageReducer,
    notifications: notificationsReducer,
    treasury: treasuryReducer
});


export default rootReducer;