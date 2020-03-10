import { EDIT_COMPANY_LIST, SET_LOADING_COMPANIES, SET_COMPANIES, ADD_COMPANY, SET_LOADING_COMPANY, SET_COMPANY, EDIT_COMPANY,
  SET_COMPANY_ATTRIBUTES_LOADING,SET_COMPANY_ATTRIBUTES } from '../types';
import { COMPANIES_LIST, COMPANY_ATTRIBUTES_LIST } from '../urls';
import {processRESTinput, processError} from '../../helperFunctions';
//All of these are actions, they return redux triggered functions, that have no return, just manipulate with the store


/**
 * Sets status if companies are loaded to false
 */
export const setCompaniesLoading = (companiesLoaded) => {
  return (dispatch) => {
    dispatch({ type: SET_LOADING_COMPANIES, companiesLoaded });
  }
};


/**
 * Gets all companies available with no pagination
 * @param {string} token universal token for API comunication
 */
 export const getCompanies= (updateDate,token) => {
   return (dispatch) => {
     fetch(COMPANIES_LIST+'/all'+(updateDate?'/'+updateDate:''), {
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
         dispatch({type: SET_COMPANIES, companies:data.data,updateDate:data.date.toString()});
         dispatch({ type: SET_LOADING_COMPANIES, companiesLoaded:true });
       });
     }
   ).catch(function (error) {
     console.log(error);
   });
 }
 }

 /**
  * Adds new company
  * @param {object} body  All parameters in an object of the new company
  * @param {string} token universal token for API comunication
  */
 export const addCompany = (body,token) => {
   return (dispatch) => {
       fetch(COMPANIES_LIST,{
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
       dispatch({type: ADD_COMPANY, company:response.data});
     })})
     .catch(function (error) {
       console.log(error);
     });

   };
 };

 /**
  * Starts an indicator that the companies are loading
  */
 export const setCompanyLoading = (companyLoaded) => {
   return (dispatch) => {
     dispatch({type: SET_LOADING_COMPANY, companyLoaded });
   };
 };

 /**
  * Gets one company that was selected
  * @param  {string} token universal token for API comunication
  * @param  {int} id    interger, that is ID of the company that we want to load
  */
 export const getCompany = (id,token) => {
   return (dispatch) => {
       fetch(COMPANIES_LIST+'/'+id, {
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
         dispatch({type: SET_COMPANY, company:data.data});
       });
     }
   ).catch(function (error) {
       console.log(error);
   });
 }
 }

 /**
  * Edits selected company
  * @param  {object}  body     data about company except for isActive
  * @param  {Boolean} isActive is active company parameter
  * @param  {int}  id       id of the company
  * @param  {string}  token    universal token for API comunication
  */
  export const editCompany = (body,isActive,id,token) => {
    return (dispatch) => {
        Promise.all([
          fetch(COMPANIES_LIST+'/'+id, {
            method: 'put',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body:JSON.stringify(body)
          }),
          fetch(COMPANIES_LIST+'/'+id+(isActive?'/restore':'/inactivate'), {
            method: 'put',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          })]).then(([response1,response2])=>{
            if(!response1.ok){
              processError(response1,dispatch);
              return;
            }
            if(!response2.ok){
              processError(response2,dispatch);
              return;
            }
            Promise.all([response1.json(),response2.json()]).then(([response1,response2])=>{
            dispatch({type: EDIT_COMPANY, company:{...response1.data, is_active:isActive}});
          })})
          .catch(function (error) {
       console.log(error);
        });

    };
  };

  export const setCompanyAttributesLoading = (companyAttributeLoaded) => {
    return (dispatch) => {
      dispatch({ type: SET_COMPANY_ATTRIBUTES_LOADING, companyAttributeLoaded });
    }
  };

  export const getCompanyAttributes= (token) => {
    return (dispatch) => {
        fetch(COMPANY_ATTRIBUTES_LIST+'?limit=999&isActive=true', {
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
          dispatch({type: SET_COMPANY_ATTRIBUTES, companyAttributes:data.data});
        });
      }
    ).catch(function (error) {
      console.log(error);
    });
  }
  }
