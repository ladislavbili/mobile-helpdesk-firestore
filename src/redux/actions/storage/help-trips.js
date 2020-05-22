import {STORAGE_SET_HELP_TRIPS, STORAGE_HELP_TRIPS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpTripsStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-trips').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TRIPS,trips:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_TRIPS_ACTIVE });
  };
};
