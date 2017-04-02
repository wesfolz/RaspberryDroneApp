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

  messageCallback = (e) => {
    console.log('message callback ' + e.data);

    switch(e.data) {
      case 'socketOpened':
        this.state.ws.send('fcConnect');
        break;
      case 'connected':
        this.setState({connectionStatus: 'Connected'});
        break;
      case 'armed':
        this.setState({armingStatus: 'Armed'});
        break;
      case 'disarmed':
        this.setState({armingStatus: 'Disarmed'});
        break;
      case 'streaming':
        this.webView.reload();
        break;
    }
  }

  setThrottle = (value) => {
    this.state.ws.send('fcSetThrottle,'+value);
  }

  setYaw = (value) => {
    this.state.ws.send('fcSetYaw,'+value);
  }

  connect = () => {
    this.state.ws.connect();
    this.setState({connectionStatus: 'Connecting'});
  }

  armMotors = () => {
    if(this.state.armingStatus == 'Disarmed') {
      this.state.ws.send('fcArm');
      this.setState({armingStatus: 'Arming'});
    }
    else if(this.state.armingStatus == 'Armed') {
      this.state.ws.send('fcDisarm');
      this.setState({armingStatus: 'Disarming'});
    }
  }

  setRollPitch = (roll, pitch) => {
    this.state.ws.send('fcSetRoll,'+roll);
    //console.log('pitch ' + pitch);
    this.state.ws.send('fcSetPitch,'+pitch); 
  }

  startStream = () => {
    this.state.ws.send('startStream');
    //this.webView.reload();
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
              ref={component => this.webView = component} 
              style={styles.absolutePosition}
              source={{uri: 'http://192.168.0.103:5000'}}
          />
          <View style={styles.columnContainer}>
            <Button onPress={() => this.connect()} label={this.state.connectionStatus}/>
            <Button onPress={() => this.armMotors()} label={this.state.armingStatus}/>
            {/*<Button onPress={() => this.startStream()} label={"Stream"}/>
            <Button onPress={() => this.webView.reload()} label={"reload"}/>*/}
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