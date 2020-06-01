
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem, View, CheckBox, Picker, Label, Textarea } from 'native-base';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {Modal, Image} from 'react-native';
import i18n from 'i18next';
import { storageCompaniesStart } from '../../../redux/actions';
import {isEmail} from '../../../helperFunctions';
import firebase from 'react-native-firebase';
import { androidConfig } from './firebase';
let database = firebase.firestore();

let roles=[
  {label:'User',value:0},
  {label:'Agent',value:1},
  {label:'Manager',value:2},
  {label:'Admin',value:3},
]

const languages = [{ id: 'en', name: 'English' }, { id: 'sk', name: 'Slovensky' }];

/**
* Component that allows you to add a new user
* @extends Component
*/
class UserAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      role: roles[0],
      name: '',
      surname: '',
      mailNotifications: false,
      company: null,
      signature: '',
      language: 'sk',
      email: '@',

      password:'',
      passwordConfirmation:'',
      selectingCompany: false,
      selectingUserRole: false,
      filterWordCompany: '',
      filterWordUserRole: '',

      saving:false,
      error: false,
    };
    this.canSave.bind(this);
    this.submit.bind(this);
    this.submitData.bind(this);
  }

  UNSAFE_componentWillMount(){
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
  }

  /**
  * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
  */
  submit(){
    this.setState({saving:true, error: false})
    if(firebase.apps.some((app)=> app._name === "REGISTERAPP")){
      this.submitData();
    }else{
      firebase.initializeApp( androidConfig, "REGISTERAPP" ).onReady((app)=>{
        this.submitData();
      });
    }
  }

  submitData(){
    let state = this.state;
    let body = {
      username: state.username,
      role: state.role,
      name: state.name,
      email: state.email,
      surname: state.surname,
      mailNotifications: state.mailNotifications,
      company:state.company.id,
      signature: state.signature,
      language: state.language,
    };

    firebase.app("REGISTERAPP").auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
      database.collection('users').doc(res.user.uid).set(body).then(()=>{
        this.setState({saving:false})
        Actions.pop();
      });
    }).catch((error)=>{
      this.setState({saving:false, error: true})
    })
  }

  canSave(){
    return this.state.username !== '' &&
    this.state.name !=='' &&
    isEmail(this.state.email) &&
    this.state.surname !=='' &&
    this.state.company !== null &&
    this.state.language !== null &&
    this.state.password.length > 8 &&
    this.state.passwordConfirmation === this.state.password &&
    !this.state.saving;
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{i18n.t('addUser')}</Title>
          </Body>
          <Right>
            {
              this.canSave() &&
              <Button transparent onPress={this.submit.bind(this)}>
                <Icon active style={{ color: 'white', padding:10 }} name="ios-checkmark-circle-outline" />
              </Button>
            }
          </Right>
        </Header>
        <Content style={{ padding: 15 }}>

          <Text note>{i18n.t('email')}</Text>
          <View style={{ borderColor: 'white', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              keyboardType='email-address'
              placeholder={i18n.t('enterEmail')}
              value={this.state.email}
              onChangeText={(value)=>this.setState({email:value})}
              />
          </View>
          {
            this.state.error &&
            <Text note style={{color:'red'}}>{i18n.t('emailExistsError')}</Text>
          }

          <Text note>{i18n.t('password')}</Text>
          <View style={{ borderColor: 'white', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              secureTextEntry={true}
              placeholder={i18n.t('enterPassword')}
              value={this.state.password}
              onChangeText={(value)=>this.setState({password:value})}
              />
          </View>

          <Text note>{i18n.t('passwordConfirmation')}</Text>
          <View style={{ borderColor: 'white', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              secureTextEntry={true}
              placeholder={i18n.t('enterPasswordConfirmation')}
              value={this.state.passwordConfirmation}
              onChangeText={(value)=>this.setState({passwordConfirmation:value})}
              />
          </View>

          <Text note>{i18n.t('company')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Button block style={{backgroundColor:'white'}} disabled={!this.props.companiesLoaded} onPress={()=>this.setState({selectingCompany:true})}>
              <Left>
                <Text style={{textAlign:'left',color:'black'}}>{this.state.company === null ? i18n.t('selectCompany') : this.state.company.title}</Text>
              </Left>
            </Button>
          </View>

          <Text note>{i18n.t('userRole')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Button block style={{backgroundColor:'white'}} onPress={()=>this.setState({selectingUserRole:true})}>
              <Left>
                <Text style={{textAlign:'left',color:'black'}}>{this.state.role.label}</Text>
              </Left>
            </Button>
          </View>

          <Text note>{i18n.t('username')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              placeholder={i18n.t('enterUsername')}
              value={this.state.username}
              onChangeText={(value)=>this.setState({username:value})}
              />
          </View>

          <Text note>{i18n.t('firstName')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              placeholder={i18n.t('enterFirstName')}
              value={this.state.name}
              onChangeText={(value)=>this.setState({name:value})}
              />
          </View>

          <Text note>{i18n.t('surname')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              placeholder={i18n.t('enterSurname')}
              value={this.state.surname}
              onChangeText={(value)=>this.setState({surname:value})}
              />
          </View>

        <Text note>{i18n.t('selectLanguage')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Picker
            supportedOrientations={['portrait', 'landscape']}
            selectedValue={this.state.language}
            onValueChange={(value)=>this.setState({language:value})}>
            {languages.map(
              (lang)=> <Picker.Item label={lang.name} key={lang.id} value={lang.id} />
          )}
          </Picker>
        </View>

        <Text note>{i18n.t('signature')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Textarea
            placeholder={i18n.t('enterSignature')}
            rowSpan={3}
            value={this.state.signature}
            onChangeText={(value)=>this.setState({signature:value})}
            />
        </View>

        <Item
          style={{ marginBottom:20, paddingBottom:15, paddingTop:5,   boxShadow:0 }}
          inlineLabel
          onPress={ () => {
            this.setState({ mailNotifications: !this.state.mailNotifications });
          }}>
          <CheckBox
            checked={this.state.mailNotifications}
            color='#3F51B5'
            onPress={ () => {
              this.setState({ mailNotifications: !this.state.mailNotifications });
            }}/>
          <Label style={{marginLeft:15}}>{i18n.t('mailNotifications')}</Label>
        </Item>

          <Modal
            animationType={"fade"}
            transparent={false}
            style={{flex:1}}
            visible={this.state.selectingCompany}
            onRequestClose={() => this.setState({selectingCompany:false})}>
            <Header>
              <Body>
                <Title>{i18n.t('selectUsersCompany')}</Title>
              </Body>
            </Header>
            <Content style={{ padding: 15 }}>

              <ListItem>
                <Item rounded>
                  <Icon name="ios-search" />
                  <Input placeholder={i18n.t('search')} value={this.state.filterWordCompany} onChangeText={((value)=>this.setState({filterWordCompany:value}))} />
                </Item>
              </ListItem>

              <List>
                {
                  this.props.companies.map((company) =>
                  company.title.toLowerCase().includes(this.state.filterWordCompany.toLowerCase()) &&
                  <ListItem button key={company.id} onPress={()=>this.setState({company:company,selectingCompany:false})} >
                  <Body>
                    <Text>{company.title}</Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              )
            }
          </List>
        </Content>
      </Modal>

      <Modal
        animationType={"fade"}
        transparent={false}
        style={{flex:1}}
        visible={this.state.selectingUserRole}
        onRequestClose={() => this.setState({selectingUserRole:false})}>
        <Header>
          <Body>
            <Title>{i18n.t('selectUserRole')}</Title>
          </Body>
        </Header>
        <Content style={{ padding: 15 }}>

          <ListItem>
            <Item rounded>
              <Icon name="ios-search" />
              <Input placeholder={i18n.t('search')} value={this.state.filterWordUserRole} onChangeText={((value)=>this.setState({filterWordUserRole:value}))} />
            </Item>
          </ListItem>

          <List>
            {
            roles.filter((role)=>role.value <= this.props.currentUser.userData.role.value ).map((role) =>
            role.label.toLowerCase().includes(this.state.filterWordUserRole.toLowerCase()) &&
            <ListItem button key={role.value} onPress={()=>this.setState({role,selectingUserRole:false})} >
            <Body>
              <Text>{role.label}</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        )}
      </List>
    </Content>
  </Modal>

</Content>
</Container>
);
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageCompanies, loginReducer  }) => {
  const { companies, companiesLoaded, companiesActive } = storageCompanies;
  const currentUser = loginReducer;
  return { companies, companiesLoaded, companiesActive, currentUser };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, { storageCompaniesStart })(UserAdd);
