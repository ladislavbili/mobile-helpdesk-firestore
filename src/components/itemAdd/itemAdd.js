import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Picker, Item, Footer, FooterTab, Container, Header, Title, Content, Button, Icon, Text, Left, Body, View, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import i18n from 'i18next';
import {addItem} from '../../redux/actions';

/**
* Allows the user to create a single item assigned to the task
* @extends Component
*/
class ItemAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit:this.props.units[0].id,
      itemQuantity:'0',
      title:'',
      itemPrice:'0',
    };
    this.setPrice.bind(this);
    this.setQuantity.bind(this);
  }

  /**
  * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
  */
  submit(){
    let title = this.state.title;
    let amount = this.state.itemQuantity.length==0 ? parseFloat(0) : parseFloat(this.state.itemQuantity);
    let unit_price = this.state.itemPrice.length==0 ? parseFloat(0) : parseFloat(this.state.itemPrice);
    this.props.addItem({title,amount,unit_price},this.props.id,this.state.unit,this.props.token);
    Actions.pop();
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
            <Title>{i18n.t('addItem')}</Title>
          </Body>
          <Right>
            { this.state.title.length!=0 &&
              <Button transparent onPress={this.submit.bind(this)}>
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
);
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ itemReducer, loginReducer }) => {
  const { units } = itemReducer;
  const { token } = loginReducer;
  return { token,units };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{addItem})(ItemAdd);
