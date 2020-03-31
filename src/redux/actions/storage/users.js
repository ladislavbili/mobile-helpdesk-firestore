import {STORAGE_USERS, STORAGE_USERS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageUsersStart = () => {
  return (dispatch) => {

    let listener = database.collection('users').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_USERS,users:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_USERS_ACTIVE });
  };
};
