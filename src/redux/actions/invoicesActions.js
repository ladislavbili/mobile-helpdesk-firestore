import { SET_INVOICE_WORKS, SET_INVOICE_TRIPS, SET_INVOICE_MATERIALS, SET_INVOICE_CUSTOM, CLEAR_INVOICES } from '../types';


export const setInvoiceWorks = (works) => {
  return (dispatch) => {
    dispatch({ type: SET_INVOICE_WORKS, works });
  };
};

export const setInvoiceTrips = (trips) => {
  return (dispatch) => {
    dispatch({ type: SET_INVOICE_TRIPS, trips });
  };
};

export const setInvoiceMaterials = (materials) => {
  return (dispatch) => {
    dispatch({ type: SET_INVOICE_MATERIALS, materials });
  };
};

export const setInvoiceCustomItems = (customItems) => {
  return (dispatch) => {
    dispatch({ type: SET_INVOICE_CUSTOM, customItems });
  };
};

export const clearInvoices = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_INVOICES });
  };
};
