import React, { Component } from 'react';
import { Right, Left, Container, Content, Card, CardItem, Text, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';

import {formatDate} from '../../helperFunctions';
import i18n from 'i18next';
import {deleteSubtask} from '../../redux/actions';

/**
 * Display's all of the items used in this task
 * @extends Component
 */
class TabSubtasks extends Component{
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
          this.props.deleteSubtask(id,this.props.id,this.props.token);
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
                  <Text note>{i18n.t('done2')}</Text>
                </Left>
                <Right>
                  <Text>{item.done?i18n.t('yes'):i18n.t('no')}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('from')}</Text>
                </Left>
                <Right>
                  <Text>{item.from?formatDate(item.from*1000):i18n.t('noFrom')}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text note>{i18n.t('to')}</Text>
                </Left>
                <Right>
                  <Text>{item.to?formatDate(item.to*1000):i18n.t('noTo')}</Text>
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
              {
                (this.props.ACL.includes('resolve_task') || this.props.ACL.includes('update_all_tasks')) &&
                <CardItem>
                  <Left>
                    <Button active block onPress={()=>this.deleteSubtask(item.id,item.title)}>
                      <Icon name="trash" />
                      <Text>{i18n.t('delete')}</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button active block onPress={()=>{Actions.subtaskEdit({data:item,id:this.props.id});}}>
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
              <Text note>{i18n.t('totalTime')}</Text>
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
            <Button onPress={()=>Actions.subtaskAdd({id:this.props.id}) } iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
              <Icon active style={{ color: 'white' }} name="md-add" />
              <Text style={{ color: 'white' }}>{i18n.t('subtask')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      }
    </Container>
  );
}
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ subtaskReducer, loginReducer, taskReducer}) => {
  const { subtasks } = subtaskReducer;
  const { token } = loginReducer;
  return { subtasks ,token, ACL:taskReducer.task.loggedUserProjectAcl.concat(taskReducer.task.loggedUserRoleAcl) };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{deleteSubtask})(TabSubtasks);
