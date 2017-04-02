/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import DroneDisplay from './app/components/DroneDisplay.js'

export default class RaspberryDrone extends Component {
  render() {
    return (
      <DroneDisplay/>
    );
  }
}

AppRegistry.registerComponent('RaspberryDrone', () => RaspberryDrone);