import React, { Component } from 'react';
import {Text, StyleSheet, View, TouchableOpacity, PixelRatio} from 'react-native'

import WebSocketWrapper from '../WebSocketWrapper.js'

class Button extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    const label = <Text style={styles.buttonLabel}>{this.props.label}</Text>;
    if (this.props.disabled) {
      return (
        <View style={[styles.button, styles.disabledButton, {backgroundColor: this.props.color}]}>
          {label}
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.button, {backgroundColor: this.props.color}]}>
        {label}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    padding: 8,
    borderRadius: 4,
    //backgroundColor: '#00ffff80',
    alignSelf: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: 'black',
  },
});

export default Button;