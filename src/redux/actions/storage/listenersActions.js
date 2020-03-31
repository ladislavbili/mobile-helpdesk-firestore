import { ADD_LISTENER, REMOVE_LISTENERS } from '../../types';

export const addListener = (listener) => {
  return (dispatch) => {
    dispatch({ type: ADD_LISTENER, listener });
  }
};

export const removeListeners = () => {
  return (dispatch) => {
    dispatch({ type: REMOVE_LISTENERS });
  }
};
