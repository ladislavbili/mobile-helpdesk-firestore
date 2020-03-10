import React, { Component } from "react";
import UserList from './userList';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'native-base';
import { getAllUsers, setUsersLoading } from '../../redux/actions';

class UserListLoader extends Component {
  constructor(props){
    super(props);
    this.props.setUsersLoading(false);
    this.props.getAllUsers(this.props.token);
  }

  render(){
    if(this.props.usersLoaded){
      return <UserList {...this.props}/>;
    }
    else{
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
  }
}

// All below is just redux storage
const mapStateToProps = ({ userReducer,loginReducer }) => {
  const {token} = loginReducer;
  const {usersLoaded} = userReducer;
  return {token,usersLoaded};
};

export default connect(mapStateToProps, {getAllUsers, setUsersLoading })(UserListLoader);
