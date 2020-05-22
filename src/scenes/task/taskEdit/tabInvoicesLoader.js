import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import TabInvoices from './tabInvoices';
import { snapshotToArray } from '../../../helperFunctions';
import {
  storageUsersStart,
  storageHelpProjectsStart,
  storageHelpTasksStart,
  storageHelpTaskTypesStart,
  storageHelpTripTypesStart,
  storageHelpStatusesStart,

  setInvoiceWorks,
  setInvoiceTrips,
  setInvoiceMaterials,
  setInvoiceCustomItems,
  clearInvoices,
} from '../../../redux/actions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabInvoicesLoader extends Component {
  constructor(props){
    super(props);
    this.listeners = [];
    this.startStorage.bind(this);
    this.startStorage();
  }


  startStorage(){
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
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
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }

  }

  startListeners(){

    const listenerWorks = database.collection('help-task_works').where("task", "==", this.props.id).onSnapshot((worksReponse)=>{
      const works = snapshotToArray(worksReponse).sort((work1,work2) => work1.order - work2.order).map((works)=>({...works, generalType: 'work'}));
      this.props.setInvoiceWorks(works);
    })

    const listenerTrips = database.collection('help-task_work_trips').where("task", "==", this.props.id).onSnapshot((tripsReponse)=>{
      const trips = snapshotToArray(tripsReponse).sort((workTrip1,workTrip2) => workTrip1.order - workTrip2.order).map((trips)=>({...trips, generalType: 'trip'}));
      this.props.setInvoiceTrips(trips);
    })

    const listenerMaterials = database.collection('help-task_materials').where("task", "==", this.props.id).onSnapshot((materialsReponse)=>{
      const materials = snapshotToArray(materialsReponse).sort((material1,material2) => material1.order - material2.order).map((material)=>({...material, generalType: 'material'}));
      this.props.setInvoiceMaterials(materials);
    })

    const listenerCustomItems = database.collection('help-task_custom_items').where("task", "==", this.props.id).onSnapshot((customItemsReponse)=>{
      const customItems = snapshotToArray(customItemsReponse).sort((customItem1,customItem2) => customItem1.order - customItem2.order).map((customItems)=>({...customItems, generalType: 'custom'}));
      this.props.setInvoiceCustomItems(customItems);
    })

    this.listeners = [
      listenerMaterials,
      listenerCustomItems,
      listenerWorks,
      listenerTrips,
    ]
  }

  UNSAFE_componentWillMount(){
    this.startListeners();
  }

  componentWillUnmount(){
    this.listeners.forEach( (unsubscribe) => unsubscribe())
    this.props.clearInvoices();
  }

  storageLoaded(){
    return this.props.invoices.worksLoaded &&
    this.props.invoices.tripsLoaded &&
    this.props.invoices.materialsLoaded &&
    this.props.invoices.customItemsLoaded &&

    this.props.usersLoaded &&
    this.props.tasksLoaded &&
    this.props.projectsLoaded &&
    this.props.tripTypesLoaded &&
    this.props.taskTypesLoaded &&
    this.props.statusesLoaded
  }

  render() {
    if(!this.storageLoaded()){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    let task = this.props.tasks.find( (task) => task.id === this.props.id );
    let permission = this.props.projects.find( (project) => project.id === task.project ).permissions.find((permission) => permission.user === this.props.currentUser.id);
    let status = this.props.statuses.find((status) => status.id === task.status );
    let	viewOnly = ((permission===undefined || !permission.write) && this.props.currentUser.userData.role.value===0) || (status && status.action==='invoiced');

    let materials = this.props.invoices.materials;
    let customItems = this.props.invoices.customItems;
    let works = this.props.invoices.works.map((work)=>{
			let assignedTo=work.assignedTo?this.props.users.find((item)=>item.id===work.assignedTo):null
			return {
				...work,
				type:this.props.taskTypes.find((item)=>item.id===work.type),
				assignedTo:assignedTo?assignedTo:null
			}
		});
    let trips = this.props.invoices.trips.map((trip)=>{
			let type= this.props.tripTypes.find((item)=>item.id===trip.type);
			let assignedTo=trip.assignedTo?this.props.users.find((item)=>item.id===trip.assignedTo):null

			return {
				...trip,
				type,
				assignedTo:assignedTo?assignedTo:null
			}
		});
    return (
      <TabInvoices
        id={this.props.id}
        works={works}
        trips={trips}
        materials={materials}
        customItems={customItems}
        viewOnly = {viewOnly}
        />
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageUsers,storageHelpTasks, storageHelpProjects, storageHelpTaskTypes, storageHelpTripTypes, storageHelpStatuses, loginReducer, invoicesReducer }) => {
  const { usersLoaded, usersActive, users } = storageUsers;
  const { tasksLoaded, tasksActive, tasks } = storageHelpTasks;
  const { projectsLoaded, projectsActive, projects } = storageHelpProjects;
  const { taskTypesLoaded, taskTypesActive, taskTypes  } = storageHelpTaskTypes;
  const { tripTypesLoaded, tripTypesActive, tripTypes } = storageHelpTripTypes;
  const { statusesLoaded, statusesActive, statuses } = storageHelpStatuses;
  const invoices = invoicesReducer;

  return {
    usersLoaded, usersActive, users,
    tasksLoaded, tasksActive, tasks,
    projectsLoaded, projectsActive, projects,
    taskTypesLoaded, taskTypesActive, taskTypes,
    tripTypesLoaded, tripTypesActive, tripTypes,
    statusesLoaded, statusesActive, statuses,
    currentUser: loginReducer,
    invoices,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{
  storageUsersStart,
  storageHelpProjectsStart,
  storageHelpTasksStart,
  storageHelpTaskTypesStart,
  storageHelpTripTypesStart,
  storageHelpStatusesStart,

  setInvoiceWorks,
  setInvoiceTrips,
  setInvoiceMaterials,
  setInvoiceCustomItems,
  clearInvoices,
})(TabInvoicesLoader);
