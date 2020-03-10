
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Item, Picker, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem, View, CheckBox, Label } from 'native-base';
import { Actions } from 'react-native-router-flux';
import jwt_decode from 'jwt-decode';
import {logoutUser, editUser} from '../../redux/actions';
import i18n from 'i18next';
import {isEmail} from '../../helperFunctions';

const languages = [{ id: 'en', name: 'English' }, { id: 'sk', name: 'Slovensky' }];

/**
 * Decodes current JWT Token and displays data about the current user, also allowing him to log out
 * @extends Component
 */
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_active: this.props.user.is_active,
      email:this.props.user.username,
      user_role:this.props.user.user_role.title,
      name:this.props.user.detailData.name?this.props.user.detailData.name:'',
      surname:this.props.user.detailData.surname?this.props.user.detailData.surname:'',
      password:'',
      language:this.props.user.language?this.props.user.language:'sk',
      func: this.props.user.detailData.function ? this.props.user.detailData.function : '',
      mobile: this.props.user.detailData.mobile ? this.props.user.detailData.mobile : '',
      tel: this.props.user.detailData.tel ? this.props.user.detailData.tel : '',
      image:null,
    };
    this.checkValues.bind(this);
    this.submit.bind(this);
  }
  checkValues(){
    return isEmail(this.state.email) && (this.state.password.length > 7||this.state.password.length===0);
  }

  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submit(){
    let body = {
      username: this.state.email,
      email: this.state.email,
      language: this.state.language,
      detail_data: {
        name: this.state.name,
        surname: this.state.surname,
        'function': this.state.func,
        mobile: this.state.mobile,
        tel: this.state.tel
      }
    };
    if (this.state.password !== '') {
      body['password'] = this.state.password;
    }

    this.props.editUser(
      body,
      this.props.user.company.id,
      this.props.user.user_role.id,
      this.props.user.id,
      this.state.is_active,
      this.state.image,
      true,
      this.props.token
    );
    Actions.pop();

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

          <Text note>{i18n.t('email')}/{i18n.t('username')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              value={this.state.email}
              disabled={true}
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

          <Text note>{i18n.t('password')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              secureTextEntry={true}
              placeholder={i18n.t('enterNewPassword')}
              value={this.state.password}
              onChangeText={(value)=>this.setState({password:value})}
              />
            {
              this.state.password.length<8  && this.state.password.length>0 && <Text note style={{color:'red'}}>{i18n.t('userPasswordError')}</Text>
          }
        </View>

        <Text note>{i18n.t('selectLanguage')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Picker
            supportedOrientations={['portrait', 'landscape']}
            selectedValue={this.state.language}
            onValueChange={(value)=>this.setState({language:value})}>
            {languages.map(
              (lang)=> <Item label={lang.name} key={lang.id} value={lang.id} />
          )}
          </Picker>
        </View>

        <Text note>{i18n.t('function')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterFunction')}
            value={this.state.func}
            onChangeText={(value)=>this.setState({func:value})}
            />
        </View>

        <Text note>{i18n.t('mobile')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterMobile')}
            value={this.state.mobile}
            keyboardType="numeric"
            onChangeText={(value)=>this.setState({mobile:value})}
            />
        </View>

        <Text note>{i18n.t('telephone')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            placeholder={i18n.t('enterTelephone')}
            value={this.state.tel}
            onChangeText={(value)=>this.setState({tel:value})}
            keyboardType="numeric"
            />
        </View>

          <Text note>{i18n.t('userRole')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 5 }}>
            <Input
              value={this.state.user_role}
              disabled={true}
              />
          </View>

          <Button primary block onPress={this.submit.bind(this)} disabled={!this.checkValues()}
            style={{ flexDirection: 'row', borderColor: 'white', marginTop:5, marginBottom:20, borderWidth: 0.5 }}>
            <Text style={{ color: 'white' }} >{i18n.t('change')}</Text>
          </Button>


          <Button danger block onPress={()=>{Actions.taskList();this.props.logoutUser();}}
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
const mapStateToProps = ({ userReducer, loginReducer }) => {
  const { user} = userReducer;
  const { token } = loginReducer;
  return { user, token };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {logoutUser, editUser})(Account);
