import React, { Component } from 'react';
import { Right, Left, Container, Content, Card, CardItem, Text, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';


import i18n from 'i18next';
import {deleteItem} from '../../../redux/actions';

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
  deleteInvoiceItem(id,title){
    Alert.alert(
      i18n.t('deletingItem'),
      i18n.t('deletingItemMessage')+title+'?',
      [
        {text: i18n.t('cancel'), style: 'cancel'},
        {text: i18n.t('ok'), onPress: () =>{
          this.props.deleteItem(id,this.props.id,this.props.token);
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    let total=0;
    this.props.items.map((item)=>total+=item.amount*item.unit_price);
    return (
      <Container>
        <Content padder style={{ marginTop: 0 }}>
          {
            this.props.items.map((item)=>
            <Card key={item.id}>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('title')}</Text>
                </Left>
                <Right>
                  <Text>{item.title}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('pricePerUnit')}</Text>
                </Left>
                <Right>
                  <Text>{(item.unit_price).toString()}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('unit')}</Text>
                </Left>
                <Right>
                  <Text>{item.unit?this.props.units[this.props.units.findIndex((unit)=>unit.id==item.unit.id)].shortcut:'Missing unit'}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('quantity')}</Text>
                </Left>
                <Right>
                  <Text>{(item.amount).toString()}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('totalPrice')}</Text>
                </Left>
                <Right>
                  <Text>{(item.amount*item.unit_price).toString()}</Text>
                </Right>
              </CardItem>
              {
                (this.props.ACL.includes('resolve_task') || this.props.ACL.includes('update_all_tasks')) &&
                <CardItem>
                  <Left>
                    <Button active block onPress={()=>this.deleteInvoiceItem(item.id,item.title)}>
                      <Icon name="trash" />
                      <Text>{i18n.t('delete')}</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button active block onPress={()=>{Actions.itemEdit({data:item,id:this.props.id});}}>
                      <Icon name="open" />
                      <Text>{i18n.t('edit')}</Text>
                    </Button>
                  </Right>
                </CardItem>
              }
            </Card>
          )
        }

        <Card>
          <CardItem>
            <Left>
              <Text note>{i18n.t('totalPrice')}</Text>
            </Left>
            <Right>
              <Text>{total}</Text>
            </Right>
          </CardItem>
        </Card>


      </Content>
      { (this.props.ACL.includes('resolve_task') || this.props.ACL.includes('update_all_tasks')) &&
        <Footer>
          <FooterTab>
            <Button onPress={()=>Actions.itemAdd({id:this.props.id}) } iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
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
const mapStateToProps = ({ itemReducer, loginReducer, taskReducer}) => {
  const { items ,units } = itemReducer;
  const { token } = loginReducer;
  return { items, units ,token, ACL:taskReducer.task.loggedUserProjectAcl.concat(taskReducer.task.loggedUserRoleAcl) };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{deleteItem})(TabItems);
