import React, { Component } from "react";
import Login from './login';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'native-base';
import i18n from 'i18next';
import firebase from 'react-native-firebase';

import { setAutologinDone, setUserData, setUserFilterStatuses, setUserID, logout } from '../../redux/actions';

let database = firebase.firestore();

class LoginChecker extends Component {
  constructor(props){
    super(props);
  }

  UNSAFE_componentWillMount(){
    firebase.auth().onAuthStateChanged((user) => {
      this.props.setAutologinDone();
      if(user!==null){
        console.log('Logged in');
        database.collection('users').doc(user.uid).get().then((response)=>{
          let userData = {...response.data(), id:user.uid };
          this.props.setUserData(userData);
          this.props.setUserFilterStatuses(userData.statuses)
        })
        this.props.setUserID(user.uid);
      }else{
        console.log('Logged out');
        this.props.logout();
      }
    });
  }

  render(){
    if(this.props.autologinDone){
      return <Login {...this.props}/>;
    }
    else{
      return <View style={{flexDirection:'row'}}>
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      <Text style={{marginTop:6, marginLeft:5}}>Checking for token...</Text>
        </View>
    }
  }
}

// All below is just redux storage
const mapStateToProps = ({ loginReducer }) => {
  const {autologinDone} = loginReducer;
  return {autologinDone};
};

export default connect(mapStateToProps, {
  setAutologinDone,
  setUserData,
  setUserFilterStatuses,
  setUserID,
  logout,

})(LoginChecker);
