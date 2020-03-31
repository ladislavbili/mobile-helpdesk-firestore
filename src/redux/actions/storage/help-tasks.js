import {STORAGE_SET_HELP_TASKS, STORAGE_HELP_TASKS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpTasksStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-tasks').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TASKS,tasks:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_TASKS_ACTIVE });
  };
};
