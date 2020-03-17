
import React, { Component } from 'react';
import { Container, Header, Title, Button, Icon, Left, Right, Body } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator } from 'react-native';

import TaskList from './taskList';
import { openDrawer, getTasks, setTasksLoading, getFilterTasks, setOpenedID, setGeneralOrder } from '../../../redux/actions';
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
  }


  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={()=>this.props.openDrawer()}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.listName?this.props.listName:i18n.t('taskList')}</Title>
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
          this.state.tasksLoaded &&
          <TaskList />
        }
        {
          !this.state.tasksLoaded &&
          <ActivityIndicator
            animating size={ 'large' }
            color='#007299' />
        }
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ drawerReducer }) => {
  const { drawerState } = drawerReducer;
  return { drawerState };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{ openDrawer })(TaskListLoader);
