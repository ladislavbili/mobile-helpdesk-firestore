import {SET_SIDEBAR_LOADING,SET_SIDEBAR } from '../types';
import {SIDEBAR_DATA } from '../urls';
import {processError} from '../../helperFunctions';

/**
 * Log's out user and returns user to the login page
 */
 export const setSidebarLoading = (sidebarLoaded) => {
   return (dispatch) => {
     dispatch({ type: SET_SIDEBAR_LOADING, sidebarLoaded });
   }
 };

 /**
  * Gets all sidebar data available with no pagination
  * @param {string} token universal token for API comunication
  */
 export const getSidebar = (token) => {
   return dispatch => {
     fetch(SIDEBAR_DATA, {
       method: "get",
       headers: {
         Authorization: "Bearer " + token,
         "Content-Type": "application/json"
         }
       })
       .then(response => {
         if(!response.ok){
           processError(response,dispatch);
           return;
         }
         response.json().then(data => {
           dispatch({ type: SET_SIDEBAR, sidebar: {filters:data.filters,projects:data.projects,archived:data.archived} });
         });
       })
       .catch(function(error) {
         console.log(error);
       });
   };
 };
