import {STORAGE_SET_HELP_PRICELISTS, STORAGE_HELP_PRICELISTS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpPricelistsStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-pricelists').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_PRICELISTS, pricelists:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_PRICELISTS_ACTIVE });
  };
};
