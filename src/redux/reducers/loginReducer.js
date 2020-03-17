import { AUTOLOGIN_DONE, SET_USER_DATA, SET_USER_ID, SET_USER_STATUSES, LOGIN_LOGOUT } from '../types';

const initialState = {
  id:null,
  userData:null,
  statuses:[],

  loggedIn:false,
  autologinDone:false,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {

    case AUTOLOGIN_DONE:{
      return {
        ...state,
        autologinDone:true
      }
    }

    case SET_USER_DATA:{
      return {
        ...state,
        userData: action.userData,
        statuses: action.userData.statuses || state.statuses,
        loggedIn:true
      };
    }

    case SET_USER_ID:{
      return {
        ...state,
        id: action.id
      };
    }

    case SET_USER_STATUSES:{
      return {
        ...state,
        statuses:action.statuses || [],
      };
    }

    case LOGIN_LOGOUT:{
      return {
        ...initialState,
        autologinDone:true
      }
    }

    default:
      return state;
  }
}
