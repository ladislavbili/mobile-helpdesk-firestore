
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Item, Picker, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem, View, CheckBox, Label, Textarea } from 'native-base';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import jwt_decode from 'jwt-decode';
import i18n from 'i18next';
import { logout, removeListeners } from '../../../redux/actions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

const languages = [{ id: 'en', name: 'English' }, { id: 'sk', name: 'Slovensky' }];

//username, name, surname, recieve email notifications, Signature, language, reset password
//napisat firmu a rolu email
class Account extends Component {
  constructor(props) {
    super(props);

    let user = this.props.currentUser.userData;
    this.state = {
      username: user.username,
      name: user.name,
      surname: user.surname,
      mailNotifications: user.mailNotifications,
      signature: user.signature || `${user.name} ${user.surname}, ${ company ? company.title : '' }`,
      language: user.language || 'sk', // set language async storage
      passResetEnded: true,
      passReseted: false,
      };
    this.checkValues.bind(this);
    this.submit.bind(this);
  }
  checkValues(){
    return true;
  }

  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submit(){
    let body = {
      username: this.state.username,
      name: this.state.name,
      surname: this.state.surname,
      mailNotifications: this.state.mailNotifications,
      signature: this.state.signature,
      language: this.state.language,
    };
    database.collection('users').doc(this.props.currentUser.id).update(body);
    //Actions.pop();
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
            <Title>{i18n.t('account')}</Title>
          </Body>
        </Header>
        <Content style={{ padding: 15 }}>

          <Text note>{i18n.t('company')}</Text>
          <View style={{ borderColor: 'white', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              value={this.props.companies.find((company)=>company.id === this.props.currentUser.userData.company ).title}
              disabled={true}
              />
          </View>

          <Text note>{i18n.t('role')}</Text>
          <View style={{ borderColor: 'white', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              value={this.props.currentUser.userData.role.label}
              disabled={true}
              />
          </View>

          <Text note>{i18n.t('email')}</Text>
          <View style={{ borderColor: 'white', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              value={this.props.currentUser.userData.email}
              disabled={true}
              />
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

        <Button primary block onPress={this.submit.bind(this)} disabled={!this.checkValues()}
          style={{ flexDirection: 'row', borderColor: 'white', marginTop:5, marginBottom:20, borderWidth: 0.5 }}>
          <Text style={{ color: 'white' }} >{i18n.t('change')}</Text>
        </Button>


        <Button warning block onPress={()=>{
          Alert.alert(
            'Are you sure?',
            'Do you want to recieve password change through e-mail?',
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



          <Button danger block onPress={()=>{Actions.taskList({type: 'replace'});this.props.removeListeners(); this.props.logout();}}
            iconLeft style={{ flexDirection: 'row', borderColor: 'white', marginTop:5, marginBottom:20, borderWidth: 0.5 }}>
            <Icon active style={{ color: 'white' }} name="power" />
            <Text style={{ color: 'white' }} >{i18n.t('logout')}</Text>
          </Button>


        </Content>
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ loginReducer, storageCompanies }) => {
  const currentUser = loginReducer;
  const { companies } = storageCompanies;
  return { currentUser, companies };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, { removeListeners })(Account);
