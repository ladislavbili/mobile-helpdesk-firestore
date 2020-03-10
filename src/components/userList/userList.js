import {ActivityIndicator} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  Item, Footer, FooterTab, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';

import i18n from 'i18next';
import {compactUserForSearch} from '../../helperFunctions';

/**
 * Displays all of the users visible to the current user
 * @extends Component
 */
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state={seached:''}
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
            <Title>{i18n.t('usersList')}</Title>
          </Body>
        </Header>
        <Content>
          <Item rounded style={{marginTop:15,marginBottom:15,marginLeft: 20, marginRight: 20,}}>
            <Icon name="ios-search" />
            <Input placeholder={i18n.t('search')}
              value={this.state.seached}
              onChangeText={((value)=>this.setState({seached:value}))} />
          </Item>

          <List
            dataArray={
              this.props.users.filter((user)=>
              {
                let filter=this.state.seached.toLowerCase();
                return (compactUserForSearch(user).includes(filter));
              })
            }
            renderRow={(user)=>
              <ListItem
                button onPress={()=>{Actions.userEdit({id:user.id})}}
                >
                <Body>
                  {
                    (user.name||user.surname)?<Text>{user.name?user.name+' ':''}{user.surname?user.surname:''}</Text>:null
                  }
                  <Text note>{user.email}</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            }
            />
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={Actions.userAdd} iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
              <Icon active style={{ color: 'white' }} name="add" />
              <Text style={{ color: 'white' }} >{i18n.t('user')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ userReducer, loginReducer }) => {
  const { users } = userReducer;
  const { token } = loginReducer;
  return { users, token };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {})(UserList);
