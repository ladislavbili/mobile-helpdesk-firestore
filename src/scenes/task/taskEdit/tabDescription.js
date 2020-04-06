import React, { Component } from 'react';
import { Modal, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import RichEditor from '../../../components/richEditor';
import { View, Body, Container, Content, Icon, Input, Item, Label, Text, Footer, FooterTab, Button, Picker,  ListItem, Header,Title , Left, Right, List , CheckBox } from 'native-base';
import i18n from 'i18next';
import {  } from '../../../redux/actions';
import firebase from 'react-native-firebase';
let database = firebase.firestore();

/**
 * Tab of the main menu that is responsible for adding a new task
 * @extends Component
 */
class TabAtributes extends Component {
  constructor(props) {
    super(props);
    let task = this.props.tasks.find((task)=>task.id === this.props.id);

    this.state = {
      title:task.title,
      description:task.description,
      descriptionEditor:null,

      submitError:false,
    }
    this.props.saveFunction(this.submitForm.bind(this));
    this.canSave.bind(this);
  }

  canSave(){
    return this.state.title !== '' && this.state.descriptionEditor !== null
  }

  inputChanged(){
    this.props.inputChanged(true,this.canSave());
  }

  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submitForm(){
    this.setState({submitError: false})
		//checks if all requirements for saving were met
		if ( this.canSave() ) {
      let body = {
        title:this.state.title,
        description: this.state.descriptionEditor.getEditorState(),
      }
      database.collection('help-tasks').doc(this.props.id).update(body).then((res)=>{
        this.props.inputChanged(false,this.canSave());
      });
		}else{
      this.setState({submitError:true})
    }
		//as a tags we send titles not ids
  }

  render() {
    //this.state.descriptionEditor.getEditorState()
    return (
      <Container>
        <Content style={{ padding: 15 }}>

          <Text note>{i18n.t('taskName')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterTaskName')}
              value={ this.state.title }
              onChangeText={ value =>{ this.setState({title:value}, this.inputChanged.bind(this)) }}
              />
            {this.state.submitError && this.state.title==='' && <Text style={{color:'red'}}>{i18n.t('restrictionMustEnterTaskTitle')}</Text>}
          </View>

          <Text note>{i18n.t('taskDescription')}</Text>
          <RichEditor
            defaultValue={this.state.description}
            setEditor={(editor)=>{
              this.setState({descriptionEditor:editor.current})
          }}
            onChange={()=>{
                this.setState({ description:this.state.descriptionEditor.getEditorState() }, this.inputChanged.bind(this));
            }}
            placeholder={i18n.t('enterTaskDescription')}
            />
      </Content>
    </Container>
  );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpTasks }) => {
  const { tasks } = storageHelpTasks;
  return { tasks };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{ })(TabAtributes);
