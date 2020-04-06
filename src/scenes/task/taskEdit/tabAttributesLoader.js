import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import TabAttributes from './tabAttributes';
import {
  storageCompaniesStart,
  storageHelpProjectsStart,
  storageHelpStatusesStart,
  storageHelpTagsStart,
  storageHelpTaskTypesStart,
  storageHelpTasksStart,
  storageUsersStart,
  storageHelpMilestonesStart,
 } from '../../../redux/actions';

class TabAttributesLoader extends Component {
  constructor(props){
    super(props);
    this.storageLoaded.bind(this);
    this.startStorage.bind(this);
    this.startStorage();
  }


  startStorage(){
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }
    if(!this.props.tagsActive){
      this.props.storageHelpTagsStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(!this.props.tasksActive){
      this.props.storageHelpTasksStart();
    }
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.milestonesActive){
      this.props.storageHelpMilestonesStart();
    }
  }

  storageLoaded(){
    return this.props.companiesLoaded &&
  this.props.projectsLoaded &&
  this.props.statusesLoaded &&
  this.props.tagsLoaded &&
  this.props.taskTypesLoaded &&
  this.props.tasksLoaded &&
  this.props.usersLoaded &&
  this.props.milestonesLoaded
  }

  render() {
    if(!this.storageLoaded()){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <TabAttributes saveFunction={this.props.saveFunction} inputChanged={this.props.inputChanged} id={this.props.id} />
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({
  storageCompanies,
  storageHelpProjects,
  storageHelpStatuses,
  storageHelpTags,
  storageHelpTaskTypes,
  storageHelpTasks,
  storageUsers,
  storageHelpMilestones,
   }) => {
  const { companiesLoaded, companiesActive } = storageCompanies;
  const { projectsLoaded, projectsActive } = storageHelpProjects;
  const { statusesLoaded, statusesActive } = storageHelpStatuses;
  const { tagsLoaded, tagsActive } = storageHelpTags;
  const { taskTypesLoaded, taskTypesActive } = storageHelpTaskTypes;
  const { tasksLoaded, tasksActive } = storageHelpTasks;
  const { usersLoaded, usersActive } = storageUsers;
  const { milestonesLoaded, milestonesActive } = storageHelpMilestones;
  return {
    companiesLoaded, companiesActive,
    projectsLoaded, projectsActive,
    statusesLoaded, statusesActive,
    tagsLoaded, tagsActive,
    taskTypesLoaded, taskTypesActive,
    tasksLoaded, tasksActive,
    usersLoaded, usersActive,
    milestonesLoaded, milestonesActive,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{
  storageCompaniesStart,
  storageHelpProjectsStart,
  storageHelpStatusesStart,
  storageHelpTagsStart,
  storageHelpTaskTypesStart,
  storageHelpTasksStart,
  storageUsersStart,
  storageHelpMilestonesStart,
 })(TabAttributesLoader);
