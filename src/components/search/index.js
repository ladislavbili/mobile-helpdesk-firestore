import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';

import Search from './search';
import {
  storageHelpTaskTypesStart,
  storageUsersStart,
  storageCompaniesStart,
  storageHelpStatusesStart,
 } from '../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */

class SearchLoader extends Component {
  constructor(props){
    super(props);
    this.loadStorage.bind();
    this.loadStorage();
  }

  loadStorage(){
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
  }


  storageLoaded(){
    return this.props.statusesLoaded &&
    this.props.usersLoaded &&
    this.props.companiesLoaded &&
    this.props.taskTypesLoaded;
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
      <Search />
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpStatuses, storageUsers, storageCompanies, storageHelpTaskTypes }) => {
  const { statusesActive, statusesLoaded } = storageHelpStatuses;
  const { usersActive, usersLoaded } = storageUsers;
  const { companiesActive, companiesLoaded } = storageCompanies;
  const { taskTypesActive, taskTypesLoaded } = storageHelpTaskTypes;
  return {
    statusesActive, statusesLoaded,
    usersActive, usersLoaded,
    companiesActive, companiesLoaded,
    taskTypesActive, taskTypesLoaded
   };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{
  storageHelpTaskTypesStart,
  storageUsersStart,
  storageCompaniesStart,
  storageHelpStatusesStart,
})(SearchLoader);
