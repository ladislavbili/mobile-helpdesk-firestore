import {STORAGE_SET_HELP_MILESTONES, STORAGE_HELP_MILESTONES_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpMilestonesStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-milestones').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_MILESTONES,milestones:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_MILESTONES_ACTIVE });
  };
};
