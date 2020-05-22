import { SET_INVOICE_WORKS, SET_INVOICE_TRIPS, SET_INVOICE_MATERIALS, SET_INVOICE_CUSTOM, CLEAR_INVOICES, DELETE_USER_DATA } from '../types';

const initialState = {
  works: [],
  worksLoaded:false,

  trips: [],
  tripsLoaded:false,

  materials: [],
  materialsLoaded:false,

  customItems: [],
  customItemsLoaded:false,
};

export default function storageInvoicesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INVOICE_WORKS:{
      return {
        ...state,
        works: action.works,
        worksLoaded: true,
      };
    }
    case SET_INVOICE_TRIPS:{
      return {
        ...state,
        trips: action.trips,
        tripsLoaded: true,
      };
    }
    case SET_INVOICE_MATERIALS:{
      return {
        ...state,
        materials: action.materials,
        materialsLoaded: true,
      };
    }
    case SET_INVOICE_CUSTOM:{
      return {
        ...state,
        customItems: action.customItems,
        customItemsLoaded: true,
      };
    }
    case CLEAR_INVOICES:{
      return initialState;
    }
    case DELETE_USER_DATA:
      return initialState;
    default:
      return state;
  }
}
