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
  TextInput,
  WebView,
  Dimensions
} from 'react-native';

import Button from './Button.js'

import WebSocketWrapper from '../WebSocketWrapper'
import ThrottleYaw from './ThrottleYaw.js'
import Joystick from './Joystick.js'

const window = Dimensions.get('window');

class DroneDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {ws: new WebSocketWrapper('ws://192.168.0.103:8080/websocket', this.messageCallback), 
      message: '', connectionStatus: 'Disconnected', armingStatus: 'Disarmed'};
  }

  messageCallback(e) {
    console.log('message callback ' + e.data);
  }

  setThrottle = (value) => {
    this.state.ws.send('test,'+value);
  }

  setYaw = (value) => {
    this.state.ws.send('test,'+value);
  }

  connect = () => {
    this.state.ws.connect();
    this.setState({connectionStatus: 'Connected'});

  }

  setRollPitch = (roll, pitch) => {
    this.state.ws.send('test,'+roll);
    //console.log('pitch ' + pitch);
    this.state.ws.send('test,'+pitch); 
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.container}>
            <ThrottleYaw
                throttleCallback={(value) => this.setThrottle(value)}
                yawCallback={(value) => this.setYaw(value)}
            />
          </View>
          <WebView 
              style={styles.absolutePosition}
              source={{uri: 'http://192.168.0.103:5000'}}
          />
          <View style={styles.columnContainer}>
            <Button onPress={() => this.connect()} label={this.state.connectionStatus}/>
            <Button onPress={() => this.state.ws.send(this.state.message)} label={this.state.armingStatus}/>
            {/*<TextInput 
              style={styles.textInput}
              autoCorrect={false}
              placeholder="Message to send..."
              onChangeText={(message) => this.setState({message})}
              value={this.state.message}
            />*/}
            <Joystick moveCallback={(roll, pitch) => this.setRollPitch(roll, pitch)}/>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  absolutePosition: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: -410,
    height: window.height,
    width: window.width,
    zIndex: -1,
  },
});

export default DroneDisplay;