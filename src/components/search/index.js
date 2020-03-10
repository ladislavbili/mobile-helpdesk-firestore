import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';

import Search from './search';
import {setTaskProjectsLoading,setTaskStatusesLoading,setTaskCompaniesLoading,setTaskTagsLoading,
  setUsersLoading,getTaskStatuses,getTaskProjects,getTaskCompanies,getTaskTags,getUsers} from '../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class SearchLoader extends Component {
  constructor(props){
    super(props);
    this.props.setTaskProjectsLoading(false);
    this.props.setTaskStatusesLoading(false);
    this.props.setTaskCompaniesLoading(false);
    this.props.setTaskTagsLoading(false);
    this.props.setUsersLoading(false);
    this.props.getTaskStatuses(null,this.props.token);
    this.props.getTaskProjects(this.props.token);
    this.props.getTaskCompanies(null,this.props.token);
    this.props.getTaskTags(this.props.token);
    this.props.getUsers(null,this.props.token);
  }
  render() {
    if(!this.props.usersLoaded||!this.props.statusesLoaded||!this.props.projectsLoaded||!this.props.companiesLoaded||!this.props.tagsLoaded){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <Search/>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({loginReducer,userReducer, taskReducer}) => {
  const {token} = loginReducer;
  const {usersLoaded} = userReducer;
  const {statusesUpdateDate, companiesUpdateDate,
    statusesLoaded,  projectsLoaded,  companiesLoaded,  tagsLoaded} = taskReducer;
  return {token, usersLoaded, statusesUpdateDate,statusesLoaded,  projectsLoaded,  companiesLoaded,  tagsLoaded, companiesUpdateDate };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{setTaskProjectsLoading,setTaskStatusesLoading,setTaskCompaniesLoading,setTaskTagsLoading,
  setUsersLoading,getTaskStatuses,getTaskProjects,getTaskCompanies,getTaskTags,getUsers})(SearchLoader);
