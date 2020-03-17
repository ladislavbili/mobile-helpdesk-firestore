import React, { Component } from "react";
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import {getCompany, setCompanyLoading,setCompanyAttributesLoading, getCompanyAttributes } from '../../../redux/actions';
import CompanyEdit from './companyEdit';

class CompanyEditLoader extends Component {
  constructor(props){
    super(props);
    this.props.setCompanyLoading(false);
    this.props.setCompanyAttributesLoading(false);
    this.props.getCompany( this.props.id,this.props.token);
    this.props.getCompanyAttributes(this.props.token);
  }

  render(){
    if(!this.props.companyLoaded||!this.props.companyAttributesLoaded){
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
    return <CompanyEdit {...this.props}/>
  }
}

//all below is just redux storage

const mapStateToProps = ({ companyReducer, loginReducer }) => {
  const {companyLoaded, companyAttributesLoaded} = companyReducer;
  const {token} = loginReducer;
  return {token,companyLoaded, companyAttributesLoaded};
};


export default connect(mapStateToProps, {getCompany, setCompanyLoading,setCompanyAttributesLoading, getCompanyAttributes })(CompanyEditLoader);
