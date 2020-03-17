import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { Text } from 'native-base';
import { Provider } from 'react-redux';

import Login from './src/scenes/login';

import createStore from './src/redux/store';
import './src/translations';
import i18n from 'i18next';
// C:\Users\Therian\AppData\Local\Android\sdk\tools\emulator -avd Pie_API_28_Pixel_2_-_2020

console.disableYellowBox = true;
const store=createStore();

class App extends Component<Props> {
  render() {
    return (
      <Provider store={store} >
        <Login/>
      </Provider>
    );
  }
}


AppRegistry.registerComponent('mobile_helpdesk_firestore', () => App);
