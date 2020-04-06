import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import TabComments from './tabComments';
import { storageHelpTasksStart } from '../../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabCommentsLoader extends Component {
  constructor(props){
    super(props);
    this.startStorage.bind(this);
    this.startStorage();
  }


  startStorage(){
    if(!this.props.tasksActive){
      this.props.storageHelpTasksStart();
    }
  }

  render() {
    if(!this.props.tasksLoaded){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <TabComments saveFunction={this.props.saveFunction} inputChanged={this.props.inputChanged} id={this.props.id} />
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpTasks }) => {
  const { tasksActive, tasksLoaded } = storageHelpTasks;
  return { tasksActive, tasksLoaded };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{ storageHelpTasksStart })(TabCommentsLoader);
