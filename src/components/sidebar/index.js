import React, { Component } from "react";
import Sidebar from './sidebar';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'native-base';
import { storageHelpProjectsStart, storageHelpFiltersStart } from '../../redux/actions';

class SidebarLoader extends Component {
  constructor(props){
    super(props);
    this.startStorage.bind(this);
    this.startStorage();
  }

  startStorage(){
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
    if(!this.props.filtersActive){
      this.props.storageHelpFiltersStart();
    }
  }

  render(){
    if(this.props.projectsLoaded && this.props.filtersLoaded){
      return <Sidebar/>;
    }
    else{
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
  }
}

// All below is just redux storage
const mapStateToProps = ({ storageHelpFilters, storageHelpProjects }) => {
  const { filtersActive, filtersLoaded } = storageHelpFilters;
  const { projectsActive, projectsLoaded } = storageHelpProjects;
  return {
    filtersActive, filtersLoaded,
    projectsActive, projectsLoaded
  };
};

export default connect(mapStateToProps, { storageHelpProjectsStart, storageHelpFiltersStart })(SidebarLoader);
