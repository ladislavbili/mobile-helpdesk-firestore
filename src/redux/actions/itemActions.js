import { SET_ITEMS,SET_ITEMS_LOADING, ADD_ITEM, EDIT_ITEM,DELETE_ITEM, SET_UNITS_LOADING, SET_UNITS } from '../types';
import { TASKS_LIST, UNITS_LIST } from '../urls';
import {processError} from '../../helperFunctions';

/**
 * Sets status if items are loaded to false
 */
export const setItemsLoading = (itemsLoaded) => {
  return (dispatch) => {
    dispatch({ type: SET_ITEMS_LOADING, itemsLoaded });
  }
};

export const clearItems= () => {
  return (dispatch) => {
        dispatch({type: SET_ITEMS, items:[]});
  }
}

/**
 * Gets all items available with no pagination
 * @param {string} token universal token for API comunication
 */
export const getItems= (taskID,token) => {
  return (dispatch) => {
      fetch(TASKS_LIST+'/'+taskID+'/invoiceable-items', {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }).then((response) =>{
        if(!response.ok){
          processError(response,dispatch);
          return;
        }
      response.json().then((data) => {
        dispatch({type: SET_ITEMS, items:data.data});
      });
    }
  ).catch(function (error) {
      console.log(error);
  });
  }
}
/**
 * Adds new item
 * @param {object} body  All parameters in an object of the new item
 * @param {string} token universal token for API comunication
 */

export const addItem = (body,taskID,unitID,token) => {
  return (dispatch) => {
      fetch(TASKS_LIST+'/'+taskID+'/invoiceable-items/unit/'+unitID,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body:JSON.stringify(body),
      })
    .then((response)=>{
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
    response.json().then((response)=>{
      dispatch({type: ADD_ITEM, item:response.data});
    })})
    .catch(function (error) {
      console.log(error);
    });

  };
};

export const addFakeItem = (body) => {
  return (dispatch) => {
    dispatch({type: ADD_ITEM, item:body});
  };
};

export const editItem = (body,itemID,unitID,taskID,token) => {
  return (dispatch) => {
        fetch(TASKS_LIST+'/'+taskID+'/invoiceable-items/'+itemID+'/unit/'+unitID, {
          method: 'put',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(body)
        }).then((response)=>{
          if(!response.ok){
            processError(response,dispatch);
            return;
          }
          response.json().then((response)=>{
          dispatch({type: EDIT_ITEM, item:response.data});
        })})
        .catch(function (error) {
          console.log(error);
      });
  };
};

export const editFakeItem = (body) => {
  return (dispatch) => {
    dispatch({type: EDIT_ITEM, item:body});
  };
};

export const deleteItem = (id,taskID,token) => {
  return (dispatch) => {
      fetch(TASKS_LIST+'/'+taskID+'/invoiceable-items/'+id, {
        method: 'delete',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }).then((response) =>{
        if(!response.ok){
          processError(response,dispatch);
          return;
        }
        dispatch({type: DELETE_ITEM, id});
    }
  ).catch(function (error) {
      console.log(error);
  });
}
}

export const deleteFakeItem = (id) => {
  return (dispatch) => {
        dispatch({type: DELETE_ITEM, id});
  }
}

/**
 * Sets status if items are loaded to false
 */
export const setUnitsLoading = (unitsLoaded) => {
  return (dispatch) => {
    dispatch({ type: SET_UNITS_LOADING, unitsLoaded });
  }
};

/**
 * Gets all units available with no pagination
 * @param {string} token universal token for API comunication
 */
export const getUnits= (token) => {
  return (dispatch) => {
      fetch(UNITS_LIST+'/all', {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }).then((response) =>{
        if(!response.ok){
          processError(response,dispatch);
          return;
        }
      response.json().then((data) => {
        dispatch({type: SET_UNITS, units:data.data});
      });
    }
  ).catch(function (error) {
    console.log(error);
  });
}
}
