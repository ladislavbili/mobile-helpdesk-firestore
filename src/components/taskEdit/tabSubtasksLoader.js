import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';

import TabSubtasks from './tabSubtasks';
import {setSubtasksLoading,getSubtasks,setSubtasksCount} from '../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabSubtasksLoader extends Component {
  constructor(props){
    super(props);
    this.props.setSubtasksLoading(false);
    this.props.setSubtasksCount(0);
    this.props.getSubtasks(this.props.id,this.props.token);
  }
  render() {
    if(!this.props.subtasksLoaded){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <TabSubtasks id={this.props.id}/>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({loginReducer, subtaskReducer}) => {
  const {token} = loginReducer;
  const {subtasksLoaded } = subtaskReducer;
  return {token, subtasksLoaded};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{setSubtasksLoading,getSubtasks,setSubtasksCount})(TabSubtasksLoader);
