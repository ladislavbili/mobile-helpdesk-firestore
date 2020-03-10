import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem, View, CheckBox, Picker,Label} from 'native-base';
import { Actions } from 'react-native-router-flux';
import {Modal, Image } from 'react-native';
import i18n from 'i18next';
import {addUser} from '../../redux/actions';
import {isEmail} from '../../helperFunctions';
const languages = [{ id: 'en', name: 'English' }, { id: 'sk', name: 'Slovensky' }];

/**
 * Component that allows you to add a new user
 * @extends Component
 */
class UserAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      name:'',
      surname:'',
      password:'',
      userRole:this.props.userRoles.sort((item,item2) => item.order < item2.order?1:-1)[0],
      company:this.props.companies[0],
      language:'sk',
      func:'',
      mobile:'',
      tel:'',
      selectingCompany:false,
      filterWord:'',
      selectingUserRole:false,
      filterWordUserRole:'',
      image:null,
    };
    this.checkValues.bind(this);
  }
  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submit(){
    let body = {
			username: this.state.username,
			password: this.state.password,
			email: this.state.username,
      language: this.state.language,
			detail_data: {
				name: this.state.name,
				surname: this.state.surname,
				'function': this.state.func,
				mobile: this.state.mobile,
				tel: this.state.tel
			},
		};
		this.props.addUser(body, this.state.company.id, this.state.userRole.id, this.state.image, this.props.token);
    Actions.pop();
  }

  checkValues(){
    return isEmail(this.state.username) && this.state.password.length > 7;
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
              this.checkValues() &&
              <Button transparent onPress={this.submit.bind(this)}>
                <Icon active style={{ color: 'white', padding:10 }} name="ios-checkmark-circle-outline" />
              </Button>
            }
          </Right>
        </Header>
        <Content style={{ padding: 15 }}>

          <Text note>{i18n.t('email')+'/'+i18n.t('username')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterEmail')}
              value={this.state.username}
              onChangeText={(value)=>this.setState({username:value})}
              />
              {
    						!isEmail(this.state.username) && <Text note style={{color:'red'}}>{i18n.t('usernameError')}</Text>
              }
              {
    						this.props.nameError && <Text note style={{color:'red'}}>{i18n.t('usernameInUse')}</Text>
              }
          </View>

          <Text note>{i18n.t('firstName')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterFirstName')}
              value={this.state.name}
              onChangeText={(value)=>this.setState({name:value})}
              />
          </View>

          <Text note>{i18n.t('surname')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
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
            this.state.password.length<8  && <Text note style={{color:'red'}}>{i18n.t('userPasswordError')}</Text>
        }
      </View>

      <Text note>{i18n.t('userRole')}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Button block style={{backgroundColor:'white'}} onPress={()=>this.setState({selectingUserRole:true})}>
          <Left>
            <Text style={{textAlign:'left',color:'black'}}>{this.state.userRole.title}</Text>
          </Left>
        </Button>
      </View>

      <Text note>{i18n.t('company')}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Button block style={{backgroundColor:'white'}} onPress={()=>this.setState({selectingCompany:true})}>
          <Left>
            <Text style={{textAlign:'left',color:'black'}}>{this.state.company==null ? i18n.t('selectCompany') : this.state.company.title}</Text>
          </Left>
        </Button>
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
              <Input placeholder={i18n.t('search')} value={this.state.filterWord} onChangeText={((value)=>this.setState({filterWord:value}))} />
            </Item>
          </ListItem>

          <List>
            {
              this.props.companies.map((company) =>
              company.title.toLowerCase().includes(this.state.filterWord.toLowerCase()) && <ListItem button key={company.id} onPress={()=>this.setState({company:company,selectingCompany:false})} >
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
              this.props.userRoles
								.filter(item => item.order >= this.props.user.user_role.order)
                .map((role) =>
              role.title.toLowerCase().includes(this.state.filterWordUserRole.toLowerCase()) && <ListItem button key={role.id} onPress={()=>this.setState({userRole:role,selectingUserRole:false})} >
              <Body>
                <Text>{role.title}</Text>
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
const mapStateToProps = ({ companyReducer, userReducer,loginReducer }) => {
  const { companies } = companyReducer;
  const { userRoles, nameError} = userReducer;
  const { token,user } = loginReducer;
  return { companies, userRoles, nameError, token, user};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {addUser})(UserAdd);
