import {LOGIN_START,LOGIN_FAIL,TOKEN_CHECKED,LOGIN_SUCCESS,LOGIN_LOGOUT } from '../types';
import {LOGIN_URL, USERS_LIST } from '../urls';
import {processError} from '../../helperFunctions';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import i18n from 'i18next';
//All of these are actions, they return redux triggered functions, that have no return, just manipulate with the store

/**
 * Tries to log in user using his username and password
 * @param  {string} username User's username
 * @param  {string} password User's password
 */

 export const loginUser = (username, password) => {
    return (dispatch) => {
      dispatch({ type: LOGIN_START });
      fetch(LOGIN_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username,password})
      }).then((JSONresponse) => {
        JSONresponse.json().then((response)=>{
          if(JSONresponse.ok){
            if(jwt_decode(response.token).userRoleAcl===null||!jwt_decode(response.token).userRoleAcl.includes('login_to_system')){
              dispatch({ type: LOGIN_FAIL, error:'This user is not allowed to log in' });
              return;
            }
            AsyncStorage.setItem('lansystems',response.token).then(()=>{
              checkToken()(dispatch);
            })
            return;
          }
          dispatch({ type: LOGIN_FAIL, error:JSONresponse.statusText?JSONresponse.statusText:'User or password is incorrect' });
        });
      })
      .catch(function (error) {
        console.log(error);
        dispatch({ type: LOGIN_FAIL });
      });
    };
  };

  export const checkToken = () => {
     return (dispatch) => {
       //dispatch({ type: TOKEN_CHECKED });
       AsyncStorage.getItem('lansystems').then((token)=>{
       if(token){
         fetch(USERS_LIST+'/'+jwt_decode(token).id, {
           method: 'GET',
           headers: {
             'Authorization': 'Bearer ' + token
           }
         }).then((response)=>{
           if(!response.ok){
             dispatch({ type: TOKEN_CHECKED });
             removeTokenFromAsyncStorage();
             return;
           }
           response.json().then((data) => {
             if(data.data.user_role.acl===null||!data.data.user_role.acl.includes('login_to_system')){
               dispatch({ type: TOKEN_CHECKED });
               removeTokenFromAsyncStorage();
               return;
             }
             let user=data.data;
             i18n.changeLanguage(user.language);
             dispatch({
               type: LOGIN_SUCCESS,token,user
             });
             dispatch({ type: TOKEN_CHECKED });
           });
         }).catch(function (error) {
           dispatch({ type: TOKEN_CHECKED });
           localStorage.removeItem("lansystems");
           console.log(error);
         });
       }
       else{
         dispatch({ type: TOKEN_CHECKED });
       }
     })

     };
   };

/**
 * Log's out user and returns user to the login page
 */
 export const logoutUser = () => {
   return (dispatch) => {
     dispatch({ type: LOGIN_LOGOUT });
     removeTokenFromAsyncStorage();
   }
 };

/**
 * Store the token into device's async storage
 * @param  {string} token Token to be saved
 */
export const storeTokenToAsyncStorage = (token) =>
  AsyncStorage.setItem('lansystems',token);

  /**
   * Store the token into device's async storage
   * @param  {string} token Token to be saved
   */
export const removeTokenFromAsyncStorage = () =>
  AsyncStorage.multiRemove(['lansystems']);
