import React, { Component } from "react";
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import {getCompanies, setCompaniesLoading, setUserRolesLoading, getUserRoles,setUserLoading ,getUser } from '../../redux/actions';
import UserEdit from './userEdit';

class EditUserLoader extends Component {
  constructor(props){
    super(props);
    this.props.setCompaniesLoading(false);
    this.props.getCompanies(this.props.updateDate,this.props.token);
    this.props.setUserRolesLoading(false);
    this.props.getUserRoles(this.props.token);
    this.props.setUserLoading(false);
    this.props.getUser(this.props.id,this.props.token);
  }

  render(){
    if(!this.props.companiesLoaded||!this.props.userRolesLoaded||!this.props.userLoaded){
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
    return <UserEdit {...this.props}/>
  }
}

//all below is just redux storage
const mapStateToProps = ({companyReducer, loginReducer, userReducer }) => {
  const {companiesLoaded,updateDate} = companyReducer;
  const {userRolesLoaded, userLoaded} = userReducer;
  const {token} = loginReducer;
  return {companiesLoaded,updateDate,userRolesLoaded,userLoaded, token};
};

export default connect(mapStateToProps, {getCompanies, setCompaniesLoading, setUserRolesLoading, getUserRoles,setUserLoading ,getUser})(EditUserLoader);
