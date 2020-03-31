import {STORAGE_SET_HELP_TASK_TYPES, STORAGE_HELP_TASK_TYPES_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpTaskTypesStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-task_types').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TASK_TYPES,taskTypes:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_TASK_TYPES_ACTIVE });
  };
};
