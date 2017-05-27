'use strict';

import React, { Component } from 'react';

import {
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

var CIRCLE_SIZE = 50;
var OUTER_CIRCLE_SIZE = 100;

class Joystick extends Component {

  constructor(props) {
    super(props);
    this._panResponder = {};
    this._initialLeft = 25;
    this._initialTop = 200;
    this._previousLeft = 0;
    this._previousTop = 0;
    this._circleStyles = {};
    this.circle = (null : ?{ setNativeProps(props: Object): void });
    this._maxLeft = this._initialLeft + 50;
    this._maxTop = this._initialTop + 50;
    this._minLeft = this._initialLeft - 50;
    this._minTop = this._initialTop - 50;
  }
  
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = this._initialLeft;
    this._previousTop = this._initialTop;
    this._circleStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
        backgroundColor: '#00ffff20',
      }
    };
  }

  componentDidMount() {
    this._updateNativeStyles();
  }

  render() {
    return (
      <View
        style={styles.container}>
        <View style={styles.outerCircle}/>
        <View
          ref={(circle) => {
            this.circle = circle;
          }}
          style={styles.circle}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

  _highlight = () => {
    this._circleStyles.style.backgroundColor = '#00ffff80';
    this._updateNativeStyles();
  };

  _unHighlight = () => {
    this._circleStyles.style.backgroundColor = '#00ffff40';
    this._updateNativeStyles();
  };

  _updateNativeStyles = () => {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  };

  _handleStartShouldSetPanResponder = (e: Object, gestureState: Object): boolean => {
    // Should we become active when the user presses down on the circle?
    return true;
  };

  _handleMoveShouldSetPanResponder = (e: Object, gestureState: Object): boolean => {
    // Should we become active when the user moves a touch over the circle?
    return true;
  };

  _handlePanResponderGrant = (e: Object, gestureState: Object) => {
    this._highlight();
  };

  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    var newLeft = this._previousLeft + gestureState.dx;
    var newTop = this._previousTop + gestureState.dy;

    if(newLeft > this._maxLeft)
      newLeft = this._maxLeft;

    if(newTop > this._maxTop)
      newTop = this._maxTop;

    if(newLeft < this._minLeft)
      newLeft = this._minLeft;

    if(newTop < this._minTop)
      newTop = this._minTop;

    this._circleStyles.style.left = newLeft;
    this._circleStyles.style.top = newTop;
    this._updateNativeStyles();
    this.props.moveCallback((newLeft - this._initialLeft)/50, (newTop - this._initialTop)/50);
  };

  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    this._circleStyles.style.left = this._initialLeft;//+= gestureState.dx;
    this._circleStyles.style.top = this._initialTop;//+= gestureState.dy;
    this._previousLeft = this._initialLeft;
    this._previousTop = this._initialTop;
    this._unHighlight();
    this.props.moveCallback(0, 0);
  };

}

var styles = StyleSheet.create({
  outerCircle: {
    width: OUTER_CIRCLE_SIZE,
    height: OUTER_CIRCLE_SIZE,
    borderRadius: OUTER_CIRCLE_SIZE / 2,
    backgroundColor: '#00ffff20',
    borderColor: '#000000ff',
    position: 'absolute',
    left: 0,
    top: 175,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    //left: 0,
    //top: 0,
  },
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default Joystick;
