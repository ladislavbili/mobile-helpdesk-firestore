import React, { Component } from 'react';
import { Tab, Tabs, Container, Header, Title, Button, Icon, Left, Right, Body} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ActivityIndicator, Alert, BackHandler } from 'react-native';

import TabDescription from './tabDescription';
import TabAttributes from './tabAttributes';
import i18n from 'i18next';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

const booleanSelects = [{value:false,label:'No'},{value:true,label:'Yes'}];

const noDef={
	status:{def:false, fixed:false, value: null, show: true },
	tags:{def:false, fixed:false, value: [], show: true },
	assignedTo:{def:false, fixed:false, value: [], show: true },
	type:{def:false, fixed:false, value: null, show: true },
	requester:{def:false, fixed:false, value: null, show: true },
	company:{def:false, fixed:false, value: null, show: true },
	pausal:{def:false, fixed:false, value: booleanSelects[0], show: true },
	overtime:{def:false, fixed:false, value: booleanSelects[0], show: true },
}

const noMilestone = {id:null,value:null,title:'None',label:'None',startsAt:null, endsAt: null};

/**
 * This component creates a main menu for the task editting
 * @extends Component
 */
class TaskAddTabs extends Component {
  constructor(props){
    super(props);
    const requester = this.props.users.find( (user) => user.id === this.props.currentUser.id );
    const company = requester ? this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company) : this.props.companies[0];
		const status = this.props.statuses.find((item)=>item.title === 'New');
		this.state = {
      title: '',
			company,
			important: false,
			workHours: '0',
			requester: this.props.currentUser.id,
			assignedTo: [],
			description: '<p><br></p>',
			status: status || this.props.statuses[0],
			deadline: null,
			closeDate: null,
			pendingDate: null,
			project: null,
			milestone: noMilestone,
			tags: [],
			pausal: false,
			overtime: false,
			type: this.props.taskTypes[0].id,
			repeat: null,
			pendingChangable: false,

      defaultsLoaded: false,
      defaults: noDef,
      saving: false,
    }
		this.canSave.bind(this);
  }

  getProjects(){
    return this.props.projects.filter((project)=>{
      let curr = this.props.currentUser;
      if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
        return true;
      }
      let permission = project.permissions && project.permissions.find((permission)=>permission.user === curr.id);
      return permission && permission.write;
    })
  }

	canSave(){
		return this.state.title !== '' &&
		this.state.status !== null &&
		this.state.project !== null
	}

  setDefaults(projectID){
		if(projectID === 'all'){
			this.setState({defaults:noDef, defaultsLoaded: true });
			return;
		}
		let project = this.props.projects.find((proj)=>proj.id === projectID);
		let def = project.def;
			if(!def){
				this.setState({defaults:noDef, defaultsLoaded: true });
				return;
			}


			let permissionIDs = (project && project.permissions) ? project.permissions.map((permission) => permission.user):[];
			let assignedTo = this.state.assignedTo.filter((user)=>permissionIDs.includes(user.id));

			let requester = this.props.currentUser.id;
			if(def.requester && (def.requester.fixed||def.requester.def)){
				let newRequester = this.props.users.find((user)=> user.id === def.requester.value);
				if(newRequester){
					requester = newRequester.id;
				}
			}
			assignedTo = (
				(def.assignedTo && (def.assignedTo.fixed||def.assignedTo.def)) ?
				this.props.users.filter((user) => def.assignedTo.value.includes(user.id)) :
				assignedTo
			)
			this.setState({
				assignedTo,
				company: def.company && (def.company.fixed||def.company.def) ? this.props.companies.find((item)=> item.id === def.company.value) : (this.props.companies && requester ? this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company) : null),
				requester,
				status: def.status && (def.status.fixed||def.status.def) ? this.props.statuses.find((item)=> item.id === def.status.value) : this.state.status,
				tags: def.tags && (def.tags.fixed||def.tags.def) ? this.props.tags.filter((item)=> def.tags.value.includes(item.id)).map((tag) => tag.id) : this.state.tags,
				type: def.type && (def.type.fixed||def.type.def) ? this.props.taskTypes.find((item)=> item.id === def.type.value).id : this.state.type,
				overtime: def.overtime && (def.overtime.fixed||def.overtime.def) ? def.overtime.value : this.state.overtime,
				pausal: def.pausal && (def.pausal.fixed||def.pausal.def) ? def.pausal.value : this.state.pausal,
				project,
				defaults: def,
        defaultsLoaded: true,
			});
	}

  UNSAFE_componentWillMount(){
    this.setDefaults(this.props.projectID);
  }

	setData( data ){
		if( data.project ){
			this.setDefaults(data.project);
		}
		this.setState(data)
	}

	addTask(){
		this.setState({ saving: true })
		const statusAction = this.state.status.action;
		const newID = (parseInt(this.props.newTaskID)+1)+"";
		let body = {
			title: this.state.title,
			company: this.state.company?this.state.company.id:null,
			important: this.state.important,
			workHours: this.state.workHours,
			requester: this.state.requester? this.state.requester: this.props.currentUser.id,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
			description: this.state.description,
			status: this.state.status?this.state.status.id:null,

			deadline: this.state.deadline!==null?this.state.deadline:null,
			closeDate: (this.state.closeDate!==null && (statusAction==='close'||statusAction==='invoiced'|| statusAction==='invalid'))?this.state.closeDate:null,
			pendingDate: (this.state.pendingDate!==null && statusAction==='pending')?this.state.pendingDate:null,
			pendingChangable: this.state.pendingChangable,

			createdAt: (new Date()).getTime(),
			createdBy: this.props.currentUser.id,
			statusChange: (new Date()).getTime(),
			project: this.state.project ? this.state.project : null,
			pausal: this.state.pausal,
			overtime: this.state.overtime,
			milestone: this.state.milestone.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type ? this.state.type : null,
			repeat: null,
		}
		database.collection('help-tasks').doc(newID).set(body).then(()=>{
			database.collection('metadata').doc('0').update({taskLastID:newID}).then(()=>{
				this.setState({ saving: false })
				Actions.pop()
			})
		})
	}

  render() {
    if( !this.state.defaultsLoaded ){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={Actions.pop}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{i18n.t('addTask')}</Title>
          </Body>
          {
            this.canSave() && (<Right>
              <Button transparent style={{borderColor: '#FFF', borderWidth: 1, borderRadius:0}} disabled={this.state.saving} onPress={this.addTask.bind(this)}>
                <Icon active style={{ color: 'white', padding:10 }} name="ios-checkmark-circle-outline" />
              </Button>
            </Right>)
          }
        </Header>
        <Tabs>
          <Tab heading={i18n.t('description')}>
            <TabDescription data={this.state} setData={this.setData.bind(this)} />
          </Tab>
          <Tab heading={i18n.t('attributes')}>
            <TabAttributes data={this.state} setData={this.setData.bind(this)} projects={this.getProjects()} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const mapStateToProps = ({
  storageCompanies,
  storageHelpProjects,
  storageHelpStatuses,
  storageHelpTags,
  storageHelpTaskTypes,
  storageHelpTasks,
  storageUsers,
  storageHelpMilestones,
	storageMetadata,

  filterReducer,
  loginReducer,
   }) => {
  const { companies } = storageCompanies;
  const { projects } = storageHelpProjects;
  const { statuses } = storageHelpStatuses;
  const { tags } = storageHelpTags;
  const { taskTypes } = storageHelpTaskTypes;
  const { tasks } = storageHelpTasks;
  const { users } = storageUsers;
  const { milestones } = storageHelpMilestones;
  const { metadata, metadataLoaded } = storageMetadata;

  const currentUser = loginReducer;
  const { projectID } = filterReducer;
	const newTaskID =  metadataLoaded ? metadata.taskLastID : null
  return {
    companies,
    projects,
    statuses,
    tags,
    taskTypes,
    tasks,
    users,
    milestones,
		newTaskID,

    projectID,
    currentUser,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{})(TaskAddTabs);
