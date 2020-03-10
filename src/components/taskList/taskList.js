
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, FooterTab, Container, Content, Button, Icon, Text, List } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { startLoading,getMoreTasks } from '../../redux/actions';
import TaskListRow from './taskListRow';
import i18n from 'i18next';

/**
 * Displays all of the loaded tasks
 * @extends Component
 */
class TaskList extends Component {
  render() {
    return (
      <Container>
        <Content>
          <List>
            {
              this.props.tasks.map((task) => <TaskListRow task={task} key={task.id} />)
            }
          </List>
          {
            this.props.tasks.length==0 && <Text style={{padding:20}}>{i18n.t('emptyTaskList')}</Text>
        }
        {
          this.props.nextTasks &&
          <Button
            block
            primary
            onPress={()=>this.props.getMoreTasks(this.props.nextTasks,this.props.token)}
            style={{margin:15}}>
            <Text>{i18n.t('loadMoreTasks')}</Text>
          </Button>
        }
      </Content>
      { this.props.user.user_role.acl.includes('create_tasks_in_all_projects') && this.props.projectID &&
        <Footer>
          <FooterTab>
            <Button vertical onPress={()=>{this.props.startLoading();Actions.taskAdd({projectID:this.props.projectID});}}>
              <Icon name="md-add" style={{ color: 'white' }} />
              <Text style={{ color: 'white' }} >{i18n.t('task')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      }
    </Container>
  );
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ taskReducer, loginReducer }) => {
  const { tasks, nextTasks, projectID } = taskReducer;
  const { user,token } = loginReducer;
  return {tasks, token,projectID,user,nextTasks};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {startLoading,getMoreTasks})(TaskList);
