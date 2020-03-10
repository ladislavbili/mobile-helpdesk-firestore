import { SET_TASKS, SET_LOADING_TASKS,ADD_TASKS,SET_OPENED_ID, SET_TASK_STATUSES_LOADING,SET_TASK_STATUSES,SET_TASK_PROJECTS_LOADING,SET_TASK_PROJECTS,
  SET_TASK_COMPANIES_LOADING,SET_TASK_COMPANIES,SET_TASK_UNITS_LOADING,SET_TASK_UNITS,SET_TASK_TAGS_LOADING,SET_TASK_TAGS,SET_TASK_SOLVERS,SET_TASK_LOADING,
  SET_TASK,EDIT_TASK, SET_TASK_ATTRIBUTES_LOADING,SET_TASK_ATTRIBUTES, ADD_ATTACHMENT, SET_GENERAL_ORDER } from '../types';
import { PROJECTS_LIST, COMPANIES_LIST, STATUSES_LIST,FILTER_LIST, TASKS_LIST, HOST_URL , UNITS_LIST, TAGS_LIST, PROJECT_URL, TASK_ATTRIBUTES_LIST, GET_LOC,GET_FILE} from '../urls';
import {processRESTinput, processError} from '../../helperFunctions';
import {clearAttachments} from './attachmentActions';
import {addSubtask} from './subtaskActions';
import {addItem} from './itemActions';
//All of these are actions, they return redux triggered functions, that have no return, just manipulate with the store

/**
 * Set's user loading to true
 */
export const setTasksLoading = (tasksLoaded) => {
  return (dispatch) => {
    dispatch({type: SET_LOADING_TASKS,tasksLoaded });
  };
};

/**
 * Gets all tasks that corresponds to the set filter
 * @param  {string} token    Token for the REST API
 * @param  {string} listName name that should be displayed above recieved list
 * @param  {Object} filter   Object containing all of the filters
 */
export const getTasks = (filter,token) => {
  return (dispatch) => {
    fetch(TASKS_LIST+'?'+processRESTinput(filter)+'&order=status=>asc,title=>asc', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) =>{
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
      response.json().then((data) => {
        dispatch({type: SET_TASKS, tasks:data.data,nextTasks:data._links.next?data._links.next+'&order=status=>asc,title=>asc':false});
      });
    }
  ).catch(function (error) {
    console.log(error);
  });
};
}

/**
  * Get's and adds more tasks to the task list
  * @param  {string} url   url used to get more tasks
  * @param  {string} token Token for the REST API
*/

export const getMoreTasks = (url,token) => {
  return (dispatch) => {
    fetch(HOST_URL+url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) =>{
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
      response.json().then((data) => {
        dispatch({type: ADD_TASKS, tasks:data.data,nextTasks:data._links.next?data._links.next+'&order=status=>asc,title=>asc':false,url});
      });
    }
  ).catch(function (error) {
    console.log(error);
  });
};
}

/**
 * Gets all tasks available with no pagination
 * @param {string} token universal token for API comunication
 */
 export const getFilterTasks= (id,projectID,token) => {
   return (dispatch) => {
       fetch(FILTER_LIST+'/'+id, {
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
         let filter = {...data.data.filter};
         if(projectID!=='all'){
           filter.project=[projectID];
         }else{
           filter.project=undefined;
         }
         getTasks(filter,token)(dispatch);
       });
     }
   ).catch(function (error) {
     console.log(error);
   });
 }
 }
 export const setGeneralOrder = (generalOrder) => {
   return (dispatch) => {
     dispatch({type: SET_GENERAL_ORDER,generalOrder });
   };
 };


 export const setOpenedID = (openedID) => {
   return (dispatch) => {
     dispatch({type: SET_OPENED_ID,openedID });
   };
 };


 export const setTaskStatusesLoading = (taskStatusesLoaded) => {
   return (dispatch) => {
     dispatch({ type: SET_TASK_STATUSES_LOADING, taskStatusesLoaded });
   }
 };
 /**
  * Gets all statuses available with no pagination
  * @param {string} token universal token for API comunication
  */
 export const getTaskStatuses= (updateDate,token) => {
   return (dispatch) => {
       fetch(STATUSES_LIST+'/all'+(updateDate?'/'+updateDate:''), {
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
         dispatch({type: SET_TASK_STATUSES, statuses:data.data,statusesUpdateDate:data.date.toString()});
       });
     }
   ).catch(function (error) {
       console.log(error);
   });
 }
 }

 export const setTaskProjectsLoading = (taskProjectsLoaded) => {
   return (dispatch) => {
     dispatch({ type: SET_TASK_PROJECTS_LOADING, taskProjectsLoaded });
   }
 };
 export const getTaskProjects= (token) => {
   return (dispatch) => {
       fetch(PROJECTS_LIST+'/create-tasks', {
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
         dispatch({type: SET_TASK_PROJECTS, projects:data.data});
       });
     }
   ).catch(function (error) {
     console.log(error);
   });
 }
 }

 export const setTaskCompaniesLoading = (taskCompaniesLoaded) => {
   return (dispatch) => {
     dispatch({ type: SET_TASK_COMPANIES_LOADING, taskCompaniesLoaded });
   }
 };
 /**
  * Gets all companies available with no pagination
  * @param {string} token universal token for API comunication
  */
  export const getTaskCompanies = (updateDate,token) => {
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
          dispatch({type: SET_TASK_COMPANIES, companies:data.data,companiesUpdateDate:data.date.toString()});
        });
      }
    ).catch(function (error) {
      console.log(error);
    });
  }
  }

 export const setTaskUnitsLoading = (taskUnitsLoaded) => {
   return (dispatch) => {
     dispatch({ type: SET_TASK_UNITS_LOADING, taskUnitsLoaded });
   }
 };
 /**
  * Gets all units available with no pagination
  * @param {string} token universal token for API comunication
  */
 export const getTaskUnits= (token) => {
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
         dispatch({type: SET_TASK_UNITS, units:data.data});
       });
     }
   ).catch(function (error) {
     console.log(error);
   });
 }
 }

 export const setTaskTagsLoading = (taskTagsLoaded) => {
   return (dispatch) => {
     dispatch({ type: SET_TASK_TAGS_LOADING, taskTagsLoaded });
   }
 };
 /**
  * Gets all tags available with no pagination
  * @param {string} token universal token for API comunication
  */
 export const getTaskTags= (token) => {
   return (dispatch) => {
       fetch(TAGS_LIST+'/all', {
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
         dispatch({type: SET_TASK_TAGS, tags:data.data});
       });
     }
   ).catch(function (error) {
     console.log(error);
   });
 }
 }

 export const deleteTaskSolvers = () => {
   return (dispatch) => {
     dispatch({type: SET_TASK_SOLVERS, taskSolvers:[]});
   };
 };

export const getTaskSolvers = (projectID,token) => {
  return (dispatch) => {
      fetch(PROJECT_URL+'/'+projectID+'/assign-user', {
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
        dispatch({type: SET_TASK_SOLVERS, taskSolvers:data.data});
      });
    }
  ).catch(function (error) {
    console.log(error);
  });
}
}

export const addTask = (body,followers,projectID,statusID,requesterID,companyID,items,subtasks,token) => {
  return (dispatch) => {
    fetch(TASKS_LIST+'/project/'+projectID+'/status/'+statusID+'/requester/'+requesterID+'/company/'+companyID,{
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
        followers.map((follower)=>{
          addFollower(follower.id,response.data.id,token)(dispatch);
        });
        items.map((item)=>{
          addItem({title:item.title,amount:item.amount,unit_price:item.unit_price},response.data.id,item.unit.id,token)(dispatch);
        });
        subtasks.map((subtask)=>{
          addSubtask({title:subtask.title,from:subtask.from, to:subtask.to, hours:subtask.hours},response.data.id,token)(dispatch);
        });

      })})
      .catch(function (error) {
        console.log(error);
      });
    };
  };

  export const addFollower = (userID,taskID,token) => {
    return (dispatch) => {
        fetch(TASKS_LIST+'/'+taskID+'/add-follower/'+userID,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          method: 'PUT',
        })
      .then((response)=>{
        if(!response.ok){
          processError(response,dispatch);
          return;
        }
      response.json().then((response)=>{
        return;
        //dispatch({type: ADD_FOLLOWER, follower:response.data});
      })})
      .catch(function (error) {
        console.log(error);
      });
    };
  };

  export const deleteFollower = (userID,taskID,token) => {
    return (dispatch) => {
      fetch(TASKS_LIST+'/'+taskID+'/remove-follower/'+userID,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        method: 'PUT',
      })
    .then((response)=>{
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
    })
    .catch(function (error) {
        console.log(error);
    });

    }
  };

export const setTaskLoading = (taskLoaded) => {
  return (dispatch) => {
    dispatch({ type: SET_TASK_LOADING, taskLoaded });
  }
};

/**
 * Gets one task that was selected
 * @param  {string} token universal token for API comunication
 * @param  {int} id    interger, that is ID of the task that we want to load
 */
export const getTask = (id,token) => {
  return (dispatch) => {
    clearAttachments()(dispatch);
      fetch(TASKS_LIST+'/'+id, {
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
        dispatch({type: SET_TASK, task:data.data});
        //nacitavanie attachementov
        data.data.taskHasAttachments.map((attachment)=>{
          fetch(GET_LOC+attachment.slug+'/download-location', {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }).then((response2)=>
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
              dispatch({type: ADD_ATTACHMENT, attachment:{url:response3.url,id:attachment.slug,file:{name:attachment.name,size:response3._bodyBlob._data.size}}});
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(function (error) {
            console.log(error);
          })
        ).catch(function (error) {
          console.log(error);
        })
      });
        //koniec nacitavania
      });
    }
  ).catch(function (error) {
    console.log(error);
  });
}
}

export const editTask = (data,taskID,projectID,statusID,requesterID,companyID,token) => {
  return (dispatch) => {
    if(!taskID||!projectID||!statusID){
      return;
    }
    fetch(TASKS_LIST+'/'+taskID+'/project/'+projectID+'/status/'+statusID+'/requester/'+requesterID+'/company/'+companyID, {
      method: 'put',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    }).then((response)=>{
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
      response.json().then((data)=>{
      dispatch({ type: EDIT_TASK, task:data.data });
    })}).catch(function (error) {
      console.log(error);
    });
  };
};

export const setTaskAttributesLoading = (taskAttributesLoaded) => {
  return (dispatch) => {
    dispatch({ type: SET_TASK_ATTRIBUTES_LOADING, taskAttributesLoaded });
  }
};

/**
 * Gets all active taskAttributes available with no pagination
 * @param {string} token universal token for API comunication
 */
 export const getTaskAttributes= (token) => {
   return (dispatch) => {
       fetch(TASK_ATTRIBUTES_LIST+'?limit=999&isActive=true', {
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
         dispatch({type: SET_TASK_ATTRIBUTES, taskAttributes:data.data});
       });
     }
   ).catch(function (error) {
     console.log(error);
   });
 }
 }
