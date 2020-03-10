
import React, { Component } from 'react';
import { Container, Header, Title, Button, Icon, Left, Right, Body } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator } from 'react-native';

import TaskList from './taskList';
import { openDrawer, getTasks, setTasksLoading, getFilterTasks, setOpenedID, setGeneralOrder } from '../../redux/actions';
import i18n from 'i18next';

/**
 * Loads all of the tasks for the task list
 * @extends Component
 */
class TaskListLoader extends Component {
  constructor(props){
    super(props);
    this.getOpenedID.bind(this);

    if(this.props.drawerState==='closed'){
      if(!this.props.filter && !this.props.filterID || this.props.openedID===this.getOpenedID()||this.props.order !== this.props.generalOrder){
        this.props.setTasksLoading(true);
      }
      else{
        this.props.setOpenedID(this.getOpenedID());
        this.props.setGeneralOrder(this.props.generalOrder+1);
        this.props.setTasksLoading(false);
        if(this.props.filter){
          this.props.getTasks(this.props.filter,this.props.token);
        }else if(this.props.filterID==='none'){
          this.props.getTasks(this.props.projectID!=='all'?{project:this.props.projectID}:{},this.props.token);
        }else{
          this.props.getFilterTasks(this.props.filterID,this.props.projectID,this.props.token);
        }
      }
    }
  }

  getOpenedID(){
    if(this.props.filter){
      return JSON.stringify(this.props.filter);
    }
    return JSON.stringify({projectID:this.props.projectID,filterID:this.props.filterID});
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={()=>this.props.openDrawer(this.props.token)}>
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
            { //(this.props.user.user_role.acl.includes('company_settings') || this.props.user.user_role.acl.includes('user_settings') ) &&
            }
            <Button transparent style={{ marginTop: 8 }} onPress={Actions.settings}>
            <Icon name="settings" style={{ color: 'white' }} />
            </Button>
          </Right>
        </Header>
        {
          this.props.tasksLoaded &&
          <TaskList />
        }
        {
          !this.props.tasksLoaded &&
          <ActivityIndicator
            animating size={ 'large' }
            color='#007299' />
        }
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({taskReducer,loginReducer, drawerReducer}) => {
  const {tasksLoaded,tasks, openedID, generalOrder} = taskReducer;
  const {drawerState} = drawerReducer;
  const {token} = loginReducer;
  return {tasksLoaded,tasks,openedID,generalOrder,drawerState, token};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{ openDrawer, getTasks, setTasksLoading, getFilterTasks, setOpenedID, setGeneralOrder })(TaskListLoader);
