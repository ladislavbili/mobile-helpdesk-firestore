import account from './account';
import comment from './comment';
import company from './company';
import general from './general';
import item from './item';
import login from './login';
import search from './search';
import sidebar from './sidebar';
import task from './task';
import user from './user';
import statuses from './statuses';

export default {
  ...account,
  ...comment,
  ...company,
  ...general,
  ...item,
  ...login,
  ...search,
  ...sidebar,
  ...task,
  ...user,
  ...statuses,
}
