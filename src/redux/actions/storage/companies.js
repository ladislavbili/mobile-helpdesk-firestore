import {STORAGE_SET_COMPANIES, STORAGE_COMPANIES_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageCompaniesStart = () => {
  return (dispatch) => {

    let listener = database.collection('companies').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_COMPANIES,companies:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_COMPANIES_ACTIVE });
  };
};
