
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, FooterTab, Container, Content, Button, Icon, Text, List } from 'native-base';
import { Actions } from 'react-native-router-flux';
//import {  } from '../../../redux/actions';
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

  filterTasksBySearch(){
    let filter = this.props.forcedFilter;
    return this.props.tasks.filter((task)=> ( task.project === this.props.projectID || this.props.projectID === 'all' )).filter((task)=>{
      let currentPermissions = null;
      if(task.project){
        let project = this.props.projects.find( (project) => project.id === task.project );
        currentPermissions = project.permissions.find((permission)=>permission.user === this.props.currentUser.id);
      }
      return (
        ( this.props.currentUser.userData.role.value===3 || ( currentPermissions && currentPermissions.read ) ) &&
        ( filter.title.length === 0 || task.title.toLowerCase().includes(filter.title.toLowerCase()) ) &&
        ( filter.requester.length === 0 || ( task.requester && filter.requester.includes(task.requester) ) ) &&
        ( filter.status.length === 0 || filter.status.includes(task.status) ) &&
        ( filter.workType.length === 0 || filter.workType.includes(task.type) ) &&
        ( filter.company.length === 0 || ( task.company && filter.company.incudes(task.company) )) &&
        ( filter.assigned.length === 0 || ( task.assignedTo && filter.assigned.every((id) => task.assignedTo.includes(id) ) ) ) &&
        ( filter.statusDateFrom === null || task.statusChange >= filter.statusDateFrom ) &&
        ( filter.statusDateTo === null || task.statusChange <= filter.statusDateTo ) &&
        ( filter.closeDateFrom === null || task.closeDate >= filter.closeDateFrom ) &&
        ( filter.closeDateTo === null || task.closeDate <= filter.closeDateTo ) &&
        ( filter.pendingDateFrom === null || task.pendingDate >= filter.pendingDateFrom ) &&
        ( filter.pendingDateTo === null || task.pendingDate <= filter.pendingDateTo )
      )
    })
  }

  filterTasks(){
    if(this.props.forcedFilter){
      return this.filterTasksBySearch();
    }else{
      return this.filterTasksByFilter();
    }
  }

  filterTasksByFilter(){
    let filter = this.props.filters.find((filter)=>filter.id === this.props.filterID );
    if(filter !== undefined){
      filter = filter.filter;
    }

    return this.props.tasks.filter((task)=> ( task.project === this.props.projectID || this.props.projectID === 'all' )).filter((task)=>{
      let currentPermissions = null;
      if(task.project){
        let project = this.props.projects.find( (project) => project.id === task.project );
        currentPermissions = project.permissions.find((permission)=>permission.user === this.props.currentUser.id);
      }
      return filter === undefined || (
        ( this.props.currentUser.userData.role.value===3 || ( currentPermissions && currentPermissions.read ) ) &&
        ( filter.requester === null || ( task.requester && task.requester === filter.requester ) || ( task.requester && filter.requester === 'cur' && task.requester === this.props.currentUser.id ) ) &&
        ( filter.workType === null || ( task.type === filter.workType ) ) &&
        ( filter.company === null || ( task.company && task.company === filter.company ) || ( task.company && filter.company==='cur' && task.company === this.props.currentUser.userData.company ) ) &&
        ( filter.assigned === null || ( task.assignedTo && task.assignedTo.includes( filter.assigned ) ) || ( task.assignedTo && filter.requester==='cur' && task.assignedTo.includes( this.props.currentUser.id ) ) ) &&
        ( filter.statusDateFrom === null || task.statusChange >= filter.statusDateFrom ) &&
        ( filter.statusDateTo === null || task.statusChange <= filter.statusDateTo ) &&
        ( filter.closeDateFrom === null || task.closeDate >= filter.closeDateFrom ) &&
        ( filter.closeDateTo === null || task.closeDate <= filter.closeDateTo ) &&
        ( filter.pendingDateFrom === null || task.pendingDate >= filter.pendingDateFrom ) &&
        ( filter.pendingDateTo === null || task.pendingDate <= filter.pendingDateTo )
      )
    })
  }

  getTasks(){
    return this.sortTasks(
      this.filterTasks().map((task)=>({...task, status:this.props.statuses.find((status)=>status.id === task.status) }))
    )
    .slice(0,this.state.show).map((task)=>{
      return {
        ...task,
        project:this.props.projects.find((project)=>project.id === task.project),
        assignedTo: this.props.users.filter((user)=>task.assignedTo.includes(user.id)),
      }
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <List>
            {
              this.getTasks().map((task) => <TaskListRow task={task} key={task.id} />)
            }
          </List>
          {
            this.filterTasks().length==0 && <Text style={{padding:20}}>{i18n.t('emptyTaskList')}</Text>
        }
        {
          this.filterTasks().length > this.state.show &&
          <Button
            block
            primary
            onPress={()=>this.setState({ show: this.state.show+10 })}
            style={{margin:15}}>
            <Text>{i18n.t('loadMoreTasks')}</Text>
          </Button>
        }
      </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={()=>{Actions.taskAdd()}}>
              <Icon name="md-add" style={{ color: 'white' }} />
              <Text style={{ color: 'white' }} >{i18n.t('task')}</Text>
            </Button>
          </FooterTab>
        </Footer>
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
