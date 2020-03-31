import {STORAGE_SET_HELP_PROJECTS, STORAGE_HELP_PROJECTS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

export const storageHelpProjectsStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-projects').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_PROJECTS,projects:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_PROJECTS_ACTIVE });
  };
};
