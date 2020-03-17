
import React, { Component } from 'react';
import { Title, View, Container, Content,Input, Text, Footer, FooterTab, Button, Icon, Item, Label, List, CheckBox, Left,Right, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import i18n from 'i18next';
import {addComment} from '../../../redux/actions';
import {isEmail} from '../../../helperFunctions';

/**
 * NOT FUNCTIONAL YET
 * Allows user to send a comment that will be also resend to the other users via e-mail
 * @extends Component
 */
class TabEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:'',
      messageHeight:50,
      title:'',
      internal:false,
      email_to:[],
      newMail:'',
    };
  }

  /**
    * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
    */
  submitForm(){
    this.props.addComment({title:this.state.title,body:this.state.message,internal:this.state.internal,email:this.state.email_to.length>0,email_to:this.state.email_to.length>0?this.state.email_to[0]:null},this.props.id,this.props.token);
      Actions.pop();
    }

    render() {
      return (
        <Container>
          <Content style={{ padding: 15 }}>

            {
              (this.props.ACL.includes('view_internal_note')||this.props.ACL.includes('update_all_tasks')) &&
              <Item inlineLabel style={{marginBottom:20, borderWidth:0,marginTop:10,paddingBottom:5}}>
                <CheckBox checked={this.state.internal} color='#3F51B5' onPress={()=>this.setState({internal:!this.state.internal})}/>
                <Label style={{marginLeft:15}}>{i18n.t('internal')}</Label>
              </Item>
            }

            <Text note>{i18n.t('addEmails')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <List
                dataArray={this.state.email_to}
                renderRow={data=>
                  <Text style={{color:'#007299'}}>{data}</Text>}
                    />
                  <View style={{flex:1, flexDirection:'row'}}>
                    <Body style={{flex:5,flexDirection:'row'}}>
                      <Input
                        keyboardType="email-address"
                        style={{flex:1,flexDirection:'row'}}
                        placeholder={i18n.t('enterEmail')}
                        value={ this.state.newMail }
                        onChangeText={ value => this.setState({newMail:value}) }
                        />
                    </Body>
                    <Right style={{flex:1}}>
                      <Button block disabled={!isEmail(this.state.newMail)} onPress={()=>this.setState({email_to:[this.state.newMail,...this.state.email_to],newMail:''})}>
                        <Icon active style={{ color: 'white' }} name="add" />
                      </Button>
                    </Right>
                  </View>
                </View>

                <Text note>{i18n.t('emailSubject')}</Text>
                <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                  <Input
                    placeholder={i18n.t('enterEmailSubject')}
                    value={ this.state.title }
                    onChangeText={ value => this.setState({title:value}) }
                    />
                </View>

                <Text note>{i18n.t('emailMessage')}</Text>
                <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15}}>
                  <Input
                    style={{height:Math.max(35, this.state.messageHeight)}}
                    multiline={true}
                    onContentSizeChange={(event) => this.setState({ messageHeight: event.nativeEvent.contentSize.height })}
                    onChange={ event => this.setState({message:event.nativeEvent.text}) }
                    placeholder={i18n.t('enterEmailMessage')}
                    value={this.state.message}
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
                  <Button iconLeft style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }} onPress={this.submitForm.bind(this)}>
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
      const mapStateToProps = ({ loginReducer }) => {
        const {token} = loginReducer;
        return {token};
      };

      //exports created Component connected to the redux store and redux actions
      export default connect(mapStateToProps,{addComment})(TabEmail);
