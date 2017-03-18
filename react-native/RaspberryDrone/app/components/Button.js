import React, { Component } from 'react';
import {Text, TouchableHighlight} from 'react-native'

import WebSocketWrapper from '../WebSocketWrapper.js'

class Button extends Component 
{
  _onPressButton() {
    var ws = new WebSocketWrapper();

    ws.send('heartbeat');
    console.log("You tapped the button!");
  }

  render() {
    return (
      <TouchableHighlight onPress={this._onPressButton}>
        <Text>Send</Text>
      </TouchableHighlight>
    );
  }

}
export default Button;