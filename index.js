import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from './src/redux/store';
import Login from './src/components/login';
import './src/translations';
import i18n from 'i18next';
// C:\Users\Therian\AppData\Local\Android\sdk\tools\emulator -avd Nexus_5X_API_23

const store=createStore();
class App extends Component<Props> {
  render() {
    return (
      <Provider store={store} >
        <Login />
      </Provider>
    );
  }
}


AppRegistry.registerComponent('HelpdeskAppRest', () => App);
