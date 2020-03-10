import React, { Component } from "react";
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import {getCompanies, setCompaniesLoading } from '../../redux/actions';
import CompanyList from './companyList';

class CompaniesListLoader extends Component {
  constructor(props){
    super(props);
    this.props.setCompaniesLoading(false);
    this.props.getCompanies(this.props.updateDate,this.props.token);
  }

  render(){
    if(!this.props.companiesLoaded){
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
    return <CompanyList {...this.props}/>
  }
}

//all below is just redux storage
const mapStateToProps = ({companyReducer, loginReducer }) => {
  const {companiesLoaded,updateDate} = companyReducer;
  const {token} = loginReducer;
  return {companiesLoaded,updateDate,token};
};

export default connect(mapStateToProps, {getCompanies, setCompaniesLoading})(CompaniesListLoader);
