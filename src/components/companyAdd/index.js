import React, { Component } from "react";
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import {setCompanyAttributesLoading, getCompanyAttributes } from '../../redux/actions';
import CompanyAdd from './companyAdd';

class CompanyAddLoader extends Component {
  constructor(props){
    super(props);
    this.props.setCompanyAttributesLoading(false);
    this.props.getCompanyAttributes(this.props.token);
  }

  render(){
    if(!this.props.companyAttributesLoaded){
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
    return <CompanyAdd {...this.props}/>
  }
}

//all below is just redux storage
const mapStateToProps = ({companyReducer, loginReducer }) => {
  const {companyAttributesLoaded} = companyReducer;
  const {token} = loginReducer;
  return {companyAttributesLoaded, token};
};

export default connect(mapStateToProps, {setCompanyAttributesLoading, getCompanyAttributes})(CompanyAddLoader);
