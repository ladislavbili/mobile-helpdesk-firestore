import { ADD_LISTENER, REMOVE_LISTENERS } from '../../types'

const initialState = {
  listeners: []
};

export default function storageUsersReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_LISTENER:{
      return {
        ...state,
        listeners: [...state.listeners, action.listener],
      };
    }
    case REMOVE_LISTENERS:{
      state.listeners.forEach( (unsubscribe) => unsubscribe() );
      return initialState;
    }
    default:
      return state;
  }
}
