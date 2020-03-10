import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, FooterTab, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem } from 'native-base';
import { Actions } from 'react-native-router-flux';

import i18n from 'i18next';
import {logoutUser} from '../../redux/actions';

/**
 * Shows user all of the settings available to him
 * @extends Component
 */
class Settings extends Component {
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
            <Title>{i18n.t('settings')}</Title>
          </Body>
          <Right>
          </Right>
        </Header>
        <Content>
          { this.props.ACL.includes('user_settings') &&
            <ListItem button onPress={Actions.userList} icon>
              <Left>
                <Icon name="people" />
              </Left>
              <Body>
                <Text>{i18n.t('users')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          }
          { this.props.ACL.includes('company_settings') &&
            <ListItem button onPress={Actions.companyList} icon>
              <Left>
                <Icon name="home" />
              </Left>
              <Body>
                <Text>{i18n.t('companies')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          }
          <ListItem button onPress={Actions.account} icon>
            <Left>
              <Icon name="person" />
            </Left>
            <Body>
              <Text>{i18n.t('account')}</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <Button danger block onPress={()=>{this.props.logoutUser();Actions.pop();Actions.pop();Actions.pop();}} iconLeft style={{ flexDirection: 'row', borderColor: 'white', margin:20, borderWidth: 0.5 }}>
            <Icon active style={{ color: 'white' }} name="power" />
            <Text style={{ color: 'white' }} >{i18n.t('logout')}</Text>
          </Button>
        </Content>
        { (this.props.ACL.includes('user_settings') || this.props.ACL.includes('company_settings')) &&
        <Footer>
          { this.props.ACL.includes('user_settings') &&
            <FooterTab>
              <Button onPress={Actions.userAdd} iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
                <Icon active style={{ color: 'white' }} name="add" />
                <Text style={{ color: 'white' }} >{i18n.t('user')}</Text>
              </Button>
            </FooterTab>
          }
          { this.props.ACL.includes('company_settings') &&
            <FooterTab>
              <Button onPress={Actions.companyAdd} iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
                <Icon active style={{ color: 'white' }} name="add" />
                <Text style={{ color: 'white' }} >{i18n.t('company')}</Text>
              </Button>
            </FooterTab>
          }
        </Footer>
      }
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ loginReducer }) => {
  const {user} = loginReducer;
  return {ACL:user.user_role.acl};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{logoutUser})(Settings);
