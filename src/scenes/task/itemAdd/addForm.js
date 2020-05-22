import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Picker, Item, Footer, FooterTab, Container, Header, Title, Content, Button, Icon, Text, Left, Body, View, Right, Toast, Root } from 'native-base';
import { Actions } from 'react-native-router-flux';
import InputError from '../../../components/inputError'
import i18n from 'i18next';
import firebase from 'react-native-firebase';
const database = firebase.firestore();

const inputWrapperStyle = {
  marginTop: 15,
};



/**
* Allows the user to create a single item assigned to the task
* @extends Component
*/
class AddForm extends Component {
  constructor(props) {
    super(props);
    this.getUsers.bind(this);
    this.setNumericValue.bind(this);
    this.getDefaultState.bind(this);
    this.state = this.getDefaultState();
  }

  getDefaultState(){
    let newMaterialUnit = this.props.units.find((item)=>item.id===this.props.metadata.defaultUnit);
    if(newMaterialUnit === undefined && this.props.units.length > 0){
      newMaterialUnit = this.props.units[0];
    }
    if(newMaterialUnit === undefined){
      newMaterialUnit = null;
    }else{
      newMaterialUnit = newMaterialUnit.id;
    }
    const task = this.props.tasks.find( (task) => task.id === this.props.id );
    const company = this.props.companies.find((company) => company.id === task.company );
    const project = this.props.projects.find((project) => project.id === task.project );

    this.permissions = project !== undefined ? project.permissions : null;
    this.pricelist = null;
    if(company){
      this.pricelist = this.props.pricelists.find((pricelist) => pricelist.id === company.pricelist)
    }

    let margin = "0";
    if(this.pricelist){
      margin = this.pricelist.materialMargin+'';
    }
    const users = this.getUsers();
    return {
      done: false, // W, T, M, C - nemenitelne
      title: '', // W, M, C
      workType: this.props.taskTypes.length > 0 ? this.props.taskTypes[0].id : null, // W
      tripType: this.props.tripTypes.length > 0 ? this.props.tripTypes[0].id : null, // T
      assignedTo: users.length > 0 ? users[0].id : null , // W, T
      quantity: '1', // W, T, M, C
      discount: '0', // W, T, M
      unit: newMaterialUnit || (this.props.units.length > 0 ? this.props.units[0].id : null), // M, C
      margin, // M - nacitat, menitelne
      price: '0', // M, C

      submitting: false,
    }
  }

  /**
  * Set's item's value if the input string is a valid decimal number
  * @param {string} input number entered by the user
  */
  setNumericValue(input, type){
    if(input === '' || input.match(/^-?\d*(\.\d*)?$/)){
      let change = { }
      change[type] = input;
      this.setState(change);
    }
  }

  /**
  * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
  */
  submit(){
    if(!this.canSave()){
      return;
    }
    this.setState({ submitting: true })
    switch (this.props.type) {
      case 'work':{
        database.collection('help-task_works').add({
        done: false,
        title: this.state.title,
        type: this.state.workType,
        quantity: this.state.quantity,
        discount: this.state.discount,
        assignedTo: this.state.assignedTo,
        order: this.props.count,
        task: this.props.id,
      }).then(() => {
        this.setState( this.getDefaultState() , ()=>{
          Toast.show({
              text: 'Item added!',
              buttonText: 'Hide',
              type: 'success',
              duration: 3000,
              style: { marginBottom: 75 },
            })
        })

      })
        return;
      }
      case 'trip':{
        database.collection('help-task_work_trips').add({
        done: false,
        type: this.state.tripType,
        assignedTo: this.state.assignedTo,
        quantity: this.state.quantity,
        discount: this.state.discount,
        order: this.props.count,
        task: this.props.id,
      }).then(() => {
        this.setState( this.getDefaultState() , ()=>{
          Toast.show({
              text: 'Item added!',
              buttonText: 'Hide',
              type: 'success',
              duration: 3000,
              style: { marginBottom: 75 },
            })
        })

      })
        return;
      }
      case 'material':{
        database.collection('help-task_materials').add({
        done: false,
        title: this.state.title,
        margin: this.state.margin,
        price: this.state.price,
        quantity: this.state.quantity,
        unit: this.state.unit,
        order: this.props.count,
        task: this.props.id,
      }).then(() => {
        this.setState( this.getDefaultState() , ()=>{
          Toast.show({
              text: 'Item added!',
              buttonText: 'Hide',
              type: 'success',
              duration: 3000,
              style: { marginBottom: 75 },
            })
        })

      })
        return;
      }
      case 'custom':{
        database.collection('help-task_custom_items').add({
        done: false,
        title: this.state.title,
        price: this.state.price,
        quantity: this.state.quantity,
        unit: this.state.unit,
        order: this.props.count,
        task: this.props.id,
      }).then(() => {
        this.setState( this.getDefaultState() , ()=>{
          Toast.show({
              text: 'Item added!',
              buttonText: 'Hide',
              type: 'success',
              duration: 3000,
              style: { marginBottom: 75 },
            })
        })

      })
        return;
      }
      default: {
        return;
      };
    }
  }

  canSave(){
    const state = this.state;
    switch (this.props.type) {
      case 'trip':{
        return state.tripType !== null && state.assignedTo !== null && state.quantity !== '';
      }
      case 'work':{
        return state.title !== '' && state.workType !== null && state.assignedTo !== null && state.quantity !== '';

      }
      case 'material':{
        return state.title !== '' && state.quantity !== '' && state.unit !== null && state.price !== '';

      }
      case 'custom':{
        return state.title !== '' && state.quantity !== '' && state.unit !== null && state.price !== '';

      }
      default: return false;
    }
  }

  getUsers(){
    return this.props.users.filter( this.filterUser.bind(this) );
  }

  filterUser(user){
    const permission = this.permissions.find((permission) => permission.user === user.id)
    if(permission === undefined){
      return false
    }
    return permission.read;
  }

  render() {
    if(this.props.permissions === null && ['work','trip'].includes(this.props.type)){
      return(<Text note style={{color:'red'}}>{i18n.t('cantCreateWorkAndTripsNoProject')}</Text>)
    }
    let users = this.getUsers();
    if(users.length === 0 && ['work','trip'].includes(this.props.type)){
      return(<Text note style={{color:'red'}}>{i18n.t('cantCreateWorkAndTripsNoUsers')}</Text>)
    }
    return (
      <Root>
      <Container>
      <Content style={{ margin: 15 }}>
        { ['work','material','custom'].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('title')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Input
                value={this.state.title}
                placeholder={i18n.t('enterTitle')}
                onChangeText={ value => this.setState({title:value}) }
                />
            </View>
            <InputError
              show = {this.state.title.length === 0}
              message = "errorEnterItemTitle"
              />
          </View>
        }

        { ['work'].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('workTypeSelect')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Picker
                supportedOrientations={['portrait', 'landscape']}
                selectedValue={this.state.workType}
                onValueChange={(value)=>this.setState({workType:value})}>
                {this.props.taskTypes.map( (type)=>
                  <Item label={type.title} key={type.id} value={type.id} />
                )}
              </Picker>
            </View>
            <InputError
              show = {this.state.workType === null}
              message = "errorSelectWorkType"
              />
          </View>
        }

        { ['trip'].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('tripTypeSelect')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Picker
                supportedOrientations={['portrait', 'landscape']}
                selectedValue={this.state.tripType}
                onValueChange={(value)=>this.setState({tripType:value})}>
                {this.props.tripTypes.map( (tripType) =>
                  <Item label={tripType.title} key={tripType.id} value={tripType.id} />
                )}
              </Picker>
            </View>
            <InputError
              show = {this.state.tripType === null}
              message = "errorSelectTripType"
              />
          </View>
        }

        { ['work','trip'].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('assignedToSelect')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Picker
                supportedOrientations={['portrait', 'landscape']}
                selectedValue={this.state.assignedTo}
                onValueChange={(value)=>this.setState({assignedTo:value})}>
                {users.map( (user) =>
                  <Item label={user.email} key={user.id} value={user.id} />
                )}
              </Picker>
            </View>
            <InputError
              show = {this.state.assignedTo === null}
              message = "errorSelectAssignedTo"
              />
          </View>
        }

        { ['work','trip','material','custom'].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('quantity')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Input
                value={this.state.quantity}
                placeholder={i18n.t('enterQuantity')}
                keyboardType='numeric'
                onChangeText={ value => this.setNumericValue(value, 'quantity') }
                />
            </View>
            <InputError
              show = {this.state.quantity === ''}
              message = "errorEnterItemQuantity"
              />
          </View>
        }

        { [].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('discount')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Input
                value={this.state.discount}
                placeholder={i18n.t('enterDiscount')}
                keyboardType='numeric'
                onChangeText={ value => this.setNumericValue(value, 'discount') }
                />
            </View>
            <InputError
              show = {this.state.quantity === ''}
              message = "errorEnterItemDiscount"
              />
          </View>
        }

        { ['material','custom'].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('unitSelect')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Picker
                supportedOrientations={['portrait', 'landscape']}
                selectedValue={this.state.unit}
                onValueChange={(value)=>this.setState({unit:value})}>
                {this.props.units.map( (unit) =>
                  <Item label={unit.title} key={unit.id} value={unit.id} />
                )}
              </Picker>
            </View>
            <InputError
              show = {this.state.unit === null}
              message = "errorSelectUnit"
              />
          </View>
        }

        { [].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('margin')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5 }}>
              <Input
                value={this.state.margin}
                keyboardType='numeric'
                placeholder={i18n.t('enterMargin')}
                onChangeText={ value => this.setNumericValue(value, 'margin' ) }
                />
            </View>
            <InputError
              show = {this.state.margin === ''}
              message = "errorEnterItemMargin"
              />
          </View>
        }

        { ['material','custom'].includes(this.props.type) &&
          <View style={inputWrapperStyle}>
            <Text note>{i18n.t('price')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5}}>
              <Input
                value={this.state.price}
                keyboardType='numeric'
                placeholder={i18n.t('enterPrice')}
                onChangeText={ value => {
                  if(this.props.type === 'custom' || !this.pricelist ){
                    this.setNumericValue(value, 'price' )
                  }else if((value.match(/^-?\d*(\.\d*)?$/))){
                    if(parseInt(value) <= 50){
                      this.setState({ price: value, margin: this.pricelist.materialMargin })
                    }else{
                      this.setState({ price: value, margin: this.pricelist.materialMarginExtra })
                    }
                  }
                }}
                />
            </View>
            <InputError
              show = {this.state.price === ''}
              message = "errorEnterItemPrice"
              />
          </View>
        }
      </Content>
        <Footer>
          <FooterTab>
            <Button onPress={ this.submit.bind(this) } disabled={!this.canSave() || this.state.submitting} style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
              <Text style={{ color: 'white' }}>{i18n.t('addItem')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </Root>
    );
  }
}

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
}) => {
  const { users } = storageUsers;
  const { tasks } = storageHelpTasks;
  const { taskTypes  } = storageHelpTaskTypes;
  const { tripTypes } = storageHelpTripTypes;
  const { units } = storageHelpUnits;
  const { metadata } = storageMetadata;
  const { companies } = storageCompanies;
  const { pricelists } = storageHelpPricelists;
  const { projects } = storageHelpProjects;

  return {
    users,
    tasks,
    taskTypes,
    tripTypes,
    units,
    metadata,
    companies,
    pricelists,
    projects
  };
};
//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{})(AddForm);
