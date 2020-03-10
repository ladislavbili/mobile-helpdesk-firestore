import React, { Component } from 'react';
import { Right, Left, Container, Content, Card, CardItem, Text, Footer, FooterTab, Button, Icon, CheckBox, Input, View, Header, Body, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator, Alert, Modal } from 'react-native';
import { connect } from 'react-redux';
import {formatDate} from '../../helperFunctions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import i18n from 'i18next';
import {clearSubtasks,addFakeSubtask,editFakeSubtask,deleteFakeSubtask} from '../../redux/actions';

/**
* Display's all of the items used in this task
* @extends Component
*/
class TabSubtasks extends Component{
  constructor(props){
    super(props);
    this.state={
      fromOpen:false,
      toOpen:false,
      addModal:false,
      editModal:false,
      itemID:null,
      title:'',
      from:null,
      to:null,
      hours:'',
    }
    this.props.clearSubtasks();
    this.deleteSubtask.bind(this);
    this.submit.bind(this);
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

  submit(){
    let body={
      title:this.state.title,
      from:this.state.from!==null?this.state.from.valueOf() / 1000 : null,
      to:this.state.to!==null?this.state.to.valueOf() / 1000 : null,
      hours:this.state.hours!==''?this.state.hours:null,
      id:this.props.subtasks.length
    }
    if(this.state.addModal){
      this.props.addFakeSubtask(body);
    }else{
      body.id=this.state.itemID;
      this.props.editFakeSubtask(body);
    }
    this.setState({
      addModal:false,
      editModal:false,
      itemID:null,
      title:'',
      from:null,
      to:null,
      hours:'',
    });
  }

  /**
  * Delete's a single item
  * @param  {int} id    ID of an item that is meant to be deleted
  * @param  {string} title Title of the item
  */
  deleteSubtask(id,title){
    Alert.alert(
      i18n.t('deletingSubtask'),
      i18n.t('deletingSubtaskMessage')+title+'?',
      [
        {text: i18n.t('cancel'), style: 'cancel'},
        {text: i18n.t('ok'), onPress: () =>{
          this.props.deleteFakeSubtask(id);
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    let total=0;
    this.props.subtasks.map((item)=>total+=parseFloat(item.hours?item.hours:0));
    return (
      <Container>
        <Content padder style={{ marginTop: 0 }}>
          {
            this.props.subtasks.map((item)=>
            <Card key={item.id}>
              {console.log(item)}
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
                  <Text note>{i18n.t('from')}</Text>
                </Left>
                <Right>
                  <Text>{item.from!==null?formatDate(item.from*1000):i18n.t('noFrom')}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('to')}</Text>
                </Left>
                <Right>
                  <Text>{item.to!==null?formatDate(item.to*1000):i18n.t('noTo')}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('hours')}</Text>
                </Left>
                <Right>
                  <Text>{item.hours?(item.hours).toString():i18n.t('noHours')}</Text>
                </Right>
              </CardItem>
                <CardItem>
                  <Left>
                    <Button active block onPress={()=>this.deleteSubtask(item.id,item.title)}>
                      <Icon name="trash" />
                      <Text>{i18n.t('delete')}</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button active block onPress={()=>this.setState({
                        editModal:true,
                        itemID:item.id,
                        title:item.title,
                        from: item.from===0||item.from===null?null:item.from*1000,
                        to: item.to===0||item.to===null?null:item.to*1000,
                        hours: item.hours?item.hours.toString():'',
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
              <Text note>{i18n.t('totalTime')}</Text>
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
              <Text style={{ color: 'white' }}>{i18n.t('subtask')}</Text>
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
                    addModal:false,
                    editModal:false,
                    itemID:null,
                    title:'',
                    from:null,
                    to:null,
                    hours:'',
                  })}>
                    <Icon name="arrow-back" />
                  </Button>
                </Left>
                <Body>
                  <Title>{this.state.addModal?i18n.t('addSubtask'):i18n.t('editSubtask')}</Title>
                </Body>
                <Right>
                  { this.state.title.length!==0 &&
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

        </Modal>
      </View>

    </Container>
  );
  }
  }

//md-add
  //creates function that maps actions (functions) to the redux store
  const mapStateToProps = ({ subtaskReducer }) => {
    const { subtasks } = subtaskReducer;
    return { subtasks };
  };

  //exports created Component connected to the redux store and redux actions
  export default connect(mapStateToProps,{clearSubtasks,addFakeSubtask,editFakeSubtask,deleteFakeSubtask})(TabSubtasks);
