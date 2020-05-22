import {STORAGE_SET_HELP_UNITS, STORAGE_HELP_UNITS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpUnitsStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-units').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_UNITS,units:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_UNITS_ACTIVE });
  };
};
