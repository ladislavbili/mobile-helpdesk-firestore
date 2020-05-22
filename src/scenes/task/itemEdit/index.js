import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { getFirebaseItem } from '../../../helperFunctions';
import { Actions } from 'react-native-router-flux';
import { Toast, Root, Container, Header, Left, Button, Icon, Title, Body, View } from 'native-base';
import i18n from 'i18next';

import EditItem from './editItem';
import {
  storageUsersStart,
  storageHelpTasksStart,
  storageHelpTaskTypesStart,
  storageHelpTripTypesStart,
  storageHelpUnitsStart,
  storageHelpProjectsStart,
} from '../../../redux/actions';
import firebase from 'react-native-firebase';
const database = firebase.firestore();

/**
* Load all of the attributes required for the user to create a new item
* @extends Component
*/
class ItemEditLoader extends Component {
  constructor(props){
    super(props);
    this.state = {
      editItem: null,
      editItemLoaded: false,
      error: false,
    }
    this.startStorage.bind(this);
    this.startStorage();
  }


  startStorage(){
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.tasksActive){
      this.props.storageHelpTasksStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    if(!this.props.unitsActive){
      this.props.storageHelpUnitsStart();
    }
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }

  }

  storageLoaded(){
    return this.props.usersLoaded &&
    this.props.tasksLoaded &&
    this.props.tripTypesLoaded &&
    this.props.taskTypesLoaded &&
    this.props.unitsLoaded &&
    this.props.projectsLoaded &&
    this.state.editItemLoaded
  }

  UNSAFE_componentWillMount(){
    let collection = null;
    switch (this.props.generalType) {
      case 'work': {
        collection = 'help-task_works';
        break;
      }
      case 'trip': {
        collection = 'help-task_work_trips';
        break;
      }
      case 'material': {
        collection = 'help-task_materials';
        break;
      }
      case 'custom': {
        collection = 'help-task_custom_items';
        break;
      }
      default: {
        collection = null;
        break;
      }
    }
    if(collection === null){
      return;
    }
    database.collection(collection).doc(this.props.id).get().then((response)=>{
      const editItem = getFirebaseItem(response);
      if( editItem === null ){
        this.setState({ error: true })
        Toast.show({
            text: "Item doesn't exists!",
            buttonText: 'Hide',
            type: 'danger',
            duration: 10000,
            position: 'top',
            style: { marginTop: 50 }
          })
      }else{
        this.setState({ editItem, editItemLoaded: true })
      }
    })
  }

  getTitle(){
    if(this.state.error){
      return i18n.t('errorItemNotFound')
    }else if( !this.storageLoaded() ){
      return i18n.t('loadingItem')
    }
    if(this.props.generalType === 'trip'){
      return `${i18n.t('trip')}: ${this.props.tripTypes.find((tripType)=>tripType.id === this.state.editItem.type).title}`
    }
    return `${i18n.t('editingItem')}: ${this.state.editItem.title}`
  }

  render() {
    return (
      <Root>
      <Container>
        <Header>
          <Button transparent onPress={() => Actions.pop()}>
            <Icon name="arrow-back" />
          </Button>
          <Title style={{marginTop:'auto', marginBottom: 'auto', marginRight: 'auto', paddingLeft: 10}} >{ this.getTitle() }</Title>
        </Header>
        { !this.storageLoaded() &&
          <ActivityIndicator
          animating size={ 'large' }
          color='#007299' />
        }
        { this.storageLoaded() &&
          <EditItem type={this.props.generalType} id={this.props.id} item={this.state.editItem} />
        }
      </Container>
    </Root>
    )
  }
}


//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({
  storageUsers,
  storageHelpTasks,
  storageHelpTaskTypes,
  storageHelpTripTypes,
  storageHelpUnits,
  storageHelpProjects,
}) => {
  const { usersLoaded, usersActive } = storageUsers;
  const { tasksLoaded, tasksActive } = storageHelpTasks;
  const { taskTypesLoaded, taskTypesActive  } = storageHelpTaskTypes;
  const { tripTypesLoaded, tripTypesActive, tripTypes } = storageHelpTripTypes;
  const { unitsLoaded, unitsActive } = storageHelpUnits;
  const { projectsLoaded, projectsActive } = storageHelpProjects;

  return {
    usersLoaded, usersActive,
    tasksLoaded, tasksActive,
    taskTypesLoaded, taskTypesActive,
    tripTypesLoaded, tripTypesActive, tripTypes,
    unitsLoaded, unitsActive,
    projectsLoaded, projectsActive,
   };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{
  storageUsersStart,
  storageHelpTasksStart,
  storageHelpTaskTypesStart,
  storageHelpTripTypesStart,
  storageHelpUnitsStart,
  storageHelpProjectsStart,
})(ItemEditLoader);
