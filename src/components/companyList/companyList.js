import {ActivityIndicator} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Item, Footer, FooterTab, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, List, ListItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import i18n from 'i18next';

/**
* Show list containing all of the available companies
* @extends Component
*/
class CompanyList extends Component {
  constructor(props) {
    super(props);
    this.state={seached:''}
  }

  render() {
    if(this.props.loadingData){
      return (
        <ActivityIndicator
          animating size={ 'large' }
          color='#007299' />
      )
    }
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{i18n.t('companyList')}</Title>
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
            dataArray={this.props.companies.filter((company)=>company.title.toLowerCase().includes(this.state.seached.toLowerCase()))}
            renderRow={(company)=>
              <ListItem
                button onPress={()=>Actions.companyEdit({id:company.id})}
                >
                <Body>
                  <Text>{company.title}</Text>
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
            <Button onPress={Actions.companyAdd} iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
              <Icon active style={{ color: 'white' }} name="add" />
              <Text style={{ color: 'white' }} >{i18n.t('company')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ companyReducer }) => {
  const { companies } = companyReducer;
  return { companies };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {})(CompanyList);
