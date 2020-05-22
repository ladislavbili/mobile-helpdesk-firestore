import React, { Component } from 'react';
import { Tab, Tabs, Input, Picker, Item, Footer, FooterTab, Container, Header, Title, Content, Button, Icon, Text, Left, Body, View, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import i18n from 'i18next';
import AddForm from './addForm';

/**
* Allows the user to create a single item assigned to the task
* @extends Component
*/
export default class ItemAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  getTitle(){
    switch (this.state.tab) {
      case 0: return 'addWork';
      case 1: return 'addTrip';
      case 2: return 'addMaterial';
      case 3: return 'addCustomItem';
      return 'undefined';
    }
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
            <Title>{ i18n.t(this.getTitle()) }</Title>
          </Body>
        </Header>
          <Tabs onChangeTab={ (tab) => {this.setState({ tab: tab.i })} }>
            <Tab heading={i18n.t('addWork')}>
              <AddForm id={this.props.id} type="work" count={this.props.workCount}/>
            </Tab>
            <Tab heading={i18n.t('addTrip')}>
              <AddForm id={this.props.id} type="trip" count={this.props.tripCount}/>
            </Tab>
            <Tab heading={i18n.t('addMaterial')}>
              <AddForm id={this.props.id} type="material" count={this.props.materialCount}/>
            </Tab>
            <Tab heading={i18n.t('addCustomItem')}>
              <AddForm id={this.props.id} type="custom" count={this.props.customCount}/>
            </Tab>
          </Tabs>
      </Container>
    );
  }
}
