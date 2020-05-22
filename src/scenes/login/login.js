import React, { Component } from 'react';
import { ActivityIndicator, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { View, Container, Button, Text, Content, Item, Form, Input, Label, Header, Body, Title,ListItem,Right, Icon } from 'native-base';
import jwt_decode from 'jwt-decode';
import styles from './styles';
import i18n from 'i18next';
import firebase from 'react-native-firebase';
import Navigation from '../../navigation';

/**
  * Component controlling the login screen
  * @extends Component
  */
class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      email:'l.bilisics@gmail.com',
      password:'bilisicsbilisics',
      processing:false,
      error:false,
    }
  }
  /**
    * After the component is mounted, we dont allow user to go back if he's not logged in
    */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return !this.props.loggedIn;
    });
  }


  login(){
		this.setState({error:false, processing:true});
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((res)=>{
      console.log('Logged in');
			this.setState({processing:false})
		}).catch(error=>{
      console.log('Failed to Logged in');
      this.setState({error:true,processing:false});
    });
	}

  render() {
    if (this.props.loggedIn) {
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
                placeholder={i18n.t('enterEmail')}
                value={this.state.email}
                onChangeText={(value)=>this.setState({email:value})}
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
              onPress={this.login.bind(this)}
              disabled={this.state.processing}
              >
              {
                this.props.processing?
                <ActivityIndicator
                  animating size={ 'large' }
                  color='#007299' /> :
                  <Text>{i18n.t('login')}</Text>
                }
              </Button>
                {this.state.error ? <Text style={styles.errorMessage}>{i18n.t('incorrectCredentials')}</Text> : null }
            </View>
          </Content>
        </Container>
      );
    }
  }


  //creates function that maps actions (functions) to the redux store
  const mapStateToProps = ({ loginReducer }) => {
    const { loggedIn } = loginReducer;
    return {loggedIn};
  };

  //exports created Component connected to the redux store and redux actions
  export default connect(mapStateToProps,{  })(Login);
