
import React, { Component } from 'react';
import { Container, Header, Title, Button, Icon, Left, Right, Body } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator } from 'react-native';

import TaskList from './taskList';
import { fixedFilters } from '../../../components/sidebar/fixedFilters';
import { openDrawer, storageHelpProjectsStart, storageHelpTasksStart, storageUsersStart, storageHelpFiltersStart, storageHelpStatusesStart } from '../../../redux/actions';
import i18n from 'i18next';

/**
 * Loads all of the tasks for the task list
 * @extends Component
 */
class TaskListLoader extends Component {
  constructor(props){
    super(props);
    this.state={
      tasksLoaded:false,
    }
    this.startStorage.bind(this);
    this.startStorage();
    //porjects tasks users
  }


  startStorage(){
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
    if(!this.props.tasksActive){
      this.props.storageHelpTasksStart();
    }
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.filtersActive){
      this.props.storageHelpFiltersStart();
    }
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }
  }

  isLoaded(props){
    return props.projectsLoaded &&
    props.tasksLoaded &&
    props.usersLoaded &&
    props.filtersLoaded &&
    props.statusesLoaded
  }

  render() {
    let listTitle = null;
    if(this.props.filtersLoaded && this.props.filterID !== 'none'){
      let filter = [ ...fixedFilters, ...this.props.filters ].find((filter)=>filter.id === this.props.filterID);
      if(filter){
        listTitle = filter.title;
      }
    }
    if(this.props.projectsLoaded && this.props.projectID !== 'none'){
      let project = this.props.projects.find((project)=>project.id === this.props.projectID);
      if(project){
        listTitle = project.title;
      }
    }
    if(this.props.listTitle){
      listTitle = this.props.listTitle;
    }
    if(listTitle === null){
      listTitle = 'taskList';
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={()=>this.props.openDrawer()}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>{i18n.t(listTitle)}
            </Title>
          </Body>
          <Right>
            <Button transparent style={{ marginTop: 8 }} onPress={Actions.taskAdd}>
              <Icon name="add" style={{ color: 'white' }} />
            </Button>
            <Button transparent style={{ marginTop: 8 }} onPress={Actions.search}>
              <Icon name="search" style={{ color: 'white' }} />
            </Button>
            {false && <Button transparent style={{ marginTop: 8 }} onPress={Actions.messages}>
              <Icon name="mail" style={{ color: 'white' }} />
            </Button>}
            <Button transparent style={{ marginTop: 8 }} onPress={Actions.settings}>
            <Icon name="settings" style={{ color: 'white' }} />
            </Button>
          </Right>
        </Header>
        {
          this.isLoaded(this.props) &&
          <TaskList forcedFilter={ this.props.forcedFilter } />
        }
        {
          !this.isLoaded(this.props) &&
          <ActivityIndicator
            animating size={ 'large' }
            color='#007299' />
        }
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ drawerReducer, storageHelpProjects, storageHelpTasks, storageUsers, storageHelpFilters, storageHelpStatuses, filterReducer }) => {
  const { drawerState } = drawerReducer;
  const { filterID, projectID  } = filterReducer;

  const { projectsActive, projectsLoaded, projects } = storageHelpProjects;
  const { tasksActive, tasksLoaded } = storageHelpTasks;
  const { usersActive, usersLoaded } = storageUsers;
  const { filtersActive, filtersLoaded, filters } = storageHelpFilters;
  const { statusesActive, statusesLoaded } = storageHelpStatuses;
  return {
    drawerState,
    filterID, projectID,
    projectsActive, projectsLoaded, projects,
    tasksActive, tasksLoaded,
    usersActive, usersLoaded,
    filtersActive, filtersLoaded, filters,
    statusesActive, statusesLoaded,
   };
}

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{ openDrawer, storageHelpProjectsStart, storageHelpTasksStart, storageUsersStart, storageHelpFiltersStart, storageHelpStatusesStart })(TaskListLoader);
