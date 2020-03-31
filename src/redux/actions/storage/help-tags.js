import {STORAGE_SET_HELP_TAGS, STORAGE_HELP_TAGS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpTagsStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-tags').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TAGS,tags:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_TAGS_ACTIVE });
  };
};
