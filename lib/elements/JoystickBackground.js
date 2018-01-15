import React from 'react';
import {
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  getTopLeftCoordinatesFromCenter
} from '../utilities/utilityFunctions';

const propTypes = {
  heightOfHandle: PropTypes.number,
  length: PropTypes.number.isRequired,
  neutralPointX: PropTypes.number,
  neutralPointY: PropTypes.number,
  shape: PropTypes.oneOf(['vertical', 'horizontal', 'circular']).isRequired,
  style: ViewPropTypes.style,
  widthOfHandle: PropTypes.number,
};

const JoystickBackground = (props) => {
  let specifiedWidth;
  let specifiedHeight;
  let height = 0;
  let width = 0;
  let borderRadius = 0;

  if (props.style) {
    specifiedHeight = StyleSheet.flatten(props.style).height;
    specifiedWidth = StyleSheet.flatten(props.style).width;
  }
  if (props.shape === 'vertical') {
    height = specifiedHeight ? specifiedHeight : 2 * props.length;
    width = specifiedWidth ? specifiedWidth : props.widthOfHandle;
  }
  if (props.shape === 'horizontal') {
    height = specifiedHeight ? specifiedHeight : props.heightOfHandle;
    width = specifiedWidth ? specifiedWidth : 2 * props.length;
  }
  if (props.shape === 'circular') {
    height = 2 * props.length;
    width = 2 * props.length;
    borderRadius = props.length;
  }

  let position = getTopLeftCoordinatesFromCenter(
    props.neutralPointY,
    props.neutralPointX,
    width, height
  );

  let defaultStyle = StyleSheet.create({
    background: {
      height: height,
      width: width,
      borderRadius: borderRadius,
      borderWidth: 1,
      borderColor: 'black',
      position: 'absolute',
      left: position.left,
      top: position.top,
    }
  });

  return <View style={[defaultStyle.background, props.style]} />;
};

JoystickBackground.propTypes = propTypes;

export default JoystickBackground;
