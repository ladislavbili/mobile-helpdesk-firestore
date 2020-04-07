
import React, { Component } from 'react';
import { Tab, Tabs, Container} from 'native-base';
import { connect } from 'react-redux';
import TabComment from './tabComment';
import { ActivityIndicator } from 'react-native';
import i18n from 'i18next';
import {
  storageHelpProjectsStart,
  storageHelpTasksStart,
} from '../../../redux/actions';


/**
 * Creates tabs that allows the user to send either comments or comments and e-mails
 * @extends Component
 */
class CommentAdd extends Component {
  constructor(props){
    super(props);
    this.startStorage.bind(this);
    this.startStorage();
  }


  startStorage(){
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
    if(!this.props.tasksActive){
      this.props.storageHelpTasksStart();
    }
  }
  storageLoaded(){
    return this.props.tasksLoaded &&
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
      <Container>
        <Tabs>
          <Tab heading={'+' + i18n.t('comment')}>
            <TabComment id={this.props.id} updateComments={this.props.updateComments} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpTasks, storageHelpProjects }) => {
  const { tasksLoaded, tasksActive } = storageHelpTasks;
  const { projectsLoaded, projectsActive } = storageHelpProjects;
  return {
    tasksLoaded, tasksActive,
    projectsLoaded, projectsActive,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{
  storageHelpProjectsStart,
  storageHelpTasksStart,
})(CommentAdd);
