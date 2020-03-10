import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import loginReducer from './reducers/loginReducer';
import drawerReducer from './reducers/drawerReducer';
import navigationReducer from './reducers/navigationReducer';
import taskReducer from './reducers/taskReducer';
import commentReducer from './reducers/commentReducer';
import companyReducer from './reducers/companyReducer';
import itemReducer from './reducers/itemReducer';
import userReducer from './reducers/userReducer';
import sidebarReducer from './reducers/sidebarReducer';
import subtaskReducer from './reducers/subtaskReducer';

//all reducers gathered together for the redux storage
const reducers = combineReducers({
  loginReducer,
  drawerReducer,
  navigationReducer,
  taskReducer,
  commentReducer,
  companyReducer,
  itemReducer,
  userReducer,
  sidebarReducer,
  subtaskReducer,
});

//all enhancers gathered together for the redux storage
const enhancers = compose(
  applyMiddleware(ReduxThunk),
);

//creates redux store and exports it
export default () => createStore(reducers, {}, enhancers);
