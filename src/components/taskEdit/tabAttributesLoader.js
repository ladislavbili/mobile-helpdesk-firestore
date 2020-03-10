import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import TabAttributes from './tabAttributes';
import {setTaskProjectsLoading,setTaskStatusesLoading,setTaskCompaniesLoading,setTaskTagsLoading,
  deleteTaskSolvers,setUsersLoading,getTaskStatuses,getTaskProjects,getTaskCompanies,getTaskTags,getUsers, setTaskLoading, getTask,
  setTaskAttributesLoading, getTaskAttributes} from '../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabAttributesLoader extends Component {
  constructor(props){
    super(props);
    this.props.setTaskProjectsLoading(false);
    this.props.setTaskStatusesLoading(false);
    this.props.setTaskCompaniesLoading(false);
    this.props.setTaskTagsLoading(false);
    this.props.setUsersLoading(false);
    this.props.setTaskLoading(false);
    this.props.setTaskAttributesLoading(false);

    this.props.deleteTaskSolvers();
    this.props.getTaskStatuses(null,this.props.token);
    this.props.getTaskProjects(this.props.token);
    this.props.getTaskCompanies(null,this.props.token);
    this.props.getTaskTags(this.props.token);
    this.props.getUsers(null,this.props.token);
    this.props.getTask(this.props.id,this.props.token);
    this.props.getTaskAttributes(this.props.token);
  }
  render() {
    if(!this.props.usersLoaded||!this.props.statusesLoaded||!this.props.projectsLoaded||!this.props.companiesLoaded||!this.props.tagsLoaded||
      !this.props.taskLoaded||!this.props.taskAttributesLoaded){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <TabAttributes saveFunction={this.props.saveFunction} inputChanged={this.props.inputChanged}/>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({loginReducer,userReducer, taskReducer}) => {
  const {token} = loginReducer;
  const {usersLoaded} = userReducer;
  const {statusesUpdateDate, companiesUpdateDate, taskAttributesLoaded,
    statusesLoaded,  projectsLoaded,  companiesLoaded,  tagsLoaded, taskLoaded } = taskReducer;
  return {token, usersLoaded, statusesUpdateDate,statusesLoaded,  projectsLoaded,  companiesLoaded,  tagsLoaded,taskLoaded, companiesUpdateDate,
    taskAttributesLoaded };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{setTaskProjectsLoading,setTaskStatusesLoading,setTaskCompaniesLoading,setTaskTagsLoading,
  deleteTaskSolvers,setUsersLoading,getTaskStatuses,getTaskProjects,getTaskCompanies,getTaskTags,getUsers, setTaskLoading, getTask,
  setTaskAttributesLoading, getTaskAttributes})(TabAttributesLoader);
