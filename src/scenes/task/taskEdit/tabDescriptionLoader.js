import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import TabDescription from './tabDescription';
import { storageHelpTasksStart } from '../../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabDescriptionLoader extends Component {
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
      <TabDescription
        saveFunction={this.props.saveFunction}
        inputChanged={this.props.inputChanged}
        id={this.props.id}
        setDescriptionEditorBlur={this.props.setDescriptionEditorBlur}
        />
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpTasks }) => {
  const { tasksActive, tasksLoaded } = storageHelpTasks;
  return { tasksActive, tasksLoaded };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{ storageHelpTasksStart })(TabDescriptionLoader);
