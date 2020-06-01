import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';

import AddTabs from './addTabs';
import {
  snapshotToArray,
} from '../../../helperFunctions'
import {
  storageUsersStart,
  storageHelpTasksStart,
  storageHelpTaskTypesStart,
  storageHelpTripTypesStart,
  storageHelpUnitsStart,
  storageMetadataStart,
  storageCompaniesStart,
  storageHelpPricelistsStart,
  storageHelpProjectsStart,

  setInvoiceWorks,
  setInvoiceTrips,
  setInvoiceMaterials,
  setInvoiceCustomItems,
} from '../../../redux/actions';

import firebase from 'react-native-firebase';
const database = firebase.firestore();
/**
* Load all of the attributes required for the user to create a new item
* @extends Component
*/
class ItemAddLoader extends Component {
  constructor(props){
    super(props);
    this.listeners = null;
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
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
    }
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }

  }

  startListeners(){
    if(
      this.props.invoices.worksLoaded &&
      this.props.invoices.tripsLoaded &&
      this.props.invoices.materialsLoaded &&
      this.props.invoices.metadataLoaded &&
      this.props.invoices.customItemsLoaded
    ){
      return;
    }

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
    if(this.listeners === null){
      return;
    }
    this.listeners.forEach( (unsubscribe) => unsubscribe())
  }

  storageLoaded(){
    return this.props.invoices.worksLoaded &&
    this.props.invoices.tripsLoaded &&
    this.props.invoices.materialsLoaded &&
    this.props.invoices.customItemsLoaded &&

    this.props.usersLoaded &&
    this.props.tasksLoaded &&
    this.props.tripTypesLoaded &&
    this.props.taskTypesLoaded &&
    this.props.unitsLoaded &&
    this.props.metadataLoaded &&
    this.props.companiesLoaded &&
    this.props.pricelistsLoaded &&
    this.props.projectsLoaded
  }

  render() {
    if(!this.storageLoaded()){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <AddTabs
        id={this.props.id}
        workCount={ this.props.invoices.works.length }
        tripCount={ this.props.invoices.trips.length }
        materialCount={ this.props.invoices.materials.length }
        customCount={ this.props.invoices.customItems.length }
        />
    );
  }
}


//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({
  storageUsers,
  storageHelpTasks,
  storageHelpTaskTypes,
  storageHelpTripTypes,
  storageHelpUnits,
  storageMetadata,
  storageCompanies,
  storageHelpPricelists,
  storageHelpProjects,
  invoicesReducer,
}) => {
  const { usersLoaded, usersActive } = storageUsers;
  const { tasksLoaded, tasksActive } = storageHelpTasks;
  const { taskTypesLoaded, taskTypesActive  } = storageHelpTaskTypes;
  const { tripTypesLoaded, tripTypesActive } = storageHelpTripTypes;
  const { unitsLoaded, unitsActive } = storageHelpUnits;
	const { metadataLoaded, metadataActive } = storageMetadata;
  const { companiesLoaded, companiesActive } = storageCompanies;
  const { pricelistsLoaded, pricelistsActive  } = storageHelpPricelists;
  const { projectsLoaded, projectsActive } = storageHelpProjects;
  const invoices = invoicesReducer;

  return {
    usersLoaded, usersActive,
    tasksLoaded, tasksActive,
    taskTypesLoaded, taskTypesActive,
    tripTypesLoaded, tripTypesActive,
    unitsLoaded, unitsActive,
    metadataLoaded, metadataActive,
    companiesLoaded, companiesActive,
    pricelistsLoaded, pricelistsActive,
    projectsLoaded, projectsActive,
    invoices,
   };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{
  storageUsersStart,
  storageHelpTasksStart,
  storageHelpTaskTypesStart,
  storageHelpTripTypesStart,
  storageHelpUnitsStart,
  storageMetadataStart,
  storageCompaniesStart,
  storageHelpPricelistsStart,
  storageHelpProjectsStart,

  setInvoiceWorks,
  setInvoiceTrips,
  setInvoiceMaterials,
  setInvoiceCustomItems,
})(ItemAddLoader);
