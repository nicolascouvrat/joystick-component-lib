import React from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
} from 'react-native';
import Draggable from './Draggable';
import PropTypes from 'prop-types';

const DEFAULT_HANDLE_SIZE = 25;
const propTypes = {
  backgroundStyle: View.propTypes.style,
  handleStyle: View.propTypes.style,
  left: PropTypes.number,
  mainDimension: PropTypes.number.isRequired,
  //onMove: PropTypes.function,
  //onRelease: PropTypes.function,
  //onStartMove: PropTypes.function,
  shape: PropTypes.oneOf(['vertical', 'horizontal']).isRequired,
  top: PropTypes.number,
};

/**
 * gets coordinates of the top left from center coordinates
 * @param  {number} top    top coordinate of center
 * @param  {number} left   left coordinate of center
 * @param  {number} width  width of component
 * @param  {number} height height of component
 * @return {object}        top and left coordinates of top left corner
 */
function getTopLeftCoordinates(top, left, width, height) {
  return {
    top: top - height / 2,
    left: left - width / 2,
  };
};

function shallowEqual(objectA, objectB) {
  if (objectA === objectB) {
    return true;
  }

  if (objectA === null || typeof objectA !== 'object' ||
      objectB === null || typeof objectB !== 'object') {
    return false;
  }

  keysOfA = Object.keys(objectA);
  keysOfB = Object.keys(objectB);

  if (keysOfA.length !== keysOfB.length) {
    return false;
  }

  aHasProp = hasOwnProperty.bind(objectA);
  bHasProp = hasOwnProperty.bind(objectB);
  for (var i = 0; i < keysOfA.length; i++) {
    if (aHasProp(keysOfA[i])) {
      if (!bHasProp(keysOfA[i]) || objectB[keysOfA[i]] !== objectA[keysOfA[i]]) {
        return false;
      }
    }
  }

  return true;
}

class Joystick1D extends React.Component {
  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, ges) => {
        this.setState.bind(this)({ gesture: ges });
      },
    });
    this.state = {
      gesture: undefined,
      handleCenterY: this.props.top,
      handleCenterX: this.props.left,
    };
    this.setDefaultDimensions();

    this.onHandleMove = this.onHandleMove.bind(this);
    this.onHandleRelease = this.onHandleRelease.bind(this);
  }

  setDefaultDimensions() {
    let specifiedHandleWidth;
    let specifiedHandleHeight;
    let specifiedBackgroundWidth;
    let specifiedBackgroundHeight;
    if (this.props.handleStyle) {
      specifiedHandleWidth = StyleSheet.flatten(this.props.handleStyle).width;
      specifiedHandleHeight = StyleSheet.flatten(this.props.handleStyle).height;
    };
    if (this.props.backgroundStyle) {
      specifiedBackgroundHeight = StyleSheet.flatten(this.props.backgroundStyle).height;
      specifiedBackgroundWidth = StyleSheet.flatten(this.props.backgroundStyle).width;
    };
    // attribute defaults
    this.handleWidth = specifiedHandleWidth ? specifiedHandleWidth : DEFAULT_HANDLE_SIZE;
    this.handleHeight = specifiedHandleHeight ? specifiedHandleHeight : DEFAULT_HANDLE_SIZE;
    if (this.props.shape === 'vertical') {
      this.backgroundWidth = specifiedBackgroundWidth ? specifiedBackgroundWidth : this.handleWidth;
      this.backgroundHeight = specifiedBackgroundHeight ? specifiedBackgroundHeight : 2 * this.props.mainDimension;
    };
    if (this.props.shape === 'horizontal') {
      this.backgroundWidth = specifiedBackgroundWidth ? specifiedBackgroundWidth : 2 * this.props.mainDimension;
      this.backgroundHeight = specifiedBackgroundHeight ? specifiedBackgroundHeight : this.handleHeight;
    };
  }

  includes(x, y) {
    let xMin = this.state.handleCenterX - this.handleWidth / 2;
    let xMax = this.state.handleCenterX + this.handleWidth / 2;
    let yMin = this.state.handleCenterY - this.handleHeight / 2;
    let yMax = this.state.handleCenterY + this.handleHeight / 2;

    return x > xMin && x < xMax && y > yMin && y < yMax;
  }

  /**
   * Function to be triggered when handle moves
   * @param  {object} touch object similar to gesture (contains dx, dy)
   * @return {[type]}       [description]
   */
  onHandleMove(touch) {
    this.setState((prevState, props) => {
      return ({
        handleCenterX: this.props.top + touch.dx,
        handleCenterY: this.props.left + touch.dy,
      });
    });
    console.log(this.state.handleCenterX);
  }

  onHandleRelease(touch) {
    this.setState({
      handleCenterX: this.props.top,
      handleCenterY: this.props.left,
    });
  }

  render() {
    console.log("render called");
    // check if dimensions were specified by the parent component


    let handlePosition = getTopLeftCoordinates(this.props.top, this.props.left, this.handleWidth, this.handleHeight);
    let backgroundPosition = getTopLeftCoordinates(this.props.top, this.props.left, this.backgroundWidth, this.backgroundHeight);

    let defaultStyle = StyleSheet.create({
      handle: {
        height: this.handleHeight,
        width: this.handleWidth,
        backgroundColor: 'black',
        borderRadius: this.handleWidth / 2,
      },
      background: {
        width: this.backgroundWidth,
        height: this.backgroundHeight,
        borderWidth: 1,
        borderColor: 'black',
        position: 'absolute',
        top: backgroundPosition.top,
        left: backgroundPosition.left,
      },
    });

    return (
      <View>
        <View
          style={[defaultStyle.background, this.props.backgroundStyle]}
        />
        <Draggable
          gesture={this.state.gesture}
          left={handlePosition.left}
          onMove={this.onHandleMove}
          onRelease={this.onHandleRelease}
          override={this._panResponder}
          style={[defaultStyle.handle, this.props.handleStyle]}
          top={handlePosition.top}
          xConstraints={this.props.shape === 'vertical' ? [0, 0] : [-this.props.mainDimension, this.props.mainDimension]}
          yConstraints={this.props.shape === 'vertical' ? [-this.props.mainDimension, this.props.mainDimension] : [0, 0]}
        />
      </View>
    );
}

};

Joystick1D.propTypes = propTypes;

export default Joystick1D;
