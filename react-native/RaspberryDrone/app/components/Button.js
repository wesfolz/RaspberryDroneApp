import React, { Component } from 'react';
import {Text, StyleSheet, View, TouchableOpacity, PixelRatio} from 'react-native'

import WebSocketWrapper from '../WebSocketWrapper.js'

class Button extends Component {
  render() {
    const label = <Text style={styles.buttonLabel}>{this.props.label}</Text>;
    if (this.props.disabled) {
      return (
        <View style={[styles.button, styles.disabledButton]}>
          {label}
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.button}>
        {label}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  note: {
    padding: 8,
    margin: 4,
    backgroundColor: 'white',
  },
  monospace: {
    fontFamily: 'courier',
    fontSize: 11,
  },
  button: {
    margin: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    backgroundColor: 'white',
    margin: 8,
    padding: 8,
  },
});

export default Button;