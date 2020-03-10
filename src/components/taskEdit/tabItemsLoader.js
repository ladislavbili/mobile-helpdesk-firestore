import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';

import TabItems from './tabItems';
import {setItemsLoading,getItems,setUnitsLoading, getUnits} from '../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabItemsLoader extends Component {
  constructor(props){
    super(props);
    this.props.setItemsLoading(false);
    this.props.getItems(this.props.id,this.props.token);
    this.props.setUnitsLoading(false);
    this.props.getUnits(this.props.token);
  }
  render() {
    if(!this.props.itemsLoaded||!this.props.unitsLoaded){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <TabItems id={this.props.id}/>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({loginReducer, itemReducer}) => {
  const {token} = loginReducer;
  const {itemsLoaded, unitsLoaded } = itemReducer;
  return {token, itemsLoaded, unitsLoaded};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{setItemsLoading,getItems,setUnitsLoading, getUnits})(TabItemsLoader);
