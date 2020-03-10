import { SET_USERS,
  SET_LOADING_USERS,
  SET_USER_ROLES,
  SET_LOADING_USER_ROLES,
  SET_USER_EMAIL_ERROR,
  ADD_USER,
  SET_LOADING_USER,
  SET_USER,
  EDIT_USER,
  SET_USER_ATTRIBUTES, EDIT_USER_LIST, START_LOADING_USER, SET_ASSIGNERS } from '../types';

import { IMAGE_UPLOAD, COMPANIES_LIST,USER_ROLES_LIST, USERS_LIST, ASSIGNERS_LIST,GET_LOC ,GET_FILE } from '../urls';
import {processRESTinput,processDataWithPrefix, processError} from '../../helperFunctions';
import queryString from 'query-string';
import i18n from 'i18next';

//All of these are actions, they return redux triggered functions, that have no return, just manipulate with the store

/**
 * Set's user loading to true
 */
export const setUsersLoading = (usersLoaded) => {
  return (dispatch) => {
    dispatch({type: SET_LOADING_USERS,usersLoaded });
  };
};

/**
* Get's all of the visible users
* @param  {[type]} token Token for the REST API
*/
export const getUsers= (updateDate,token) => {
  return (dispatch) => {
    fetch(USERS_LIST+'/all'+(updateDate?'/'+updateDate:''), {
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
        dispatch({type: SET_USERS, users:data.data,updateDate:data.date.toString()});
      });
    }
  ).catch(function (error) {
    console.log(error);
  });
}
}

/**
* Get's all of the visible users
* @param  {[type]} token Token for the REST API
*/
export const getAllUsers= (token) => {
  return (dispatch) => {
    fetch(USERS_LIST+'?limit=999', {
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
        dispatch({type: SET_USERS, users:data.data,updateDate:null});
      });
    }
  ).catch(function (error) {
    console.log(error);
  });
}
}

/**
 * Set's user loading to true
 */
export const setUserRolesLoading = (userRolesLoaded) => {
  return (dispatch) => {
    dispatch({type: SET_LOADING_USER_ROLES,userRolesLoaded });
  };
};

/**
* Gets all userRoles available with no pagination
* @param {string} token universal token for API comunication
*/
export const getUserRoles= (token) => {
  return (dispatch) => {
    fetch(USER_ROLES_LIST+'?limit=999', {
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
        dispatch({type: SET_USER_ROLES, userRoles:data.data});
        dispatch({ type: SET_LOADING_USER_ROLES, userRolesLoaded:true });
      });
    }
  ).catch(function (error) {
      console.log(error);
  });
}
}

/**
* Adds new user
* @param {object} body  All parameters in an object of the new user
* @param {string} token universal token for API comunication
*/
export const addUser = (body,company,role,image,token) => {
  return (dispatch) => {
    if(image!==null){
      let formData = new FormData();
      formData.append("file", image);
      fetch(IMAGE_UPLOAD,{
        headers: {
          'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body:formData,
      })
      .then((response)=>{
        if(!response.ok){
          processError(response, dispatch);
          return;
        }
        response.json().then((response)=>{
          body['image']=response.data.slug;
          fetch(USERS_LIST + '/user-role/' + role + '/company/' + company,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            method: 'POST',
            body:JSON.stringify(body),
          }).then((response)=>{
            if(!response.ok){
              if(response.status===409){
                dispatch({type: SET_USER_EMAIL_ERROR, nameError:true});
              }
              else{
                processError(response,dispatch);
              }
              return;
            }
            response.json().then((response)=>{
              dispatch({type: ADD_USER, user:response.data});
            })})
            .catch(function (error) {
              console.log(error);
            });

          })})
          .catch(function (error) {
            console.log(error);
          });
        }
        else{
          fetch(USERS_LIST + '/user-role/' + role + '/company/' + company,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            method: 'POST',
            body:JSON.stringify(body),
          }).then((response)=>{
            if(!response.ok){
              if(response.status===409){
                dispatch({type: SET_USER_EMAIL_ERROR, nameError:true});
              }
              else{
                processError(response,dispatch);
              }
              return;
            }
            response.json().then((response)=>{
              dispatch({type: ADD_USER, user:response.data});
            })})
            .catch(function (error) {
              console.log(error);
            });
          }
        };
      };

/**
 * Set's user loading to true
 */
export const setUserLoading = (userLoaded) => {
  return (dispatch) => {
    dispatch({type: SET_LOADING_USER,userLoaded });
  };
};


/**
* Gets one user that was selected
* @param  {string} token universal token for API comunication
* @param  {int} id    interger, that is ID of the user that we want to load
*/
export const getUser = (id,token) => {
  return (dispatch) => {
    fetch(USERS_LIST+'/'+id, {
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
        if(data.data.image){
          fetch(GET_LOC+data.data.image+'/download-location', {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }).then((response2)=>{
            if(!response2.ok){
              return;
            }
            response2.json().then((data2)=>{
            fetch(GET_FILE+data2.data.fileDir+'/'+data2.data.fileName, {
              method: 'get',
              headers: {
                'Authorization': 'Bearer ' + token,
              }
            }).then((response3) =>{
              if(!response3.ok){
                processError(response3,dispatch);
                return;
              }
              let user = {...data.data};
              user['image']=response3.url;
              dispatch({type: SET_USER, user});
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(function (error) {
            console.log(error);
          });}
        ).catch(function (error) {
          console.log(error);
        });
      }
      else{
        dispatch({type: SET_USER, user:data.data});
      }
    });
  }
).catch(function (error) {
  console.log(error);
});
}
}

/**
* Edits selected user
* @param  {object}  body     data about user except for isActive
* @param  {Boolean} isActive is active user parameter
* @param  {int}  id       id of the user
* @param  {string}  token    universal token for API comunication
*/

export const editUser = (body,company,role,id,isActive,image,changeLanguage,token) => {
  return (dispatch) => {
    if(changeLanguage){
      i18n.changeLanguage(body.language);
    }
    if(image===null){
      Promise.all([
        fetch(USERS_LIST + '/'+id+'/user-role/' + role + '/company/' + company, {
          method: 'put',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(body)
        }),
        fetch(USERS_LIST+'/'+id+(isActive?'/restore':'/inactivate'), {
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
          dispatch({type: EDIT_USER, user:{...response1.data,is_active:isActive, name:response1.data.detailData.name,surname:response1.data.detailData.surname}});
        })})
        .catch(function (error) {
          console.log(error);
        });
      }
      else{
        let formData = new FormData();
        formData.append("file", image);
        fetch(IMAGE_UPLOAD,{
          headers: {
            'Authorization': 'Bearer ' + token
          },
          method: 'POST',
          body:formData,
        })
        .then((response)=>{
          if(!response.ok){
            processError(response,dispatch);
            return;
          }
          response.json().then((response)=>{
            body['image']=response.data.slug;

            Promise.all([
              fetch(USERS_LIST + '/'+id+'/user-role/' + role + '/company/' + company, {
                method: 'put',
                headers: {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify(body)
              }),
              fetch(USERS_LIST+'/'+id+(isActive?'/restore':'/inactivate'), {
                method: 'put',
                headers: {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json'
                }
              })]).then(([response1,response2])=>{
                if(!response2.ok){
                  processError(response2,dispatch);
                  return;
                }
                if(!response1.ok){
                  processError(response1,dispatch);
                  return;
                }
                Promise.all([response1.json(),response2.json()]).then(([response1,response2])=>{
                dispatch({type: EDIT_USER, user:{...response1.data,is_active:isActive}});
              })})
              .catch(function (error) {
                console.log(error);
              });

            })
            .catch(function (error) {
              console.log(error);
            });
          })
          .catch(function (error) {
              console.log(error);
          });

        }

      };
    };


/**
 * Get's all available users that can solve this project
 * @param  {string} token     Token for the REST API
 * @param  {int} projectID ID of the project
 */
export const getAssigners = (token,projectID) => {
  return (dispatch) => {
    fetch(ASSIGNERS_LIST+'/'+projectID, {
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + token
      }
    }).then((response)=> {
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
      response.json().then(response => {
      dispatch({type: SET_ASSIGNERS, payload:{assigners:response.assigner}});
    })})
    .catch(function (error) {
      console.log(error);
    });
  };
};


/**
 * Get's all attributes needed for the user adding
 * @param  {string} token Token for the REST API
 */
 export const getUserAttributes = (token) => {
  return (dispatch) => {
    Promise.all([
      fetch(COMPANIES_LIST+'?limit=999', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
      }),
      fetch(ROLES_LIST+'?limit=999', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
      })
    ]).then(([response1,response2])=>{
    if(!response1.ok){
      processError(response1,dispatch);
      return;
    }
    if(!response2.ok){
      processError(response2,dispatch);
      return;
    }
    Promise.all([response1.json(),response2.json()]).then(([response1,response2])=>{
      dispatch({type: SET_USER_ATTRIBUTES, payload:{companies:response1.data,user_roles:response2.data,user:null}});
    })})
    .catch(function (error) {
      console.log(error);
    });
  };
};
