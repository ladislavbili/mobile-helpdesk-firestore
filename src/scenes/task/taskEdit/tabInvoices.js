import React, { Component } from 'react';
import { Right, Left, Container, Content, Card, CardItem, Text, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
let database = firebase.firestore();


import i18n from 'i18next';
//import {  } from '../../../redux/actions';

const boxStyle = { marginLeft: 10, marginRight: 10, marginTop:0, marginBottom:0, paddingTop:0 }
const labelStyle = { width: 80 }
const centered = { marginLeft: 'auto', marginRight: 'auto' }
const noBorders = { marginTop:0, marginBottom:0, paddingTop:0, paddingBottom:0 }

/**
 * Display's all of the items used in this task
 * @extends Component
 */
class TabItems extends Component{
/**
 * Delete's a single item
 * @param  {int} id    ID of an item that is meant to be deleted
 * @param  {string} title Title of the item
 */
  deleteInvoiceItem(item){
    let title = item.generalType === 'trip' ? item.type.title : item.title;
    Alert.alert(
      i18n.t('deletingItem'),
      i18n.t('deletingItemMessage')+title+'?',
      [
        {text: i18n.t('cancel'), style: 'cancel'},
        {text: i18n.t('ok'), onPress: () =>{
          switch (item.generalType) {
            case 'work':{
              database.collection('help-task_works').doc(item.id).delete();
              break;
            }
            case 'trip':{
              database.collection('help-task_work_trips').doc(item.id).delete();
              break;
            }
            case 'material':{
              database.collection('help-task_materials').doc(item.id).delete();
              break;
            }
            case 'custom':{
              database.collection('help-task_custom_items').doc(item.id).delete();
              break;
            }
            default:{
              return;
            }

          }
          //this.props.deleteItem(id,this.props.id,this.props.token);
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    let data = [...this.props.works, ...this.props.trips, ...this.props.materials, ...this.props.customItems];

    return (
      <Container>
        <Content padder style={{ marginTop: 0 }}>
          { data.map((item) =>
            <Card key={item.id}>
              <CardItem style={noBorders}>
                <Text note style={centered}>
                  {
                    ['work','trip'].includes(item.generalType) ?
                    `${i18n.t(item.generalType)} - ${item.type.title}` :
                    i18n.t(item.generalType)
                  }
                  </Text>
              </CardItem>
              { item.generalType !== 'trip' &&
                <CardItem style={boxStyle}>
                  <Text style={labelStyle} note>{i18n.t('title')}</Text>
                  <Text>{item.title}</Text>
                </CardItem>
              }
              <CardItem style={boxStyle}>
                  <Text style={labelStyle} note>{i18n.t('quantity')}</Text>
                  <Text>{item.quantity.toString()}</Text>
              </CardItem>
              { ['work','trip'].includes(item.generalType) &&
                <CardItem style={boxStyle}>
                    <Text style={labelStyle} note>{i18n.t('assignedTo')}</Text>
                    <Text>{item.assignedTo ? item.assignedTo.email : i18n.t('assignedToNoone') }</Text>
                </CardItem>
              }
              { !this.props.viewOnly &&
                <CardItem>
                  <Left>
                    <Button active block onPress={()=>this.deleteInvoiceItem(item)}>
                      <Icon name="trash" />
                      <Text>{i18n.t('delete')}</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button
                      active
                      block
                      onPress={()=>{
                        Actions.itemEdit({ id:item.id, generalType: item.generalType })
                      }}
                      >
                      <Icon name="open" />
                      <Text>{i18n.t('edit')}</Text>
                    </Button>
                  </Right>
                </CardItem>
              }
            </Card>
          )}

        </Content>
        { !this.props.viewOnly &&
          <Footer>
            <FooterTab>
              <Button
                onPress={()=>{
                  Actions.itemAdd({ id: this.props.id })
                }}
                iconLeft
                style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
                >
                <Icon active style={{ color: 'white' }} name="md-add" />
                <Text style={{ color: 'white' }}>{i18n.t('item')}</Text>
              </Button>
            </FooterTab>
          </Footer>
        }
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ }) => {
  return {  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{})(TabItems);
