import React, { Component } from "react";
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { storageCompaniesStart } from '../../../redux/actions';
import Account from './account';

class AccountLoader extends Component {
  constructor(props){
    super(props);
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
  }

  render(){
    if(!this.props.companiesLoaded){
      return <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
    }
    return <Account />
  }
}

//all below is just redux storage
const mapStateToProps = ({ storageCompanies }) => {
  const { companiesLoaded, companiesActive } = storageCompanies;
  return { companiesLoaded, companiesActive };
};

export default connect(mapStateToProps, { storageCompaniesStart })(AccountLoader);
