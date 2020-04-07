import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import TabComments from './tabComments';
import { snapshotToArray } from '../../../helperFunctions';
import {
  storageUsersStart,
  storageHelpProjectsStart,
  storageHelpTasksStart,
} from '../../../redux/actions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabCommentsLoader extends Component {
  constructor(props){
    super(props);
    this.state={
      comments:[],
      commentsLoaded:false,
    }
    this.startStorage.bind(this);
    this.startStorage();
  }


  startStorage(){
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
    if(!this.props.tasksActive){
      this.props.storageHelpTasksStart();
    }
  }

  updateComments(){
    database.collection('help-comments').where("task", "==", this.props.id).get().then((comments)=>{
      this.setState({comments:snapshotToArray(comments), commentsLoaded:true});
    })
  }

  UNSAFE_componentWillMount(){
    this.updateComments();
  }

  storageLoaded(){
    return this.state.commentsLoaded &&
    this.props.usersLoaded &&
    this.props.tasksLoaded &&
    this.props.projectsLoaded
  }

  render() {
    if(!this.storageLoaded()){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <TabComments saveFunction={this.props.saveFunction} inputChanged={this.props.inputChanged} id={this.props.id} comments={this.state.comments} updateComments={this.updateComments.bind(this)} />
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageUsers,storageHelpTasks, storageHelpProjects }) => {
  const { usersLoaded, usersActive } = storageUsers;
  const { tasksLoaded, tasksActive } = storageHelpTasks;
  const { projectsLoaded, projectsActive } = storageHelpProjects;
  return {
    usersLoaded, usersActive,
    tasksLoaded, tasksActive,
    projectsLoaded, projectsActive,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{
  storageUsersStart,
  storageHelpProjectsStart,
  storageHelpTasksStart,
})(TabCommentsLoader);
