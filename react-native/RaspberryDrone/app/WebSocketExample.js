/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 * @providesModule WebSocketExample
 */
'use strict';

/* eslint-env browser */

//const React = require('react');
import React, { Component } from 'react';
import {
  PixelRatio,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';

const DEFAULT_WS_URL = 'ws://192.168.0.102:8080/websocket';

const WS_EVENTS = [
  'close',
  'error',
  'message',
  'open',
];

const WS_STATES = [
  /* 0 */ 'CONNECTING',
  /* 1 */ 'OPEN',
  /* 2 */ 'CLOSING',
  /* 3 */ 'CLOSED',
];

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

class Row extends Component {
  render() {
    return (
      <View style={styles.row}>
        <Text>{this.props.label}</Text>
        <Text>{this.props.value}</Text>
      </View>
    );
  }
}

function showValue(value) {
  if (value === undefined || value === null) {
    return '(no value)';
  }
  console.log('typeof Uint8Array', typeof Uint8Array);
  if (typeof ArrayBuffer !== 'undefined' &&
      typeof Uint8Array !== 'undefined' &&
      value instanceof ArrayBuffer) {
    return `ArrayBuffer {${String(Array.from(new Uint8Array(value)))}}`;
  }
  return value;
}

type State = {
  url: string;
  fetchStatus: ?string;
  socket: ?WebSocket;
  socketState: ?number;
  lastSocketEvent: ?string;
  lastMessage: ?string | ?ArrayBuffer;
  outgoingMessage: string;
};

class WebSocketExample extends Component {

  static title = 'WebSocket';
  static description = 'WebSocket API';

  state: State = {
    url: DEFAULT_WS_URL,
    fetchStatus: null,
    socket: null,
    socketState: null,
    lastSocketEvent: null,
    lastMessage: null,
    outgoingMessage: '',
  };

  _connect = () => {
    const socket = new WebSocket(this.state.url);
    socket.onMessage = (e) => {
      console.log('on message');
      state.lastMessage = e.data;
    }
    WS_EVENTS.forEach(ev => socket.addEventListener(ev, this._onSocketEvent));
    this.setState({
      socket,
      socketState: socket.readyState,
    });
  };

  _disconnect = () => {
    if (!this.state.socket) {
      return;
    }
    this.state.socket.close();
  };

  // Ideally this would be a MessageEvent, but Flow's definition
  // doesn't inherit from Event, so it's 'any' for now.
  // See https://github.com/facebook/flow/issues/1654.
  _onSocketEvent = (event) => {
    const state: any = {
      socketState: event.target.readyState,
      lastSocketEvent: event.type,
    };
    if (event.type === 'message') {
      //state.lastMessage = event.data;
      var x = 1;
    }
    this.setState(state);
  };

  _sendText = () => {
    if (!this.state.socket) {
      return;
    }
    this.state.socket.send(this.state.outgoingMessage);
    this.setState({outgoingMessage: ''});
  };


  _sendBinary = () => {
    if (!this.state.socket ||
        typeof ArrayBuffer === 'undefined' ||
        typeof Uint8Array === 'undefined') {
      return;
    }
    const {outgoingMessage} = this.state;
    const buffer = new Uint8Array(outgoingMessage.length);
    for (let i = 0; i < outgoingMessage.length; i++) {
      buffer[i] = outgoingMessage.charCodeAt(i);
    }
    this.state.socket.send(buffer);
    this.setState({outgoingMessage: ''});
  };

  render() {
    const socketState = WS_STATES[this.state.socketState || -1];
    const canConnect =
      !this.state.socket ||
      this.state.socket.readyState >= WebSocket.CLOSING;
    const canSend = !!this.state.socket;
    return (
      <ScrollView style={styles.container}>
        <Row
          label="Current WebSocket state"
          value={showValue(socketState)}
        />
        <Row
          label="Last WebSocket event"
          value={showValue(this.state.lastSocketEvent)}
        />
        <Row
          label="Last message received"
          value={showValue(this.state.lastMessage)}
        />
        <TextInput
          style={styles.textInput}
          autoCorrect={false}
          placeholder="Server URL..."
          onChangeText={(url) => this.setState({url})}
          value={this.state.url}
        />
        <View style={styles.buttonRow}>
          <Button
            onPress={this._connect}
            label="Connect"
            disabled={!canConnect}
          />
          <Button
            onPress={this._disconnect}
            label="Disconnect"
            disabled={canConnect}
          />
        </View>
        <TextInput
          style={styles.textInput}
          autoCorrect={false}
          placeholder="Type message here..."
          onChangeText={(outgoingMessage) => this.setState({outgoingMessage})}
          value={this.state.outgoingMessage}
        />
        <View style={styles.buttonRow}>
          <Button
            onPress={this._sendText}
            label="Send as text"
            disabled={!canSend}
          />
          <Button
            onPress={this._sendBinary}
            label="Send as binary"
            disabled={!canSend}
          />
        </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
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

  textInput: {
    height: 40,
    backgroundColor: 'white',
    margin: 8,
    padding: 8,
  },
});

module.exports = WebSocketExample;