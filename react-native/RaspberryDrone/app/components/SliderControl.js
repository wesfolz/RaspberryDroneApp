'use strict';

import React, { Component } from 'react';

import {
  Slider,
  Text,
  StyleSheet,
  View,
  TextInput
} from 'react-native';

class SliderControl extends Component {
 
  static defaultProps = {
    value: 0,
  };

  state = {
    value: this.props.value,
  };

  resetSlider = () => {
    //alert('reset slider');
    this.setState({value: 0});
    this._slider.setNativeProps({value: 0});
    console.log('reset');
    //alert(this.constructor.name);
    //alert(this.props.value);

  }

  render() {
    return (
      <View>
        <Slider
          ref={component => this._slider = component}
          style={styles.slider}
          {...this.props}
          thumbTintColor={'blue'}  />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
  slider: {
    width: 200,
  },
  vertical_slider: {
    transform: [{rotate: '-90deg'}],
    marginBottom: 100,
  }
});

export default SliderControl;