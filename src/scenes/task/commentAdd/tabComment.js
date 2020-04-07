
import React, { Component } from 'react';
import { Title, View, Container, Content,Input, Text, Footer, FooterTab, Button, Icon, Item, Label, CheckBox } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import i18n from 'i18next';
import {} from '../../../redux/actions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

/**
 * This component allows user to comment the task
 * @extends Component
 */
class TabComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      comment: '',
      commentHeight: 50,
      internal: false,
      saving: false,
    };
  }

  getHistoryMessage(type, data){
    let user = "Používateľ " + this.props.currentUser.userData.name + ' ' + this.props.currentUser.userData.surname;
    switch (type) {
      case 'status':{
        return `${user} zmenil status z ${data.oldStatus?data.oldStatus.title:''} na ${data.newStatus?data.newStatus.title:''}.`;
      }
      case 'comment':{
        return user + ' komentoval úlohu.';
      }
      default:{
        return user + ' spravil nedefinovanú zmenu.';
      }
    }
  }

/**
 * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
 */
 submitComment(){
   this.setState({saving:true});

   let body={
     user:this.props.currentUser.id,
     comment: this.state.comment,
     subject: '',
     isEmail: false,
     isInternal:this.state.internal,
     createdAt: (new Date()).getTime(),
     task:this.props.id,
     attachments: []
   }
   database.collection('help-comments').add(body).then(()=>{
     database.collection('help-task_history').add({
       message:this.getHistoryMessage('comment'),
       createdAt:(new Date()).getTime(),
       task:this.props.id,
     });
     this.props.updateComments();
     Actions.pop();
     this.setState({saving:false,comment:'',internal:false});
   })
 }

  render() {
    let permissions = this.props.projects.find( (project) => project.id === this.props.tasks.find( (task) => task.id === this.props.id ).project ).permissions.find((permission) => permission.user === this.props.currentUser.id);
    let canSendInternal = (permissions && permissions.internal) || this.props.currentUser.userData.role.value > 1;
    return (
      <Container>
        <Content style={{ padding: 15 }}>

          {
            canSendInternal &&
            <Item inlineLabel style={{marginBottom:20, borderWidth:0,marginTop:10,paddingBottom:5}} onPress={()=>this.setState({internal:!this.state.internal})}>
              <CheckBox checked={this.state.internal} color='#3F51B5' onPress={()=>this.setState({internal:!this.state.internal})}/>
              <Label style={{marginLeft:15}}>{i18n.t('internal')}</Label>
            </Item>

          }

          <Text note>{i18n.t('emailMessage')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15}}>
            <Input
              style={{height:Math.max(35, this.state.commentHeight)}}
              multiline={true}
              onContentSizeChange={(event) => this.setState({ commentHeight: event.nativeEvent.contentSize.height })}
              onChange={ event => this.setState({comment:event.nativeEvent.text}) }
              placeholder={i18n.t('enterEmailMessage')}
              value={this.state.comment}
              />
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }} onPress={Actions.pop}>
              <Icon active style={{ color: 'white' }} name="trash" />
              <Text style={{ color: 'white' }} >{i18n.t('cancel')}</Text>
            </Button>
          </FooterTab>
          <FooterTab>
            <Button iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }} disabled={ this.state.comment.length < 1 || this.state.saving} onPress={this.submitComment.bind(this)}>
              <Icon active style={{ color: 'white' }} name="add" />
              <Text style={{ color: 'white' }} >{i18n.t('send')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpTasks, storageHelpProjects, loginReducer }) => {
  const { tasks } = storageHelpTasks;
  const { projects } = storageHelpProjects;
  return {
    tasks,
    projects,
    currentUser: loginReducer,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{ })(TabComment);
