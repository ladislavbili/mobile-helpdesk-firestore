
import { OPEN_DRAWER, CLOSE_DRAWER, CHANGE_MATERIAL, CHANGE_PLATFORM } from '../types';

const initialState = {
  drawerState: 'closed',
  drawerDisabled: true,
  themeState: 'platform',
};

export default function drawerReducer (state = initialState, action) {
  switch (action.type) {
    case OPEN_DRAWER:
      return {
        ...state,
        drawerState: 'opened',
      };
    case CLOSE_DRAWER:
      return {
        ...state,
        drawerState: 'closed',
      };
    case CHANGE_PLATFORM:
      return {
        ...state,
        themeState: 'platform',
      };
    case CHANGE_MATERIAL:
      return {
        ...state,
        themeState: 'material',
      };
    default:
      return state;
  }

  return state;
}
