import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Button, Icon, Footer, FooterTab,View, Container, Content, Text, ListItem, List,  Left, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import {ActivityIndicator} from 'react-native';
import i18n from 'i18next';
import {startLoadingComments, getComments} from '../../../redux/actions';
import {formatDate} from '../../../helperFunctions';

class TabComments extends Component {


  render() {
    let permissions = this.props.projects.find( (project) => project.id === this.props.tasks.find( (task) => task.id === this.props.id ).project ).permissions.find((permission) => permission.user === this.props.currentUser.id);
    let canSeeInternal = (permissions && permissions.internal) || this.props.currentUser.userData.role.value > 1;
    let comments = this.props.comments.filter((comment)=> !comment.internal || (comment.internal && canSeeInternal) ).map((comment)=>({
      ...comment,
      createdBy:this.props.users.find( (user) => user.id === comment.user ),
    })).sort((comment1,comment2)=>comment1.createdAt > comment2.createdAt ? -1 : 1)
    return (
      <Container>
        <Content padder style={{ marginTop: 0 }}>
          <List
          dataArray={comments}
          renderRow={comment =>
            <ListItem key={comment.id} style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',flex:1}}>
              <View style={{flex:1,flexDirection:'row'}}>
               <Left>
                 <Text note>{comment.createdBy?( comment.createdBy.name && comment.createdBy.surname ? `${comment.createdBy.name} ${comment.createdBy.surname}` :comment.createdBy.email):i18n.t('noUser')}</Text>
               </Left>
               <Right>
                 <Text note>{comment.isInternal?<Text style={{textAlign:'right',color:'red'}}>i </Text>:null}{formatDate(comment.createdAt*1000)}</Text>
               </Right>
              </View>
            <View style={{flex:1}}>
             <Text style={{textAlign:'left'}}>{comment.comment}</Text>
             </View>
         </ListItem>
       }
          />
      </Content>

      <Footer>
        <FooterTab>
          {console.log(this.props.updateComments)}
          <Button onPress={()=>{Actions.commentAdd({id:this.props.id, updateComments:this.props.updateComments})}} iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}>
            <Icon active style={{ color: 'white' }} name="md-add" />
            <Text style={{ color: 'white' }} >{i18n.t('comment')}</Text>
          </Button>
        </FooterTab>
      </Footer>

    </Container>

    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageUsers, storageHelpTasks, storageHelpProjects, loginReducer }) => {
  const { users } = storageUsers;
  const { tasks } = storageHelpTasks;
  const { projects } = storageHelpProjects;
  return {
    users,
    tasks,
    projects,
    currentUser: loginReducer,
   };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{})(TabComments);
