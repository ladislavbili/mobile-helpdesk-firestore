import loginReducer from './loginReducer';
import drawerReducer from './drawerReducer';
import taskReducer from './taskReducer';
import commentReducer from './commentReducer';
import companyReducer from './companyReducer';
import itemReducer from './itemReducer';
import userReducer from './userReducer';
import sidebarReducer from './sidebarReducer';
import subtaskReducer from './subtaskReducer';
import storageReducers from './storage';
export default {
  drawerReducer,
  ...storageReducers,
  loginReducer,

  taskReducer,
  commentReducer,
  companyReducer,
  itemReducer,
  userReducer,
  sidebarReducer,
  subtaskReducer,
}
