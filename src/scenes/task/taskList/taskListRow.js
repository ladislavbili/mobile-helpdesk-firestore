import React, { Component } from 'react';
import { Icon, Text, Right, Body, ListItem, Item } from 'native-base';
import { View } from 'react-native'
import { connect } from 'react-redux';

import i18n from 'i18next';
import {startLoading} from '../../../redux/actions';
import { Actions } from 'react-native-router-flux';
import {formatDate} from '../../../helperFunctions';

/**
* Displays data about one specific task that it recives in props
* @extends Component
*/
class TaskListRow extends Component {
  render() {
    let project=this.props.task.project;
    let status=this.props.task.status;
    let assignedTo=this.props.task.assignedTo;
    let deadline=this.props.task.deadline;
    //console.log(deadline);
    return (
      <ListItem button onPress={()=>{Actions.taskEdit({id:this.props.task.id})}} >
        <Body>
          <Text>
            {this.props.task.important && <Icon name="star" style={{ color: 'color: rgb(255, 193, 7)', fontSize: 20 }} />}
            {this.props.task.important? " " : ""}
            { this.props.task.title ? this.props.task.title : '' }
          </Text>
          <Text numberOfLines={1} note>
            {i18n.t('project')}: {project ? project.title : i18n.t('noProject')}
          </Text>
          <Text numberOfLines={1} note>{i18n.t('assignedTo')}: {
              assignedTo.length === 1 ? assignedTo[0].email : (
                assignedTo.length < 1 ? i18n.t('noUser') :
                `${assignedTo.length - 1 }+ ${assignedTo[0].email}`
              )
            }</Text>
          <Text numberOfLines={1} note>{i18n.t('deadline')}: { deadline ? formatDate(deadline) : i18n.t('noDeadline') }</Text>
          <Item style={{backgroundColor:status.color,flex:1,flexDirection:'column' }}>
            <Text style={{color:'white',paddingLeft:10,paddingRight:10,flex:1,flexDirection:'column'}}>{i18n.t(status.title)}</Text>
          </Item>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = () => {
  return {};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{startLoading})(TaskListRow);
