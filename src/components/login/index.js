import React, { Component } from "react";
import Login from './login';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'native-base';
import { checkToken } from '../../redux/actions';
import i18n from 'i18next';
class TokenChecker extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount(){
    this.props.checkToken();
  }

  render(){
    if(this.props.tokenChecked){
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
  const {tokenChecked} = loginReducer;
  return {tokenChecked};
};

export default connect(mapStateToProps, {checkToken})(TokenChecker);
