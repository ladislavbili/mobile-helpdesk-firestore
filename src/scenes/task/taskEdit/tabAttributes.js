import React, { Component } from 'react';
import { Modal, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Body, Container, Content, Icon, Input, Item, Label, Text, Footer, FooterTab, Button, Picker,  ListItem, Header,Title , Left, Right, List , CheckBox } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MultiPicker from '../../../components/multiPicker';
import i18n from 'i18next';
import {  } from '../../../redux/actions';
import { formatDate,processInteger } from '../../../helperFunctions';
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
* Tab of the main menu that is responsible for adding a new task
* @extends Component
*/
class TabAtributes extends Component {
	constructor(props) {
		super(props);
		let task = this.props.tasks.find((task)=>task.id === this.props.id);

		let project = this.props.projects.find((project)=>project.id === task.project);
		let status = this.props.statuses.find((item)=>item.id===task.status);
		let permission = project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
		let viewOnly = ((permission===undefined || !permission.write) && this.props.currentUser.userData.role.value===0)||(status && status.action==='invoiced');
		let state = {
			important: task.important||false,
			project,
			status,
			originalStatus:status,
			statusOpened:false,
			type: this.props.taskTypes.find((type)=> task.type === type.id),
			milestone: [noMilestone,...this.props.milestones].find((milestone)=> task.milestone === milestone.id),

			assignedTo: this.props.users.filter((user)=>task.assignedTo.some((userID)=>user.id === userID)),
			requester: this.props.users.find((user)=>task.requester === user.id),
			company: this.props.companies.find((item)=>item.id===task.company),

			deadline: task.deadline,
			deadlineOpen: false,

			pausal: task.pausal,
			overtime: task.overtime,
			tags: this.props.tags.filter((tag)=>task.tags.includes(tag.id)),

			defaultFields: this.getDefaults(task.project),
			submitError:true,
			newHistoryEntries:{},
			viewOnly,
			saving:false,
		}
		this.state = state;
		this.props.saveFunction(this.submitForm.bind(this));
		this.submitForm.bind(this);
		this.cantSave.bind(this);
	}

	inputChanged(){
    this.props.inputChanged(true,!this.cantSave());
  }

	getHistoryMessage(type, data){
		let user = "Používateľ " + this.props.currentUser.userData.name + ' ' + this.props.currentUser.userData.surname;
		switch (type) {
			case 'status':{
				return `${user} zmenil status z ${data.oldStatus?data.oldStatus.title:''} na ${data.newStatus?data.newStatus.title:''}.`;
			}
			case 'comment':{
				return user + ' komentoval úlohu.';
			}
			default:{
				return user + ' spravil nedefinovanú zmenu.';
			}
		}
	}

	addNotifications(){
		let history = this.state.newHistoryEntries;
		Object.values(history)
		.filter((entry)=>entry !== null)
		.forEach((entry)=>{
			this.addNotification(entry,false);
			this.addToHistory(entry);
		});
		this.setState({newHistoryEntries:{}, originalStatus:this.state.status});
	}

	addToHistory(entry){
		database.collection('help-task_history').add(entry);
	}

	addNotification(originalEvent,internal){
		let event = {
			...originalEvent,
			read:false
		}
		let usersToNotify=[...this.state.assignedTo.filter((user)=>!internal || this.getPermissions(user.id).internal)];
		if( this.state.requester && (!internal || this.getPermissions(this.state.requester.id).internal) && !usersToNotify.some((user)=>user.id===this.state.requester.id)){
			usersToNotify.push(this.state.requester);
		}
		usersToNotify = usersToNotify.filter((user)=>user.id!==this.props.currentUser.id);
		usersToNotify.forEach((user)=>{
			database.collection('user_notifications').add({ ...event, user: user.id }).then((newNotification)=>{
				if(user.mailNotifications){
					firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
						fetch('https://api01.lansystems.sk:8080/send-notification',{ //127.0.0.1 https://api01.lansystems.sk:8080
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'POST',
						body:JSON.stringify({
							message:`
							<div>
								<h4>Nové upozornenie</h4>
								<p>Zmena: ${event.message}</p>
								<p>V úlohe: ${event.task}: ${this.state.title}</p>
								<p>Odkaz: https://lanhelpdesk2019.lansystems.sk/helpdesk/notifications/${newNotification.id}/${event.task}</p>
							</div>
							`,
							tos:[user.email],
							subject:`Upozornenie na zmenu: ${event.message}`,
							token,
						}),
					}).then((response)=>response.json().then((response)=>{
						if(response.error){
						}
					})).catch((error)=>{
						console.log(error);
					});
					});
				}
			});
		})
	}


	submitForm(){
		if(this.cantSave()){
			return;
		}
		this.setState({saving:true})
		let taskID = this.props.id;
		let statusAction = this.state.status.action;
		let invoicedDate = null;
		if(statusAction==='invoiced'){
			invoicedDate = isNaN(new Date(this.state.invoicedDate).getTime()) ? (new Date()).getTime() : new Date(this.state.invoicedDate).getTime()
		}

		let body = {
			company: this.state.company ? this.state.company.id : null,
			workHours: this.state.workHours,
			requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
			status: this.state.status?this.state.status.id:null,
			statusChange: this.state.statusChange,
			project: this.state.project?this.state.project.id:null,
			pausal: this.state.pausal,
			overtime: this.state.overtime,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
			milestone:this.state.milestone.id,
			deadline: this.state.deadline!==null?this.state.deadline:null,
			closeDate: (this.state.closeDate!==null && (statusAction==='close'||statusAction==='invoiced'|| statusAction==='invalid'))?this.state.closeDate:null,
			pendingDate: (this.state.pendingDate!==null && statusAction==='pending')?this.state.pendingDate:null,
			pendingChangable: this.state.pendingChangable,
			invoicedDate,
			important:this.state.important,
		}
		database.collection('help-tasks').doc(taskID).update(body).then((resp)=>{
			this.setState({saving:false});
			this.props.inputChanged(false, !this.cantSave());
			this.addNotifications();
		});
	}

	cantSave(){
		return this.state.status===null || this.state.project === null||this.state.saving||this.state.viewOnly;
	}

	setDefaults(projectID){
    this.setState({defaultFields:this.getDefaults(projectID)});
  }

  getDefaults(projectID){
    if(projectID===null){
      return noDef;
    }
    let project = this.props.projects.find((project)=>project.id===projectID);
    if(!project){
      return noDef;
    }
    return {...noDef,...project.def}
  }



  render() {
    let statusButtonStyle={backgroundColor:this.state.status.color,flex:1};
    let currentMilestones = this.props.milestones.filter((milestone)=>milestone.id===null || (this.state.project !== null && milestone.project===this.state.project.id))
    currentMilestones = [noMilestone,...currentMilestones];
    return (
      <Container>
        <Content style={{ padding: 15 }}>

          <Item inlineLabel style={{marginBottom:20, borderBottomWidth:0,marginTop:10,paddingBottom:5}} onPress={()=>this.setState({important:!this.state.important},this.inputChanged.bind(this))}>
            <CheckBox checked={this.state.important} color='#3F51B5' onPress={()=>{this.setState({important:!this.state.important},this.inputChanged.bind(this))}}/>
            <Label style={{marginLeft:15}}>{i18n.t('important')}</Label>
          </Item>

          <Text note>{i18n.t('project')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Picker
              supportedOrientations={['portrait', 'landscape']}
              iosHeader={i18n.t('selectOne')}
              mode="dropdown"
              selectedValue={this.state.project.id}
              onValueChange={(projectID)=>{
								let project  = this.props.projects.find((project)=> project.id === projectID)
								let permissionIDs = project.permissions.map((permission) => permission.user);
								let assignedTo=this.state.assignedTo.filter((user)=>permissionIDs.includes(user.id));

								this.setState({
									project,
									assignedTo,
									milestone:noMilestone,
								},()=>{this.setDefaults(project.id)});
							}}>
              {
                this.props.projects.filter((project)=>{
                  let curr = this.props.currentUser;
                  if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
                    return true;
                  }
                  let permission = project.permissions.find((permission)=>permission.user===curr.id);
                  return permission && permission.read;
                }).map((project)=>
                (<Item label={project.title?project.title:''} key={project.id} value={project.id} />))
              }
            </Picker>
            {this.state.submitError && this.state.project===null && <Text style={{color:'red'}}>{i18n.t('restrictionMustSelectTaskProject')}</Text>}
          </View>

          { this.state.defaultFields.status.show && <Text note>{i18n.t('status')}</Text>}
          { this.state.defaultFields.status.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Button style={statusButtonStyle} disabled={this.state.defaultFields.status.fixed||this.state.viewOnly} onPress={()=>this.setState({statusOpened:!this.state.statusOpened})}><Text style={{color:'white',flex:1,textAlign:'center'}}>{this.state.status.title}</Text></Button>
            {
              this.state.statusOpened && !(this.state.defaultFields.status.fixed||this.state.viewOnly) && this.props.statuses.map((status)=>
              !(this.state.status.id===status.id) &&
              <Button style={{backgroundColor:status.color,flex:1}}
								disabled={this.state.defaultFields.status.fixed||this.state.viewOnly}
                onPress={()=>{
                  let newHistoryEntry = {
                    createdAt:(new Date()).getTime(),
                    message:this.getHistoryMessage('status', {newStatus:status,oldStatus:this.state.originalStatus}),
                    task:this.props.id,
                  };
                  if(status.action==='pending'){
                    let pendingDate = new Date();
                    if(this.state.milestone === null || this.state.milestone.endsAt === null){
                      pendingDate.setDate( pendingDate.getDate() + 1);
                    }else{
                      pendingDate = new Date(this.state.milestone.endsAt);
                    }
										pendingDate = pendingDate.getTime();
                    this.setState({
                      status,
                      pendingDate,
                      pendingChangable: true,
                      statusChange: (new Date()).getTime(),
                      statusOpened: false,
											newHistoryEntries: {...this.state.newHistoryEntries, status: (this.state.originalStatus.id === status.id ? null : newHistoryEntry) },
                    },this.inputChanged.bind(this))
                  }else if(status.action==='close'||status.action==='invalid'){
                    this.setState({
                      status,
                      important:false,
                      statusChange:(new Date().getTime()),
                      statusOpened: false,
                      closeDate: (new Date().getTime()),
											newHistoryEntries: {...this.state.newHistoryEntries, status: (this.state.originalStatus.id === status.id ? null : newHistoryEntry) },
                    },this.inputChanged.bind(this))
                  }
                  else{
                    this.setState({
                      status,
                      statusChange:(new Date().getTime()),
                      statusOpened: false,
                      newHistoryEntries: {...this.state.newHistoryEntries, status: (this.state.originalStatus.id === status.id ? null : newHistoryEntry) },
                    },this.inputChanged.bind(this))
                  }
              }}
                key={status.id} >
                <Text style={{color:'white',flex:1,textAlign:'center'}}>{status.title}</Text>
              </Button>)
            }
          </View>
					}

          { this.state.defaultFields.type.show && <Text note>{i18n.t('type')}</Text>}
          { this.state.defaultFields.type.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <Picker
	              supportedOrientations={['portrait', 'landscape']}
	              iosHeader={i18n.t('selectOne')}
								enabled={!(this.state.defaultFields.type.fixed||this.state.viewOnly)}
	              mode="dropdown"
	              selectedValue={this.state.type.id}
	              onValueChange={(value)=>{
									let type = this.props.taskTypes.find((type)=>type.id === value);
									this.setState({type},this.inputChanged.bind(this))
								}}
								>
	              {
	                this.props.taskTypes.map((type)=>
	                (<Item label={type.title?type.title:''} key={type.id} value={type.id} />))
	              }
	            </Picker>
	            {this.state.submitError && this.state.type===null && <Text style={{color:'red'}}>{i18n.t('restrictionMustSelectTaskType')}</Text>}
          	</View>
					}

          <Text note>{i18n.t('milestone')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Picker
              supportedOrientations={['portrait', 'landscape']}
              iosHeader={i18n.t('selectOne')}
              mode="dropdown"
              selectedValue={this.state.milestone.id}
              onValueChange={(value)=>{
								let milestone = this.props.milestones.find((milestone)=> milestone.id === value);
								this.setState({milestone},this.inputChanged.bind(this))
							}}
							>
              {
                currentMilestones.map((milestone)=>
                (<Item label={milestone.title?milestone.title:''} key={milestone.id} value={milestone.id} />))
              }
            </Picker>
          </View>


        	{ this.state.defaultFields.assignedTo.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <MultiPicker
	              options={this.props.users}
	              selected={this.state.assignedTo}
								disabled={this.state.defaultFields.assignedTo.fixed||this.state.viewOnly}
	              showAttribute="email"
	              onChange={(assignedTo)=>{
									this.setState({assignedTo},this.inputChanged.bind(this))
							}}
	              title={i18n.t('assigned')}
	              selectTitle={i18n.t('selectAssignedUsers')}
	              />
	          </View>
					}

          { this.state.defaultFields.requester.show && <Text note>{i18n.t('requester')}</Text> }
          { this.state.defaultFields.requester.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <Picker
	              supportedOrientations={['portrait', 'landscape']}
	              iosHeader={i18n.t('selectOne')}
	              mode="dropdown"
								enabled={!(this.state.defaultFields.requester.fixed||this.state.viewOnly)}
	              selectedValue={this.state.requester.id}
	              onValueChange={(value)=>{
									let requester = this.props.users.find((user)=>user.id === value);
									this.setState({requester},this.inputChanged.bind(this))
								}}>
	              {
	                this.props.users.map((requester)=>
	                (<Item label={requester.email?requester.email:''} key={requester.id} value={requester.id} />))
	              }
	            </Picker>
	          </View>
				}

          { this.state.defaultFields.company.show && <Text note>{i18n.t('company')}</Text> }
          { this.state.defaultFields.company.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <Picker
	              supportedOrientations={['portrait', 'landscape']}
	              iosHeader={i18n.t('selectOne')}
	              mode="dropdown"
	              selectedValue={this.state.company.id}
	              onValueChange={(value)=>{
									let company = this.props.companies.find((company)=> company.id === value)
									if(this.state.defaultFields.pausal.fixed){
										this.setState({company},this.inputChanged.bind(this));
									}
									this.setState({company, pausal:(parseInt(company.workPausal)>0)},this.inputChanged.bind(this))
								}}
								>
	              {
	                this.props.companies.map((company)=>
	                (<Item label={company.title ? company.title : '' } key={company.id} value={company.id} />))
	              }
	            </Picker>
	          </View>
				}

          <Text note>{i18n.t('deadline')}</Text>
          <Button onPress={()=>this.setState({deadlineOpen:!this.state.deadlineOpen})}><Text style={{color:'white',flex:1,textAlign:'center'}}>{this.state.deadline ? formatDate(this.state.deadline) : i18n.t('noDeadline')}</Text></Button>
          <DateTimePicker
            mode="datetime"
            isVisible={this.state.deadlineOpen}
            onConfirm={(deadline)=>{this.setState({deadline,deadlineOpen:false},this.inputChanged.bind(this))}}
            onCancel={()=>this.setState({deadlineOpen:false})}
            />
					{ this.state.defaultFields.pausal.show &&
						<Item
							inlineLabel
							style={{marginBottom:20, borderBottomWidth:0,marginTop:10,paddingBottom:5}}
							onPress= {()=>{
								if(this.state.viewOnly||this.state.defaultFields.pausal.fixed){
									return;
								}
								this.setState({pausal:!this.state.pausal},this.inputChanged.bind(this))
							}}
							>
	            <CheckBox
								checked={this.state.pausal}
								color='#3F51B5'
								disabled = {this.state.viewOnly||this.state.defaultFields.pausal.fixed}
								onPress={()=>{ this.setState({pausal:!this.state.pausal},this.inputChanged.bind(this))}}
								/>
	            <Label style={{marginLeft:15}}>{i18n.t('pausal')}</Label>
	          </Item>
					}

          { this.state.defaultFields.overtime.show &&
						<Item
							inlineLabel
							style= {{marginBottom:20, borderBottomWidth:0,marginTop:10,paddingBottom:5}}
							onPress= {()=>{
								if(this.state.viewOnly||this.state.defaultFields.overtime.fixed){
									return;
								}
								this.setState({overtime:!this.state.overtime},this.inputChanged.bind(this))
							}}
							>
	            <CheckBox
								checked={this.state.overtime}
								color='#3F51B5'
								disabled = {this.state.viewOnly||this.state.defaultFields.overtime.fixed}
								onPress={()=>{ this.setState({overtime:!this.state.overtime},this.inputChanged.bind(this))}}
								/>
	            <Label style={{marginLeft:15}}>{i18n.t('overtime')}</Label>
	          </Item>
					}
          {this.state.defaultFields.tags.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <MultiPicker
	              options={this.props.tags}
	              selected={this.state.tags}
								disabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
	              showAttribute="title"
	              color
	              onChange={(tags)=>{
	                this.setState({tags},this.inputChanged.bind(this));
	              }}
	              title={i18n.t('tags')}
	              selectTitle={i18n.t('selectTags')}
	              />
	          </View>
					}
        </Content>
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({
  storageCompanies,
  storageHelpProjects,
  storageHelpStatuses,
  storageHelpTags,
  storageHelpTaskTypes,
  storageHelpTasks,
  storageUsers,
  storageHelpMilestones,
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
  return {
    companies,
    projects,
    statuses,
    tags,
    taskTypes,
    tasks,
    users,
    milestones,
    currentUser: loginReducer,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{})(TabAtributes);
