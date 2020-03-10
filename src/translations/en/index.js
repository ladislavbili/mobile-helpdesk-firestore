import comment from './comment';
import company from './company';
import general from './general';
import item from './item';
import login from './login';
import search from './search';
import sidebar from './sidebar';
import task from './task';
import user from './user';
import account from './account';

//connects partial translations into one lagunage pack
export default Object.assign(
  account,
  comment,
  company,
  general,
  item,
  login,
  search,
  sidebar,
  task,
  user,
);
