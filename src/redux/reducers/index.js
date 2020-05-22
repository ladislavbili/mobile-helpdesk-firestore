import taskReducer from './taskReducer';
import commentReducer from './commentReducer';
import companyReducer from './companyReducer';
import itemReducer from './itemReducer';
import userReducer from './userReducer';
import subtaskReducer from './subtaskReducer';


import storageReducers from './storage';
import loginReducer from './loginReducer';
import drawerReducer from './drawerReducer';
import filterReducer from './filterReducer';
import invoicesReducer from './invoicesReducer';

export default {
  drawerReducer,
  ...storageReducers,
  loginReducer,
  filterReducer,
  invoicesReducer,

  taskReducer,
  commentReducer,
  companyReducer,
  itemReducer,
  userReducer,
  subtaskReducer,
}
