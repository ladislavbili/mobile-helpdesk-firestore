import {STORAGE_SET_METADATA, STORAGE_METADATA_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageMetadataStart = () => {
  return (dispatch) => {

    let listener = database.collection('metadata').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_METADATA,metadata:snapshotToArray(querySnapshot)[0]});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_METADATA_ACTIVE });
  };
};
