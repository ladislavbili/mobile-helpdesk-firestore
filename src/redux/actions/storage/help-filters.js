import {STORAGE_SET_HELP_FILTERS, STORAGE_HELP_FILTERS_ACTIVE, ADD_LISTENER } from '../../types';
import {snapshotToArray} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

function fixOldFilterDates(filters){
    return filters.map((filter)=>{
      return {
        ...filter,
        filter:{
          ...filter.filter,
          order: filter.order ? 0 : 0,
          pendingDateFrom: (filter.filter.pendingDateFrom==='' || filter.filter.pendingDateFrom===undefined) ? null : filter.filter.pendingDateFrom,
          pendingDateTo: (filter.filter.pendingDateTo==='' || filter.filter.pendingDateTo===undefined) ? null : filter.filter.pendingDateTo,
          closeDateFrom: (filter.filter.closeDateFrom==='' || filter.filter.closeDateFrom===undefined) ? null : filter.filter.closeDateFrom,
          closeDateTo: (filter.filter.closeDateTo==='' || filter.filter.closeDateTo===undefined) ? null : filter.filter.closeDateTo,
          statusDateFrom: (filter.filter.statusDateFrom==='' || filter.filter.statusDateFrom===undefined) ? null : filter.filter.statusDateFrom,
          statusDateTo: (filter.filter.statusDateTo==='' || filter.filter.statusDateTo===undefined) ? null : filter.filter.statusDateTo,
        }
      }
    }).sort((filter1, filter2)=>{
      if(filter1.public && filter2.public){
        return filter1.order - filter2.order;
      }
      if(filter1.public && !filter2.public){
        return -1;
      }
      if(!filter1.public && !filter2.public){
        return (filter1.title < filter2.title ? -1 : 1);
      }
      return 0;
    })
}

export const storageHelpFiltersStart = () => {
  return (dispatch) => {

    let listener = database.collection('help-filters').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_FILTERS,filters:fixOldFilterDates(snapshotToArray(querySnapshot))});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: ADD_LISTENER, listener });
    dispatch({ type: STORAGE_HELP_FILTERS_ACTIVE });
  };
};
