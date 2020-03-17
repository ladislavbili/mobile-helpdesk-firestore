
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem, View, CheckBox, Picker,Label } from 'native-base';
import { Actions } from 'react-native-router-flux';
import {Modal, Image} from 'react-native';
import i18n from 'i18next';
import {editUser} from '../../../redux/actions';
import {isEmail} from '../../../helperFunctions';

const languages = [{ id: 'en', name: 'English' }, { id: 'sk', name: 'Slovensky' }];

/**
 * Component that allows you to add a new user
 * @extends Component
 */
class UserEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_active: this.props.user.is_active,
      username:this.props.user.email,
      name:this.props.user.detailData.name?this.props.user.detailData.name:'',
      surname:this.props.user.detailData.surname?this.props.user.detailData.surname:'',
      password:'',
      userRole:this.props.userRoles.find(item => item.id === this.props.user.user_role.id),
      company:this.props.companies.find(item=> item.id === this.props.user.company.id),
      language:this.props.user.language?this.props.user.language:'sk',
      func: this.props.user.detailData.function ? this.props.user.detailData.function : '',
			mobile: this.props.user.detailData.mobile ? this.props.user.detailData.mobile : '',
			tel: this.props.user.detailData.tel ? this.props.user.detailData.tel : '',
      selectingCompany:false,
      filterWord:'',
      selectingUserRole:false,
      filterWordUserRole:'',
      image:null,
			disabled: this.props.me.user_role.order > this.props.user.user_role.order,
    };
    this.checkValues.bind(this);
  }
  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submit(){
    let body = {
			username: this.state.username,
			email: this.state.username,
      language: this.state.language,
			detail_data: {
				name: this.state.name,
				surname: this.state.surname,
				function: this.state.func,
				mobile: this.state.mobile,
				tel: this.state.tel
			},
		};
    if (this.state.password !== '') {
      body['password'] = this.state.password;
    }

    this.props.editUser(
			body,
			this.state.company.id,
			this.state.userRole.id,
			this.props.user.id,
			this.state.is_active,
			this.state.image,
			this.props.me.id === this.props.user.id,
			this.props.token
		);
    Actions.pop();

  }

  checkValues(){
    return isEmail(this.state.username) && (this.state.password.length > 7||this.state.password.length===0);
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
              this.checkValues() && !this.state.disabled &&
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
              disabled={this.state.disabled}
              onChangeText={(value)=>this.setState({username:value})}
              />
              {
    						!isEmail(this.state.username) && <Text note style={{color:'red'}}>{i18n.t('usernameError')}</Text>
              }

          </View>

          <Text note>{i18n.t('firstName')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterFirstName')}
              value={this.state.name}
              onChangeText={(value)=>this.setState({name:value})}
              disabled={this.state.disabled}
              />
          </View>

          <Text note>{i18n.t('surname')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterSurname')}
              value={this.state.surname}
              onChangeText={(value)=>this.setState({surname:value})}
              disabled={this.state.disabled}
              />
          </View>

        <Text note>{i18n.t('password')}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Input
            secureTextEntry={true}
            placeholder={i18n.t('enterNewPassword')}
            value={this.state.password}
            onChangeText={(value)=>this.setState({password:value})}
            disabled={this.state.disabled}
            />
          {
            this.state.password.length<8  && this.state.password.length>0 && <Text note style={{color:'red'}}>{i18n.t('userPasswordError')}</Text>
        }
      </View>

      <Text note>{i18n.t('userRole')}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Button block style={{backgroundColor:'white'}} disabled={this.state.disabled} onPress={()=>this.setState({selectingUserRole:true})}>
          <Left>
            <Text style={{textAlign:'left',color:'black'}}>{this.state.userRole.title}</Text>
          </Left>
        </Button>
      </View>

      <Text note>{i18n.t('company')}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Button block style={{backgroundColor:'white'}} onPress={()=>this.setState({selectingCompany:true})} disabled={this.state.disabled}>
          <Left>
            <Text style={{textAlign:'left',color:'black'}}>{this.state.company==null ? i18n.t('selectCompany') : this.state.company.title}</Text>
          </Left>
        </Button>
      </View>

      <Text note>{i18n.t('selectUserLanguage')}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Picker
          supportedOrientations={['portrait', 'landscape']}
          enabled={!this.state.disabled}
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
        disabled={this.state.disabled}
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
        disabled={this.state.disabled}
        />
    </View>

    <Text note>{i18n.t('telephone')}</Text>
    <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
      <Input
        placeholder={i18n.t('enterTelephone')}
        value={this.state.tel}
        onChangeText={(value)=>this.setState({tel:value})}
        keyboardType="numeric"
        disabled={this.state.disabled}
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
              {(this.state.disabled
                ? this.props.userRoles
                : this.props.userRoles.filter(item => item.order >= this.props.me.user_role.order)
                )
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
  const { userRoles, nameError, user} = userReducer;
  const { token } = loginReducer;
  return { companies, userRoles, nameError, token, user, me: loginReducer.user};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {editUser})(UserEdit);
