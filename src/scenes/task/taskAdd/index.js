import React, { Component } from 'react';
import { Tab, Tabs, Container, Header, Title, Button, Icon, Left, Right, Body} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import AddTabs from './addTabs';
import {
  storageCompaniesStart,
  storageHelpProjectsStart,
  storageHelpStatusesStart,
  storageHelpTagsStart,
  storageHelpTaskTypesStart,
  storageHelpTasksStart,
  storageUsersStart,
  storageHelpMilestonesStart,
  storageMetadataStart,
 } from '../../../redux/actions';

import i18n from 'i18next';

/**
 * This component creates a main menu for the task editting
 * @extends Component
 */
class TaskAddLoader extends Component {
  constructor(props){
    super(props);
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
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
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
    this.props.milestonesLoaded &&
    this.props.metadataLoaded
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
      <AddTabs />
    );
  }
}

const mapStateToProps = ({
  storageCompanies,
  storageHelpProjects,
  storageHelpStatuses,
  storageHelpTags,
  storageHelpTaskTypes,
  storageHelpTasks,
  storageUsers,
  storageHelpMilestones,
  storageMetadata,
   }) => {
  const { companiesLoaded, companiesActive } = storageCompanies;
  const { projectsLoaded, projectsActive } = storageHelpProjects;
  const { statusesLoaded, statusesActive } = storageHelpStatuses;
  const { tagsLoaded, tagsActive } = storageHelpTags;
  const { taskTypesLoaded, taskTypesActive } = storageHelpTaskTypes;
  const { tasksLoaded, tasksActive } = storageHelpTasks;
  const { usersLoaded, usersActive } = storageUsers;
  const { milestonesLoaded, milestonesActive } = storageHelpMilestones;
	const { metadataLoaded, metadataActive } = storageMetadata;
  return {
    companiesLoaded, companiesActive,
    projectsLoaded, projectsActive,
    statusesLoaded, statusesActive,
    tagsLoaded, tagsActive,
    taskTypesLoaded, taskTypesActive,
    tasksLoaded, tasksActive,
    usersLoaded, usersActive,
    milestonesLoaded, milestonesActive,
    metadataLoaded, metadataActive
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
  storageMetadataStart
})(TaskAddLoader);
