import {STORAGE_SET_HELP_TRIP_TYPES, STORAGE_HELP_TRIP_TYPES_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpTripTypesStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-trip_types').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TRIP_TYPES,tripTypes:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_TRIP_TYPES_ACTIVE });
  };
};
