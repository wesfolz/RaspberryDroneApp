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
  Dimensions,
  Alert
} from 'react-native';

import Button from './Button.js'

import WebSocketWrapper from '../WebSocketWrapper'
import ThrottleYaw from './ThrottleYaw.js'
import Joystick from './Joystick.js'

const window = Dimensions.get('window');

class DroneDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {ws: new WebSocketWrapper('ws://172.24.1.1:8080/websocket', this.messageCallback), 
      message: '', connectionStatus: 'Connect', armingStatus: 'Arm', connectColor: '#ff0000', armColor: '#ff0000'};
  }

  messageCallback = (data) => {
    console.log('message callback ' + data);

    switch(data) {
      case 'socketOpened':
        this.setState({connectionStatus: 'Connecting fc...', connectColor: '#00ffff20'}); 
        this.state.ws.send('fcConnect');
        break;
      case 'socketClosed':
      	alert('Websocket connection closed.');
      	this.setState({connectionStatus: 'Connect', connectColor: '#ff0000'}); 
      	break;
      case 'connected':
        this.setState({connectionStatus: 'Shutdown', connectColor: '#00ffff20'});
        break;
      case 'armed':
        this.setState({armingStatus: 'Disarm', armColor: '#00ffff20'});
        break;
      case 'disarmed':
        this.setState({armingStatus: 'Arm', armColor: '#ff0000'});
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
    if(this.state.ws.socket == null || this.state.connectionStatus == 'Connect') {
      this.state.ws.connect();
      this.setState({connectionStatus: 'Connecting...', connectColor: '#ffff0080'});
    }
    else {
      this.shutdownPi();
    }
  }

  armMotors = () => {
    if(this.state.armingStatus == 'Arm') {
      this.state.ws.send('fcArm');
      this.setState({armingStatus: 'Arming...', armColor: '#ffff0080'});
    }
    else if(this.state.armingStatus == 'Disarm') {
      this.state.ws.send('fcDisarm');
      this.setState({armingStatus: 'Disarming...', armColor: '#ffff0080'});
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

  shutdownPi = () => {
    Alert.alert(
      'Shutdown',
      'Are you sure you want to shutdown the RPi?',
      [
        {text: 'OK', onPress: () => this.state.ws.send('shutdownPi')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: false })
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
              source={{uri: 'http://172.24.1.1:5000'}}
          />
          <View style={styles.columnContainer}>
            <Button onPress={() => this.connect()} label={this.state.connectionStatus} color={this.state.connectColor}/>
            <Button onPress={() => this.armMotors()} label={this.state.armingStatus} color={this.state.armColor}/>
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