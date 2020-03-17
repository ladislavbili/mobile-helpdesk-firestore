import { AUTOLOGIN_DONE, SET_USER_DATA, SET_USER_ID, SET_USER_STATUSES, LOGIN_LOGOUT } from '../types';
import firebase from 'react-native-firebase';


export const setAutologinDone = () => {
   return (dispatch) => {
     dispatch({ type: AUTOLOGIN_DONE });
   };
};

export const setUserData = (userData) => {
  return (dispatch) => {
    dispatch({ type: SET_USER_DATA, userData });
  };
};

export const setUserID = (id) => {
   return (dispatch) => {
     dispatch({ type: SET_USER_ID, id });
   };
};

export const setUserFilterStatuses = (statuses) => {
  return (dispatch) => {
    dispatch({ type: SET_USER_STATUSES, statuses });
  };
};

export const logout = () => {
  return (dispatch) => {
    firebase.auth().signOut();
    dispatch({ type: LOGIN_LOGOUT });
  };
};
