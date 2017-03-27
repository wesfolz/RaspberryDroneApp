'use-strict';

import React, { Component } from 'react';

import {
  Slider,
  Text,
  StyleSheet,
  View
} from 'react-native';

import SliderControl from './SliderControl.js'

class ThrottleYaw extends Component {

	resetYaw() {
		this.props.yawCallback(0);
		this.yawSlider.resetSlider();
	}

	render() {
		return (
			<View style={styles.container}>
				<SliderControl 
					style={styles.vertical_slider}
					maximumTrackTintColor={'#5DFC0A'}
					onValueChange={(value) => this.props.throttleCallback(value)}
				/>
				<SliderControl
					ref={component => this.yawSlider = component}
					style={styles.slider}
					minimumValue={-1}
		          	maximumValue={1}
      	 	        minimumTrackTintColor={'blue'}
          			maximumTrackTintColor={'blue'}
		          	value={0}
					onSlidingComplete={() => this.resetYaw()}
					onValueChange={(value) => this.props.yawCallback(value)}
				/>
			</View>

		);
	}
}

var styles = StyleSheet.create({
  container: {
  	flex: 1,
  	flexDirection: 'column',
  },
  slider: {
    width: 200,
    marginBottom: 50,
    marginTop: 0,
  },
  vertical_slider: {
    width: 200,
    transform: [{rotate: '-90deg'}],
    marginBottom: 100,
  }
});

export default ThrottleYaw;