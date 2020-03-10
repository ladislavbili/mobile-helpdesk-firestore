import { SET_LOADING_TASKS,SET_TASKS,ADD_TASKS,SET_OPENED_ID,SET_TASK_STATUSES_LOADING, SET_TASK_STATUSES,
  SET_TASK_PROJECTS_LOADING, SET_TASK_PROJECTS, SET_TASK_COMPANIES_LOADING, SET_TASK_COMPANIES, SET_TASK_UNITS_LOADING,
  SET_TASK_UNITS, SET_TASK_TAGS_LOADING, SET_TASK_TAGS,SET_TASK_SOLVERS,SET_TASK_LOADING,SET_TASK,
  SET_TASK_ATTRIBUTES_LOADING,SET_TASK_ATTRIBUTES, EDIT_TASK,SET_GENERAL_ORDER,
  ADD_ATTACHMENT,LOGIN_LOGOUT,EDIT_ATTACHMENT,DELETE_ATTACHMENT,CLEAR_ATTACHMENTS} from '../types';

  const initialState = {
    tasks:[],
    nextTasks:false,
    tasksLoaded:false,
    openedID:JSON.stringify({projectID:'all',filterID:'none'}),
    statuses:[],
    statusesLoaded:false,
    statusesUpdateDate:null,
    projects:[],
    projectsLoaded:false,
    companies:[],
    companiesLoaded:false,
    companiesUpdateDate:null,
    units:[],
    unitsLoaded:false,
    tags:[],
    tagsLoaded:false,
    taskSolvers:[],
    task:null,
    taskLoaded:false,
    taskAttributesLoaded:false,
    taskAttributes:[],
    attachments:[],
    attachmentsError:'',
    generalOrder:0,
  };

  export default function taskReducer (state = initialState, action) {
    switch (action.type) {
      case SET_GENERAL_ORDER:
        return { ...state, generalOrder:action.generalOrder };
      case ADD_ATTACHMENT:
        return { ...state, attachments:[action.attachment,...state.attachments],attachmentsError:state.attachmentsError+action.error };
      case LOGIN_LOGOUT:
        return { ...initialState };
      case EDIT_ATTACHMENT:{
        let newAttachments=[...state.attachments];
          newAttachments[newAttachments.findIndex((attachment)=>attachment.id==action.attachment.id)]=action.attachment;
        return { ...state, attachments:newAttachments };
      }
      case DELETE_ATTACHMENT:{
        let newAttachments=state.attachments;
        newAttachments.splice(newAttachments.findIndex((attachment)=>attachment.id===action.id),1);
        return { ...state, attachments:[...newAttachments] };
      }
      case CLEAR_ATTACHMENTS:{
        return {...state,attachments:[],attachmentsError:''};
      }

      case SET_LOADING_TASKS:
      return {
        ...state,
        tasksLoaded: action.tasksLoaded,
      };
      case SET_TASKS:{
      return {
        ...state,
        tasks: action.tasks,
        nextTasks: action.nextTasks,
        tasksLoaded: true
      };
    }
      case ADD_TASKS:{
        if(action.url===state.nextTasks){
          return {
            ...state,
            tasks: state.tasks.concat(action.tasks),
            nextTasks: action.nextTasks,
          };
        }
      }
      case SET_OPENED_ID:
      return {
        ...state,
        openedID: action.openedID,
      };

      case SET_TASK_STATUSES_LOADING:
      return {
        ...state,
        statusesLoaded: action.statusesLoaded,
      };

      case SET_TASK_STATUSES:
      return {
        ...state,
        statuses: action.statuses,
        statusesUpdateDate:action.statusesUpdateDate,
        statusesLoaded: true
      };

      case SET_TASK_PROJECTS_LOADING:
      return {
        ...state,
        projectsLoaded: action.projectsLoaded,
      };
      case SET_TASK_PROJECTS:
      return {
        ...state,
        projects: action.projects,
        projectsLoaded: true
      };

      case SET_TASK_COMPANIES_LOADING:
      return {
        ...state,
        companiesLoaded: action.companiesLoaded,
      };
      case SET_TASK_COMPANIES:
      return {
        ...state,
        companies: action.companies,
        companiesUpdateDate:action.companiesUpdateDate,
        companiesLoaded: true
      };

      case SET_TASK_UNITS_LOADING:
      return {
        ...state,
        unitsLoaded: action.unitsLoaded,
      };
      case SET_TASK_UNITS:
      return {
        ...state,
        units: action.units,
        unitsLoaded: true
      };

      case SET_TASK_TAGS_LOADING:
      return {
        ...state,
        tagsLoaded: action.tagsLoaded,
      };
      case SET_TASK_TAGS:
      return {
        ...state,
        tags: action.tags,
        tagsLoaded: true
      };
      case SET_TASK_SOLVERS:
      return {
        ...state,
        taskSolvers: action.taskSolvers,
      };
      case SET_TASK_LOADING:
      return {
        ...state,
        taskLoaded: action.taskLoaded,
      };
      case SET_TASK:{
        return {
          ...state,
          task: action.task,
          taskLoaded: true,
        };
      }
      case SET_TASK_ATTRIBUTES_LOADING:
      return {
        ...state,
        taskAttributesLoaded: action.taskAttributesLoaded,
      };
      case SET_TASK_ATTRIBUTES:
      return {
        ...state,
        taskAttributes: action.taskAttributes,
        taskAttributesLoaded: true
      };
      case EDIT_TASK:{
        let newTasks=state.tasks;
        let index = newTasks.findIndex((item)=>item.id===action.task.id);
        if(index===-1){
          return state;
        }
        newTasks[index]=action.task;
        return {
          ...state,
          tasks:[...newTasks]
        };
        }
      default:
      return state;
    }
  }
