import React, { Component } from "react";
import Sidebar from './sidebar';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'native-base';
import { getSidebar, setSidebarLoading } from '../../redux/actions';

class SidebarLoader extends Component {
  constructor(props){
    super(props);
    this.props.setSidebarLoading(false);
    this.props.getSidebar(this.props.token);
  }

  render(){
    if(this.props.sidebarLoaded){
      return <Sidebar {...this.props}/>;
    }
    else{
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
  }
}

// All below is just redux storage
const mapStateToProps = ({ sidebarReducer,loginReducer }) => {
  const {token} = loginReducer;
  const {sidebarLoaded} = sidebarReducer;
  return {token,sidebarLoaded};
};

export default connect(mapStateToProps, {getSidebar, setSidebarLoading})(SidebarLoader);
