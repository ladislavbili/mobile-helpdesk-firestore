import { SET_FILTER_PROJECT, SET_FILTER_FILTER, LOGIN_LOGOUT } from '../types'

const initialState = {
  projectID:'all',
  filterID:'none',
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER_PROJECT:{
      return { ...state, projectID: action.projectID  };
    }
    case SET_FILTER_FILTER:{
      return { ...state, filterID: action.filterID  };
    }
    case LOGIN_LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}
