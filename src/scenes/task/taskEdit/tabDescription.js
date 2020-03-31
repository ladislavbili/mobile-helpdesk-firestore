import React, { Component } from 'react';
import { Modal, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Body, Container, Content, Icon, Input, Item, Label, Text, Footer, FooterTab, Button, Picker,  ListItem, Header,Title , Left, Right, List , CheckBox } from 'native-base';
import i18n from 'i18next';
import {  } from '../../../redux/actions';

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
      descriptionHeight:100,
    }
    this.props.saveFunction(this.submitForm.bind(this),true);
  }

  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submitForm(){
		//checks if all requirements for creating were met
		if ( this.state.title === '' ) {
			return;
		}
		//as a tags we send titles not ids
    this.props.inputChanged(false);
  }

  render() {
    return (
      <Container>
        <Content style={{ padding: 15 }}>

          <Text note>{i18n.t('taskName')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterTaskName')}
              value={ this.state.title }
              onChangeText={ value =>{ this.props.inputChanged(true);this.setState({title:value}) }}
              />
            {this.state.submitError && this.state.title==='' && <Text style={{color:'red'}}>{i18n.t('restrictionMustEnterTaskTitle')}</Text>}
          </View>

          <Text note>{i18n.t('taskDescription')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              style={{height:Math.max(35, this.state.descriptionHeight)}}
              multiline={true}
              onChange={ event =>{this.props.inputChanged(true); this.setState({description:event.nativeEvent.text})} }
              onContentSizeChange={(event) => this.setState({ descriptionHeight: event.nativeEvent.contentSize.height })}
              value={ this.state.description }
              placeholder={i18n.t('enterTaskDescription')}
              />
          </View>
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
