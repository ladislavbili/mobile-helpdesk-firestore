
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, FooterTab, Container, Content, Button, Icon, Text, List } from 'native-base';
import { Actions } from 'react-native-router-flux';
//import {  } from '../../../redux/actions';
import { fixedFilters, emptyFilter } from '../../../components/sidebar/fixedFilters';
import { applyTaskFilter } from '../../../helperFunctions'
import TaskListRow from './taskListRow';
import i18n from 'i18next';

/**
 * Displays all of the loaded tasks
 * @extends Component
 */
class TaskList extends Component {
  constructor(props){
    super(props);
    this.state={
      show:10
    }
    this.filterTasks.bind(this);
    this.filterTasksByFilter.bind(this);
    this.filterTasksBySearch.bind(this);
    this.getTasks.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props){
    if(this.props.projectID !== props.projectID){
      this.setState({show:10})
    }else if(this.props.filterID !== props.filterID){
      this.setState({show:10})
    }
  }

  sortTasks(tasks){
    return tasks
    .sort((task1,task2)=>{
      if( task1.createdAt > task2.createdAt ){
        return -1;
      }else if(task1.createdAt < task2.createdAt ){
        return 1;
      }
      return 0
    }).sort((task1,task2)=>{
      if( task1.status.order < task2.status.order ){
        return -1;
      }else if(task1.status.order > task2.status.order){
        return 1;
      }
      return 0
    }).sort((task1,task2)=>{
      if(task1.important && !task2.important){
        return -1;
      }else if(!task1.important && task2.important){
        return 1;
      }
      return 0;
    });
  }

  filterTasksBySearch(tasks){
    let filter = this.props.forcedFilter;
    return tasks.filter((task)=> ( task.project && task.project.id === this.props.projectID || this.props.projectID === 'all' )).filter((task)=>{
      let currentPermissions = null;
      if(task.project){
        currentPermissions = task.project.permissions.find((permission)=>permission.user === this.props.currentUser.id);
      }
      let assignedToIDs = [];
      if(task.assignedTo){
        assignedToIDs = task.assignedTo.map( (assignedTo) => assignedTo.id )
      }
      return (
        ( this.props.currentUser.userData.role.value===3 || ( currentPermissions && currentPermissions.read ) ) &&
        ( filter.title.length === 0 || task.title.toLowerCase().includes(filter.title.toLowerCase()) ) &&
        ( filter.requester.length === 0 || ( task.requester && filter.requester.includes(task.requester) ) ) &&
        ( filter.status.length === 0 || filter.status.includes(task.status.id) ) &&
        ( filter.workType.length === 0 || filter.workType.includes(task.type) ) &&
        ( filter.company.length === 0 || ( task.company && filter.company.incudes(task.company) )) &&
        ( filter.assigned.length === 0 || filter.assigned.every( (id) => assignedToIDs.includes(id) ) ) &&
        ( filter.statusDateFrom === null || task.statusChange >= filter.statusDateFrom ) &&
        ( filter.statusDateTo === null || task.statusChange <= filter.statusDateTo ) &&
        ( filter.closeDateFrom === null || task.closeDate >= filter.closeDateFrom ) &&
        ( filter.closeDateTo === null || task.closeDate <= filter.closeDateTo ) &&
        ( filter.pendingDateFrom === null || task.pendingDate >= filter.pendingDateFrom ) &&
        ( filter.pendingDateTo === null || task.pendingDate <= filter.pendingDateTo )
      )
    })
  }

  filterTasks(tasks){
    if(this.props.forcedFilter){
      return this.filterTasksBySearch(tasks);
    }else{
      return this.filterTasksByFilter(tasks);
    }
  }

  filterTasksByFilter(tasks){
    let filter = ( [...fixedFilters, ...this.props.filters] ).find((filter)=>filter.id === this.props.filterID );
    if(filter !== undefined){
      filter = filter.filter;
    }else{
      filter = emptyFilter;
    }
    return tasks.filter( (task) => applyTaskFilter( task, filter, this.props.currentUser, this.props.projectID ) );
  }

  getTasks(){
    const tasks = this.props.tasks.map( ( task ) => ({
      ...task,
      status: this.props.statuses.find( (status) => status.id === task.status),
      project: this.props.projects.find( (project) => project.id === task.project),
      assignedTo: this.props.users.filter( (user) => task.assignedTo.includes(user.id) ),
    }) )
    return this.sortTasks(
      this.filterTasks(tasks)
    );
  }

  render() {
    const tasks = this.getTasks();
    return (
      <Container>
        <Content>
          <List>
            {
              tasks.slice(0,this.state.show).map((task) => <TaskListRow task={task} key={task.id} />)
            }
          </List>
          {
            tasks.length==0 && <Text style={{padding:20}}>{i18n.t('emptyTaskList')}</Text>
        }
        {
          tasks.length > this.state.show &&
          <Button
            block
            primary
            onPress={()=>this.setState({ show: this.state.show+10 })}
            style={{margin:15}}>
            <Text>{i18n.t('loadMoreTasks')}</Text>
          </Button>
        }
      </Content>
    </Container>
  );
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ loginReducer, filterReducer, storageHelpProjects, storageHelpTasks, storageUsers, storageHelpFilters, storageHelpStatuses }) => {
  const currentUser = loginReducer;
  const { filterID, projectID  } = filterReducer;

  const { projects } = storageHelpProjects;
  const { tasks } = storageHelpTasks;
  const { users } = storageUsers;
  const { filters } = storageHelpFilters;
  const { statuses } = storageHelpStatuses;

  return {
     currentUser,
     filterID, projectID,
     projects,
     tasks,
     users,
     filters,
     statuses,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {  })(TaskList);
