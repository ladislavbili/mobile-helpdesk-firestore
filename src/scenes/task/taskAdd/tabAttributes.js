import React, { Component } from 'react';
import { Modal, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Body, Container, Content, Icon, Input, Item, Label, Text, Footer, FooterTab, Button, Picker,  ListItem, Header,Title , Left, Right, List , CheckBox } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MultiPicker from '../../../components/multiPicker';
import InputError from '../../../components/inputError'
import i18n from 'i18next';
import {  } from '../../../redux/actions';
import { formatDate,processInteger } from '../../../helperFunctions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

const noMilestone = {id:null,value:null,title:'None',label:'None',startsAt:null, endsAt: null};

/**
* Tab of the main menu that is responsible for adding a new task
* @extends Component
*/
class TabAtributes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			statusOpened:false,
			deadlineOpen: false,
		}
	}

  render() {
		const data = this.props.data;
		const setData = this.props.setData;
    const statusButtonStyle= { backgroundColor: data.status.color, flex:1 };
		const project = this.props.projects.find((project) => project.id === data.project);
		const usersWithPermissions = this.props.users.filter((user)=>(
			project &&
			project.permissions &&
			project.permissions.some((permission)=>permission.user===user.id)
		));
		const requesters =  (project && project.lockedRequester ? usersWithPermissions : this.props.users);
    let currentMilestones = this.props.milestones.filter((milestone)=>milestone.id===null || (data.project !== null && milestone.project===data.project))
    currentMilestones = [noMilestone,...currentMilestones];
    return (
      <Container>
        <Content style={{ padding: 15 }}>

          <Item inlineLabel style={{marginBottom:20, borderBottomWidth:0,marginTop:10,paddingBottom:5}} onPress={()=>setData({important:!data.important})}>
            <CheckBox checked={data.important} color='#3F51B5' onPress={()=>{setData({important:!data.important})}}/>
            <Label style={{marginLeft:15}}>{i18n.t('important')}</Label>
          </Item>

          <Text note>{i18n.t('project')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Picker
              supportedOrientations={['portrait', 'landscape']}
              iosHeader={i18n.t('selectOne')}
              mode="dropdown"
              selectedValue={data.project}
              onValueChange={(projectID)=>{
								let project  = this.props.projects.find((project)=> project.id === projectID)
								let permissionIDs = (project.permissions && project.permissions.map((permission) => permission.user)) || [];

								setData({
									project: projectID,
									milestone: noMilestone,
								});
							}}>
              {
                this.props.projects.map((project)=>
                (<Item label={project.title?project.title:''} key={project.id} value={project.id} />))
              }
            </Picker>
						<InputError
							show = {data.project === null}
							message = "restrictionMustSelectTaskProject"
							/>
          </View>

          { data.defaults.status.show && <Text note>{i18n.t('status')}</Text>}
          { data.defaults.status.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Button
							style={statusButtonStyle}
							disabled={data.defaults.status.fixed}
							onPress={()=>this.setState({statusOpened:!this.state.statusOpened})}
							>
							<Text style={{color:'white',flex:1,textAlign:'center'}}>
								{i18n.t(data.status.title)}
							</Text>
						</Button>
            {
              this.state.statusOpened && !(data.defaults.status.fixed) && this.props.statuses.map((status)=>
              !(data.status.id===status.id) &&
              <Button style={{backgroundColor:status.color,flex:1}}
								disabled={data.defaults.status.fixed}
                onPress={()=>{
                  if(status.action==='pending'){
                    let pendingDate = new Date();
                    if(data.milestone === null || data.milestone.endsAt === null){
                      pendingDate.setDate( pendingDate.getDate() + 1);
                    }else{
                      pendingDate = new Date(data.milestone.endsAt);
                    }
										pendingDate = pendingDate.getTime();
                    setData({
                      status,
                      pendingDate,
                      pendingChangable: true,
                    })
										this.setState({statusOpened: false})
                  }else if(status.action==='close'||status.action==='invalid'){
                    setData({
                      status,
                      important:false,
                      closeDate: (new Date().getTime()),
                    })
										this.setState({statusOpened: false})
                  }
                  else{
                    setData({
                      status,
                    })
										this.setState({statusOpened: false})
                  }
              }}
                key={status.id} >
                <Text style={{color:'white',flex:1,textAlign:'center'}}>{i18n.t(status.title)}</Text>
              </Button>)
            }
          </View>
					}

          { data.defaults.type.show && <Text note>{i18n.t('taskType')}</Text>}
          { data.defaults.type.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <Picker
	              supportedOrientations={['portrait', 'landscape']}
	              iosHeader={i18n.t('selectOne')}
								enabled={!(data.defaults.type.fixed)}
	              mode="dropdown"
	              selectedValue={data.type}
	              onValueChange={(value)=>{
									setData({type:value})
								}}
								>
	              {
	                this.props.taskTypes.map((type)=>
	                (<Item label={type.title?type.title:''} key={type.id} value={type.id} />))
	              }
	            </Picker>
							<InputError
								show = {data.type === null}
								message = "restrictionMustSelectTaskType"
								/>
          	</View>
					}

          <Text note>{i18n.t('milestone')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Picker
              supportedOrientations={['portrait', 'landscape']}
              iosHeader={i18n.t('selectOne')}
              mode="dropdown"
              selectedValue={data.milestone.id}
              onValueChange={(value)=>{
								let milestone = this.props.milestones.find((milestone)=> milestone.id === value);
								setData({milestone})
							}}
							>
              {
                currentMilestones.map((milestone)=>
                (<Item label={milestone.title?milestone.title:''} key={milestone.id} value={milestone.id} />))
              }
            </Picker>
          </View>


        	{ data.defaults.assignedTo.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <MultiPicker
	              options={usersWithPermissions}
	              selected={data.assignedTo}
								disabled={data.defaults.assignedTo.fixed}
	              showAttribute="email"
	              onChange={(assignedTo)=>{
									setData({assignedTo})
							}}
	              title={i18n.t('assigned')}
	              selectTitle={i18n.t('selectAssignedUsers')}
	              />
	          </View>
					}

          { data.defaults.requester.show && <Text note>{i18n.t('requester')}</Text> }
          { data.defaults.requester.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <Picker
	              supportedOrientations={['portrait', 'landscape']}
	              iosHeader={i18n.t('selectOne')}
	              mode="dropdown"
								enabled={!(data.defaults.requester.fixed)}
	              selectedValue={data.requester.id}
	              onValueChange={(value)=>{
									let requester = this.props.users.find((user)=>user.id === value);
									setData({requester})
								}}>
	              {
	                requesters.map((requester)=>
	                (<Item label={requester.email?requester.email:''} key={requester.id} value={requester.id} />))
	              }
	            </Picker>
	          </View>
				}

          { data.defaults.company.show && <Text note>{i18n.t('company')}</Text> }
          { data.defaults.company.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <Picker
	              supportedOrientations={['portrait', 'landscape']}
	              iosHeader={i18n.t('selectOne')}
	              mode="dropdown"
	              selectedValue={data.company ? data.company.id : null}
	              onValueChange={(value)=>{
									let company = this.props.companies.find((company)=> company.id === value)
									if(data.defaults.pausal.fixed){
										setData({company});
									}
									setData({company, pausal:(parseInt(company.workPausal)>0)})
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
          <Button onPress={()=>this.setState({deadlineOpen:!this.state.deadlineOpen})}><Text style={{color:'white',flex:1,textAlign:'center'}}>{data.deadline ? formatDate(data.deadline) : i18n.t('noDeadline')}</Text></Button>
          <DateTimePicker
            mode="datetime"
            isVisible={this.state.deadlineOpen}
            onConfirm={(deadline)=>{
							this.setState({deadlineOpen:false});
							setData({deadline})
					}}
            onCancel={()=>this.setState({deadlineOpen:false})}
            />
					{ data.defaults.pausal.show &&
						<Item
							inlineLabel
							style={{marginBottom:20, borderBottomWidth:0,marginTop:10,paddingBottom:5}}
							onPress= {()=>{
								if(data.defaults.pausal.fixed){
									return;
								}
								setData({pausal:!data.pausal})
							}}
							>
	            <CheckBox
								checked={data.pausal}
								color='#3F51B5'
								disabled = {data.defaults.pausal.fixed}
								onPress={()=>{ setData({pausal:!data.pausal})}}
								/>
	            <Label style={{marginLeft:15}}>{i18n.t('pausal')}</Label>
	          </Item>
					}

          { data.defaults.overtime.show &&
						<Item
							inlineLabel
							style= {{marginBottom:20, borderBottomWidth:0,marginTop:10,paddingBottom:5}}
							onPress= {()=>{
								if(data.defaults.overtime.fixed){
									return;
								}
								setData({overtime:!data.overtime})
							}}
							>
	            <CheckBox
								checked={data.overtime}
								color='#3F51B5'
								disabled = {data.defaults.overtime.fixed}
								onPress={()=>{ setData({overtime:!data.overtime})}}
								/>
	            <Label style={{marginLeft:15}}>{i18n.t('overtime')}</Label>
	          </Item>
					}
          {data.defaults.tags.show &&
						<View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
	            <MultiPicker
	              options={this.props.tags}
	              selected={data.tags}
								disabled={data.defaults.tags.fixed}
	              showAttribute="title"
	              color
	              onChange={(tags)=>{
	                setData({tags});
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
  storageHelpStatuses,
  storageHelpTags,
  storageHelpTaskTypes,
  storageHelpTasks,
  storageUsers,
  storageHelpMilestones,
  loginReducer,
   }) => {
  const { companies } = storageCompanies;
	const { statuses } = storageHelpStatuses;
	const { tags } = storageHelpTags;
	const { taskTypes } = storageHelpTaskTypes;
	const { tasks } = storageHelpTasks;
	const { users } = storageUsers;
	const { milestones } = storageHelpMilestones;
  return {
    companies,
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
