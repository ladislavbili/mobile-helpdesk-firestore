import React, { Component } from 'react';
import { Right, Left, Container, Content, Card, CardItem, Text, Footer, FooterTab, Button, Icon, Input, Picker, Item,Header, Title, Body, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator, Alert, Modal } from 'react-native';
import { connect } from 'react-redux';
import i18n from 'i18next';
import {deleteFakeItem, addFakeItem, editFakeItem} from '../../redux/actions';

/**
 * Display's all of the items used in this task
 * @extends Component
 */
class TabItems extends Component{
  constructor(props){
    super(props);
    this.state={
      addModal:false,
      editModal:false,
      unit:this.props.units[0].id,
      itemID:null,
      itemQuantity:'0',
      title:'',
      itemPrice:'0',
    }
    this.setPrice.bind(this);
    this.setQuantity.bind(this);
    this.addItem.bind(this);
  }

  /**
   * Set's item's price if the input string is valid decimal number
   * @param {string} input price entered by the user
   */
  setPrice(input){
    var valid = (input.match(/^-?\d*(\.\d*)?$/));
    if(valid){
      this.setState({itemPrice:input});
    }
  }

  addItem(){
    let title = this.state.title;
    let amount = this.state.itemQuantity.length==0 ? parseFloat(0) : parseFloat(this.state.itemQuantity);
    let unit_price = this.state.itemPrice.length==0 ? parseFloat(0) : parseFloat(this.state.itemPrice);
    let body = {
      title,
      amount,
      unit_price,
      unit:this.props.units.find((item)=>item.id===this.state.unit),
      id:this.props.items.length};
    if(this.state.addModal){
      this.props.addFakeItem(body);
    }else{
      body.id=this.state.itemID;
      this.props.editFakeItem(body);
    }
    this.setState({
      addModal:false,
      editModal:false,
      unit:this.props.units[0].id,
      itemQuantity:'0',
      title:'',
      itemPrice:'0',
    });
  }

  /**
   * Set's item's quantity if the input string is a valid decimal number
   * @param {string} input quantity entered by the user
   */
  setQuantity(input){
    var valid = (input.match(/^-?\d*(\.\d*)?$/));
    if(valid){
      this.setState({itemQuantity:input});
    }
  }

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
          this.props.deleteFakeItem(id);
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
                  <Text>{item.unit.shortcut}</Text>
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
                <CardItem>
                  <Left>
                    <Button active block onPress={()=>this.deleteInvoiceItem(item.id,item.title)}>
                      <Icon name="trash" />
                      <Text>{i18n.t('delete')}</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button active block onPress={()=>this.setState({
                        editModal:true,
                        itemID:item.id,
                        unit:item.unit.id,
                        itemQuantity:item.amount.toString(),
                        title:item.title,
                        itemPrice:item.unit_price.toString(),
                        })}>
                      <Icon name="open" />
                      <Text>{i18n.t('edit')}</Text>
                    </Button>
                  </Right>
                </CardItem>
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
      <Footer>
        <FooterTab>
          <Button onPress={()=>this.setState({addModal:true}) } iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
            <Icon active style={{ color: 'white' }} name="md-add" />
            <Text style={{ color: 'white' }}>{i18n.t('item')}</Text>
          </Button>
        </FooterTab>
      </Footer>

      <View>
        <Modal
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
          }}
          visible={this.state.addModal||this.state.editModal}>
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={() => this.setState({
                  editModal:false,
                  addModal:false,
                  unit:this.props.units[0].id,
                  itemQuantity:'0',
                  title:'',
                  itemPrice:'0',
                })}>
                  <Icon name="arrow-back" />
                </Button>
              </Left>
              <Body>
                <Title>{this.state.addModal?i18n.t('addItem'):i18n.t('editItem')}</Title>
              </Body>
              <Right>
                { this.state.title.length!=0 &&
                  <Button transparent onPress={this.addItem.bind(this)}>
                    <Icon active style={{ color: 'white', padding:10 }} name="ios-checkmark-circle-outline" />
                  </Button>
                }
              </Right>
            </Header>
            <Content style={{ padding: 15 }}>
              <Text note>{i18n.t('title')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Input
                  value={this.state.title}
                  placeholder={i18n.t('enterTitle')}
                  onChangeText={ value => this.setState({title:value}) }
                  />
                {
                  this.state.title.length==0 && <Text note style={{color:'red'}}>{i18n.t('itemNameError')}</Text>
              }
            </View>
            <Text note>{i18n.t('pricePerUnit')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <Input
                value={this.state.itemPrice}
                placeholder={i18n.t('enterPricePerUnit')}
                keyboardType='numeric'
                onChangeText={ value => this.setPrice(value) }
                />
            </View>

            <Text note>{i18n.t('unitSelect')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <Picker
                supportedOrientations={['portrait', 'landscape']}
                selectedValue={this.state.unit}
                onValueChange={(value)=>this.setState({unit:value})}>
                {this.props.units.map(
                  (unit)=> <Item label={unit.shortcut+' ('+unit.title+')'} key={unit.id} value={unit.id} />
              )}
            </Picker>
          </View>

          <Text note>{i18n.t('quantity')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              value={this.state.itemQuantity}
              keyboardType='numeric'
              placeholder={i18n.t('enterQuantity')}
              onChangeText={ value => this.setQuantity(value) }
              />
          </View>
        </Content>
      </Container>

      </Modal>
    </View>
  </Container>
  );
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ itemReducer}) => {
  const { items ,units } = itemReducer;
  return { items, units };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{deleteFakeItem, addFakeItem, editFakeItem})(TabItems);
