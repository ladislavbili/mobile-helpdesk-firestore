import { SET_SIDEBAR, SET_SIDEBAR_LOADING, LOGIN_LOGOUT } from '../types'

const initialState = {
  sidebar:null,
  sidebarLoaded:false
};

export default function sidebarReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SIDEBAR_LOADING:{
      return {...state,sidebarLoaded:action.sidebarLoaded}
    }
    case SET_SIDEBAR:
      return { ...state, sidebar:action.sidebar,sidebarLoaded:true };
    case LOGIN_LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}
