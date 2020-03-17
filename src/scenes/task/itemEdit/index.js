import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';

import ItemEdit from './itemEdit';
import {setUnitsLoading, getUnits} from '../../../redux/actions';

/**
* Load all of the attributes required for the user to create a new item
* @extends Component
*/
class ItemEditLoader extends Component {
  constructor(props){
    super(props);
    this.props.setUnitsLoading(false);
    this.props.getUnits(this.props.token);
  }
  render() {
    if(!this.props.unitsLoaded){
      return (
        <ActivityIndicator
          animating size={ 'large' }
          color='#007299' />
      )
    }

    return (
      <ItemEdit id={this.props.id} data={this.props.data}/>
    );
  }
}


//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ itemReducer, loginReducer }) => {
  const { unitsLoaded } = itemReducer;
  const { token } = loginReducer;
  return { unitsLoaded, token };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{setUnitsLoading, getUnits})(ItemEditLoader);
