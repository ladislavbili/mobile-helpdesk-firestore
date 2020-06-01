import React, { Component } from 'react';
import { Modal, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import RichEditor from '../../../components/richEditor';
import { View, Body, Container, Content, Icon, Input, Item, Label, Text, Footer, FooterTab, Button, Picker,  ListItem, Header,Title , Left, Right, List , CheckBox } from 'native-base';
import i18n from 'i18next';
import InputError from '../../../components/inputError'
import {  } from '../../../redux/actions';

export default class TabDescription extends Component {
  constructor(props){
    super(props);
    this.state = {
      descriptionEditor: null
    }
  }

  closeEditor(){
    if(this.state.descriptionEditor === null){
      return;
    }
    this.state.descriptionEditor.blur()
  }

  render() {
    return (
      <Container>
        <Content style={{ padding: 15 }}>

          <Text note>{i18n.t('taskName')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('enterTaskName')}
              value={ this.props.data.title }
              onFocus={() => this.closeEditor.bind(this)}
              onChangeText={ value => this.props.setData( { title: value } ) }
              />
            <InputError
              show = {this.props.data.title.length === 0}
              message = "restrictionMustEnterTaskTitle"
              />
          </View>

          <Text note>{i18n.t('taskDescription')}</Text>
          <RichEditor
            defaultValue={this.props.data.description}
            setEditor={(editor)=>{
              this.setState({descriptionEditor:editor.current})
          }}
            onChange={()=>{
              if(this.state.descriptionEditor === null){
                return;
              }
              this.props.setData({ description: this.state.descriptionEditor.getEditorState() });
            }}
            placeholder={i18n.t('enterTaskDescription')}
            />
      </Content>
    </Container>
  );
  }
}
