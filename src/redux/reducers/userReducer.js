import { SET_LOADING_USERS, SET_USERS, SET_LOADING_USER_ROLES, SET_USER_ROLES,SET_USER_EMAIL_ERROR,SET_USER,SET_LOADING_USER, EDIT_USER,
  SET_USER_ATTRIBUTES, EDIT_USER_LIST, ADD_USER,  SET_TASK_ATTRIBUTES, SET_SEARCH_ATTRIBUTES, START_LOADING_USER, SET_ASSIGNERS } from '../types';

const initialState = {
  users:[],
  usersLoaded:false,
  updateDate:null,
  pagination:null,
  userRoles:[],
  userRolesLoaded:false,
  nameError:null,
  userLoaded:false,
  user:null,
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_USERS:
    return {
      ...state,
      usersLoaded: action.usersLoaded,
    };
    case SET_USERS:{
      if(!state.updateDate){
        return { ...state, users:action.users, updateDate:action.updateDate, usersLoaded:true };
      }
      let newUsers=[...state.users];
      action.users.map((user)=>{
        let index= newUsers.findIndex((item)=>item.id===user.id);
        if(index!=-1){
          if(!user.is_active){
            newUsers.splice(index,1);
          }
          else{

            newUsers[index]=user;
          }
        }
        else{
          newUsers.push(user);
        }
      });
      return { ...state, users:newUsers, updateDate:action.updateDate, usersLoaded:true };
    }
    case SET_LOADING_USER_ROLES:
    return {
      ...state,
      userRolesLoaded: action.userRolesLoaded,
    };
    case SET_USER_ROLES:{
      return {
        ...state,
        userRoles:action.userRoles,
        nameError:null,
        userRolesLoaded:true
      };
    }
    case SET_USER_EMAIL_ERROR:{
      return { ...state, nameError:action.nameError };
    }
    case ADD_USER:{
      if(state.users.findIndex(item=>item.id===action.user.id)!==-1){
        return state;
      }
      else{
        return {
          ...state,
          users:[action.user,...state.users]
        };
      }
    }
    case SET_LOADING_USER:
    return {
      ...state,
      userLoaded: action.userLoaded,
    };

    case SET_USER:
      return { ...state, user:action.user,userLoaded:true };
    case EDIT_USER:{
      //finds location of the current user and replaces it with newer version
      let newUsers=[...state.users];
      if(action.user.is_active){
        newUsers[newUsers.findIndex((user)=>user.id==action.user.id)]=action.user;
      }
      else{
        newUsers.splice(newUsers.findIndex((user)=>user.id==action.user.id),1);
      }
      return { ...state, users:newUsers };
    }
    default:
    return state;
  }
}
