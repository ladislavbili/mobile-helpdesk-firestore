import React, { Component } from "react";
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import {setUserLoading ,getUser } from '../../../redux/actions';
import Account from './account';
import jwt_decode from 'jwt-decode';

class EditUserLoader extends Component {
  constructor(props){
    super(props);
    this.props.setUserLoading(false);
    this.props.getUser(jwt_decode(this.props.token).id,this.props.token);
  }

  render(){
    if(!this.props.userLoaded){
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
    return <Account {...this.props}/>
  }
}

//all below is just redux storage
const mapStateToProps = ({ loginReducer, userReducer }) => {
  const { userLoaded} = userReducer;
  const {token} = loginReducer;
  return { userLoaded, token};
};

export default connect(mapStateToProps, {setUserLoading ,getUser})(EditUserLoader);
