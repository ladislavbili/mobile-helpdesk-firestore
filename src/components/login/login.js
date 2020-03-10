import React, { Component } from 'react';
import { ActivityIndicator, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { View, Container, Button, Text, Content, Item, Form, Input, Label, Header, Body, Title,ListItem,Right, Icon } from 'native-base';
import jwt_decode from 'jwt-decode';
import styles from './styles';
import {loginUser} from '../../redux/actions';
import i18n from 'i18next';
import Navigation from '../navigation';

/**
  * Component controlling the login screen
  * @extends Component
  */
class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      username:'admin@admin.sk',
      password:'12345678'
    }
  }
  /**
    * After the component is mounted, we dont allow user to go back if he's not logged in
    */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return !this.props.authenticated;
    });
  }
  render() {
    if (this.props.authenticated) {
      return (
        <Navigation {...this.props} />
      );
    }
    return (
      <Container>
        <Content padder style={{ backgroundColor: '#FFF', padding: 20 }}>
          <Header>
            <Body>
              <Title>{i18n.t('appName')}</Title>
            </Body>
          </Header>
          <Form>
            <Item inlineLabel>
              <Input
                placeholder={i18n.t('enterUsername')}
                value={this.state.username}
                onChangeText={(value)=>this.setState({username:value})}
                />
            </Item>
            <Item inlineLabel last>
              <Input
                secureTextEntry={true}
                placeholder={i18n.t('enterPassword')}
                value={this.state.password}
                onChangeText={(value)=>this.setState({password:value})}
                />
            </Item>
          </Form>
          <View style={{ marginBottom: 80, marginTop: 20 }}>
            <Button
              block
              primary
              onPress={()=>this.props.loginUser(this.state.username,this.state.password)}
              disabled={this.props.loading}
              >
              {
                this.props.loading?
                <ActivityIndicator
                  animating size={ 'large' }
                  color='#007299' /> :
                  <Text>{i18n.t('login')}</Text>
                }
              </Button>
                <Text style={styles.errorMessage}>{this.props.error}</Text>
            </View>
          </Content>
        </Container>
      );
    }
  }


  //creates function that maps actions (functions) to the redux store
  const mapStateToProps = ({ loginReducer }) => {
    return { error, loading, authenticated } = loginReducer;
  };

  //exports created Component connected to the redux store and redux actions
  export default connect(mapStateToProps,{loginUser})(Login);
