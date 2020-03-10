import React, { Component } from "react";
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import {getCompanies, setCompaniesLoading, setUserRolesLoading, getUserRoles } from '../../redux/actions';
import UserAdd from './userAdd';

class AddUserLoader extends Component {
  constructor(props){
    super(props);
    this.props.setCompaniesLoading(false);
    this.props.getCompanies(this.props.updateDate,this.props.token);
    this.props.setUserRolesLoading(false);
    this.props.getUserRoles(this.props.token);
  }

  render(){
    if(!this.props.companiesLoaded||!this.props.userRolesLoaded){
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
    return <UserAdd {...this.props}/>
  }
}

//all below is just redux storage
const mapStateToProps = ({companyReducer, loginReducer, userReducer }) => {
  const {companiesLoaded,updateDate} = companyReducer;
  const {userRolesLoaded} = userReducer;
  const {token} = loginReducer;
  return {companiesLoaded,updateDate,userRolesLoaded,token};
};

export default connect(mapStateToProps, {getCompanies, setCompaniesLoading, setUserRolesLoading, getUserRoles})(AddUserLoader);
