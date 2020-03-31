import {STORAGE_SET_HELP_STATUSES, STORAGE_HELP_STATUSES_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


export const storageHelpStatusesStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-statuses').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_STATUSES,statuses:snapshotToArray(querySnapshot).sort((item1,item2)=>item1.order>item2.order?1:-1)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_STATUSES_ACTIVE });
  };
};
