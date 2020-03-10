import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Picker, Item, Footer, FooterTab, Container, Header, Title, Content, Button, Icon, Text, Left, Body, View, Right, CheckBox, Label} from 'native-base';
import { Actions } from 'react-native-router-flux';
import i18n from 'i18next';
import {editSubtask} from '../../redux/actions';
import {formatDate} from '../../helperFunctions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

/**
* Allows the user to create a single item assigned to the task
* @extends Component
*/
class ItemAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:this.props.data.title,
      from: this.props.data.from===0||this.props.data.from===null?null:this.props.data.from*1000,
      fromOpen: false,
      to: this.props.data.to===0||this.props.data.to===null?null:this.props.data.to*1000,
      toOpen: false,
      hours: this.props.data.hours?this.props.data.hours.toString():'',
      done:this.props.data.done,
    };
  }

  /**
  * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
  */
  submit(){
    let body={
      title:this.state.title,
      from:this.state.from!==null?this.state.from.valueOf() / 1000 : 'null',
      to:this.state.to!==null?this.state.to.valueOf() / 1000 : 'null',
      hours:this.state.hours!==''?this.state.hours:null,
      done:this.state.done
    }

    if(body.title===''){
      return;
    }
    this.props.editSubtask(body,this.props.data.id,this.props.id,this.props.token);
    Actions.pop();
  }

  /**
   * Set's item's price if the input string is valid decimal number
   * @param {string} input price entered by the user
   */
  checkNumber(input){
    var valid = (input.match(/^-?\d*(\.\d*)?$/));
    let value = parseFloat(parseFloat(valid).toFixed(2));
    if(input.endsWith('.') && input.split('.').length-1 < 2){
      return input;
    }
    if(input === '' || isNaN(value))return '';
    if(valid && !(value < 0)){
      return value.toString();
    }
    return false;
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
            <Title>{i18n.t('editSubtask')}</Title>
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
          <Item inlineLabel style={{marginBottom:20, borderWidth:0,marginTop:10,paddingBottom:5}}>
            <CheckBox checked={this.state.done} color='#3F51B5' onPress={()=>this.setState({done:!this.state.done})}/>
            <Label style={{marginLeft:15}}>{i18n.t('done2')}</Label>
          </Item>
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

        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Button block style={{backgroundColor:'white'}} onPress={()=>this.setState({fromOpen:true})}>
            <Left>
              <Text style={{textAlign:'left',color:'black'}}>{this.state.from==null ? i18n.t('selectFrom') : formatDate(this.state.from)}</Text>
            </Left>
          </Button>
          <DateTimePicker
            mode="datetime"
            isVisible={this.state.fromOpen}
            onConfirm={(date)=>{
              let changes={from: date!==null?(new Date(date)).getTime():null,fromOpen:false};

              if(changes.from!==null){
                if(this.state.to!==0 && this.state.to!==null){
                  let difference = moment(this.state.to).diff(moment(new Date(date).getTime()),'months',true);
                  changes.to=difference>1|| difference < 0?null:this.state.to;
                }
                if(this.state.hours){
                  changes.to=moment(new Date(date).getTime()).add(this.state.hours,'hours').valueOf();
                }else if(this.state.to!==0&&this.state.to!==null){
                  changes.hours=parseFloat(parseFloat(moment(this.state.to).diff(moment(new Date(date).getTime()),'hours',true)).toFixed(2)).toString();
                }
              }
              this.setState(changes);
            }}
            onCancel={()=>this.setState({fromOpen:false})}
            />
        </View>

        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Button block style={{backgroundColor:'white'}} onPress={()=>this.setState({toOpen:true})}>
            <Left>
              <Text style={{textAlign:'left',color:'black'}}>{this.state.to==null ? i18n.t('selectTo') : formatDate(this.state.to)}</Text>
            </Left>
          </Button>
          <DateTimePicker
            mode="datetime"
            isVisible={this.state.toOpen}
            onConfirm={(date)=>{
              let changes={to: date!==null?(new Date(date)).getTime():null,toOpen:false};

              if(changes.to!==null){
                if(this.state.from!==0&&this.state.from!==null){
                  let difference = moment(changes.to).diff(moment(this.state.from),'months',true);
                  if(difference>1|| difference < 0){
                    return;
                  }
                }
                if(this.state.from!==0&&this.state.from!==null){
                  changes.hours=parseFloat(parseFloat(moment(changes.to).diff(moment(this.state.from),'hours',true)).toFixed(2)).toString();
                }
                else if(this.state.hours){
                  changes.from=moment(changes.to).subtract(this.state.hours,'hours').valueOf();
                }
              }
              this.setState(changes);
            }}
            onCancel={()=>this.setState({toOpen:false})}
            minimumDate={this.state.from? new Date (this.state.from):undefined}
            />
        </View>

      <Text note>{i18n.t('hours')}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Input
          value={this.state.hours}
          keyboardType='numeric'
          placeholder={i18n.t('enterHours')}
          onChangeText={ value =>{
            if(this.checkNumber(value)===false){return;};
            let changes = {hours:this.checkNumber(value)};
            if(this.state.from!==null && changes.hours!==''){
              changes.to= moment(this.state.from).add(changes.hours,'hours').valueOf();
            }
            this.setState(changes);
        }}
          />
      </View>

      </Content>
      </Container>
);
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ loginReducer }) => {
  const { token } = loginReducer;
  return { token };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{editSubtask})(ItemAdd);
