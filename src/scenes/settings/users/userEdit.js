
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
class UserEdit extends Component {
  constructor(props) {
    super(props);
    let user = this.props.user;
    this.state = {
      username: user.username,
      role:user.role || roles[0],
      name: user.name,
      surname: user.surname,
      mailNotifications: user.mailNotifications,
      company: null,
      signature: user.signature || `${user.name} ${user.surname}, ${ company ? company.title : '' }`,
      language: user.language || 'sk',

      passResetEnded: true,
      passReseted: false,
      selectingCompany: false,
      selectingUserRole: false,
      filterWordCompany: '',
      filterWordUserRole: '',
    };
    this.canSave.bind(this);
    this.submit.bind(this);
  }

  UNSAFE_componentWillMount(){
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }else if(this.props.companiesLoaded){
      let company = this.props.companies.find((company) => company.id === this.props.user.company);
      if(company === undefined){
        company = null;
      }
      this.setState({ company });
    }
  }

  UNSAFE_componentWillReceiveProps(props){
    if(props.companiesLoaded && !this.props.companiesLoaded){
      let company = props.companies.find((company) => company.id === this.props.user.company);
      if(company === undefined){
        company = null;
      }
      this.setState({ company });
    }
  }


  /**
  * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
  */
  submit(){
    let user = this.state;
    let body = {
      username: user.username,
      role: user.role,
      name: user.name,
      surname: user.surname,
      mailNotifications: user.mailNotifications,
      company:user.company.id,
      signature: user.signature,
      language: user.language,
    };
    database.collection('users').doc(this.props.user.id).update(body);
    Actions.pop();
  }

  canSave(){
    return this.state.language !== null && this.state.name !=='' && this.state.surname !=='' && this.state.username !== '' && this.state.company !== null ;
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
            <Title>{i18n.t('editUser')}</Title>
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
              value={this.props.user.email}
              disabled={true}
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
            <Button block style={{backgroundColor:'white'}} disabled={this.props.currentUser.userData.role.value < this.props.user.role.value } onPress={()=>this.setState({selectingUserRole:true})}>
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

        <Button warning block onPress={()=>{
          Alert.alert(
            'Are you sure?',
            'Do you want to send password change through e-mail?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'Reset password', onPress: () => {
                this.setState({passReseted:true,passResetEnded:false})
                firebase.auth().sendPasswordResetEmail(this.props.currentUser.userData.email).then(()=>{
                  this.setState({passResetEnded:true})
                })
              }},
            ],
            {cancelable: true},
          );
          }}
          disabled={this.state.passReseted}
          style={{ flexDirection: 'row', borderColor: 'white', marginTop:5, marginBottom:20, borderWidth: 0.5 }}>
          <Text style={{ color: 'white' }} >{this.state.passResetEnded?(this.state.passReseted?'Password reseted!':"Reset user's password"):"Resetting..."}</Text>
        </Button>

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
                  company.title.toLowerCase().includes(this.state.filterWordCompany.toLowerCase()) && <ListItem button key={company.id} onPress={()=>this.setState({company:company,selectingCompany:false})} >
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
            role.label.toLowerCase().includes(this.state.filterWordUserRole.toLowerCase()) && <ListItem button key={role.id} onPress={()=>this.setState({role,selectingUserRole:false})} >
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
export default connect(mapStateToProps, { storageCompaniesStart })(UserEdit);
