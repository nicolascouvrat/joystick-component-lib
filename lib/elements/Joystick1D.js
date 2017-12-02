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


class Joystick1D extends React.Component {
  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, ges) => {
        this.setState.bind(this)({gesture: ges});
      },
    });
    this.state = {
      gesture: undefined,
    };
  }

  render() {
    // check if dimensions were specified by the parent component
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
    let handleWidth = specifiedHandleWidth ? specifiedHandleWidth : DEFAULT_HANDLE_SIZE;
    let handleHeight = specifiedHandleHeight ? specifiedHandleHeight : DEFAULT_HANDLE_SIZE;
    let backgroundWidth;
    let backgroundHeight;
    if (this.props.shape === 'vertical') {
      backgroundWidth = specifiedBackgroundWidth ? specifiedBackgroundWidth : handleWidth;
      backgroundHeight = specifiedBackgroundHeight ? specifiedBackgroundHeight : 2 * this.props.mainDimension;
    };
    if (this.props.shape === 'horizontal') {
      backgroundWidth = specifiedBackgroundWidth ? specifiedBackgroundWidth : 2 * this.props.mainDimension;
      backgroundHeight = specifiedBackgroundHeight ? specifiedBackgroundHeight : handleHeight;
    };

    let handlePosition = getTopLeftCoordinates(this.props.top, this.props.left, handleWidth, handleHeight);
    let backgroundPosition = getTopLeftCoordinates(this.props.top, this.props.left, backgroundWidth, backgroundHeight);

    let defaultStyle = StyleSheet.create({
      handle: {
        height: handleHeight,
        width: handleWidth,
        backgroundColor: 'black',
        borderRadius: handleWidth / 2,
      },
      background: {
        width: backgroundWidth,
        height: backgroundHeight,
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
          style={[defaultStyle.handle, this.props.handleStyle]}
          top={handlePosition.top}
          left={handlePosition.left}
          xConstraints={
            this.props.shape === 'vertical' ? [0, 0] : [-this.props.mainDimension, this.props.mainDimension]
          }
          yConstraints={
            this.props.shape === 'vertical' ? [-this.props.mainDimension, this.props.mainDimension] : [0, 0]
          }
          gesture={this.state.gesture}
          override={this._panResponder}
        />
      </View>
    );
}

};

Joystick1D.propTypes = propTypes;

export default Joystick1D;
