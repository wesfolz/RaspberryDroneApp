/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import Button from './app/components/Button.js'

//import WebSocketExample from './app/WebSocketExample'
import WebSocketWrapper from './app/WebSocketWrapper'


export default class RaspberryDrone extends Component {

  constructor(props) {
    super(props);
    this.state = {ws: new WebSocketWrapper('ws://192.168.0.102:8080/websocket', this.messageCallback), message: ''};
  }

  messageCallback(e) {
    console.log('message callback ' + e.data);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.state.ws.connect} label='Connect'></Button>
        <TextInput 
          style={styles.textInput}
          autoCorrect={false}
          placeholder="Message to send..."
          onChangeText={(message) => this.setState({message})}
          value={this.state.message}
        />
        <Button onPress={() => this.state.ws.send(this.state.message)} label='Send'></Button>
        <Button onPress={this.state.ws.disconnect} label='Disconnect'></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
    textInput: {
    flexDirection: 'row',
    height: 40,
    width: 200,
    backgroundColor: 'white',
    margin: 8,
    padding: 8,
  },
});

AppRegistry.registerComponent('RaspberryDrone', () => RaspberryDrone);
