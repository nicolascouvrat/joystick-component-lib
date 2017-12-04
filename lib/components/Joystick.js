import React from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
} from 'react-native';
import {
  NOOP,
  getTopLeftCoordinatesFromCenter
} from '../utilities/utilityFunctions';
import Draggable from '../elements/Draggable';
import JoystickBackground from '../elements/JoystickBackground';
import PropTypes from 'prop-types';


const DEFAULT_HANDLE_SIZE = 30;

class Joystick extends React.Component {
  static propTypes = {
    backgroundStyle: View.propTypes.style,
    draggableStyle: View.propTypes.style,
    length: PropTypes.number.isRequired,
    neutralPointX: PropTypes.number,
    neutralPointY: PropTypes.number,
    onDraggableMove: PropTypes.func,
    onDraggableRelease: PropTypes.func,
    onDraggableStart: PropTypes.func,
    shape: PropTypes.oneOf(['vertical', 'horizontal', 'circular']).isRequired,
  };

  static defaultProps = {
    onDraggableMove: NOOP,
    onDraggableRelease: NOOP,
    onDraggableStart: NOOP,
  }

  constructor(props) {
    super(props);

    this.state = {
      draggablePosition: undefined,
    };
    this._setDraggableDimensions();
    this._setConstraints();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) =>
        this.setState.bind(this)({ draggablePosition: gesture }),
    });

    this.handleDraggableMove = this.handleDraggableMove.bind(this);
    this.handleDraggableRelease = this.handleDraggableRelease.bind(this);
    this.handleDraggableStart = this.handleDraggableStart.bind(this);
  };

  handleDraggableMove(touch) {
    console.log("handle has moved");
    this.props.onDraggableMove(touch);
  }

  handleDraggableRelease(touch) {
    console.log("handle was released");
    this.props.onDraggableRelease(touch);
  }

  handleDraggableStart(touch) {
    console.log("handle was started");
    this.props.onDraggableStart(touch);
  }

  _setDraggableDimensions() {
    let specifiedDraggableWidth;
    let specifiedDraggableHeight;
    if (this.props.draggableStyle) {
      specifiedDraggableHeight = StyleSheet.flatten(this.props.draggableStyle).height;
      specifiedDraggableWidth = StyleSheet.flatten(this.props.draggableStyle).width;
    };
    this.draggableHeight = specifiedDraggableHeight ? specifiedDraggableHeight : DEFAULT_HANDLE_SIZE;
    this.draggableWidth = specifiedDraggableWidth ? specifiedDraggableWidth : DEFAULT_HANDLE_SIZE;
  }

  _setConstraints() {
    if (this.props.shape === 'circular') {
      this.draggableRConstraint = this.props.length;
    }
    if (this.props.shape === 'vertical') {
      this.draggableXConstraints = [0, 0];
      this.draggableYConstraints = [-this.props.length, this.props.length];
    }
    if (this.props.shape === 'horizontal') {
      this.draggableXConstraints = [-this.props.length, this.props.length];
      this.draggableYConstraints = [0, 0];
    }
  };

  render() {
    let draggablePosition = getTopLeftCoordinatesFromCenter(
      this.props.neutralPointY,
      this.props.neutralPointY,
      this.draggableWidth,
      this.draggableHeight,
    );
    let defaultStyle = StyleSheet.create({
      draggable: {
        height: this.draggableHeight,
        width: this.draggableWidth,
        backgroundColor: 'black',
        borderRadius: this.draggableWidth / 2,
      }
    });


    return (
      <View>
        <JoystickBackground
          heightOfHandle={this.draggableHeight}
          length={this.props.length}
          neutralPointX={this.props.neutralPointX}
          neutralPointY={this.props.neutralPointY}
          shape={this.props.shape}
          style={this.props.backgroundStyle}
          widthOfHandle={this.draggableWidth}
        />
        <Draggable
          draggablePosition={this.state.draggablePosition}
          left={draggablePosition.left}
          onDraggableMove={this.handleDraggableMove}
          onDraggableRelease={this.handleDraggableRelease}
          onDraggableStart={this.handleDraggableStart}
          rConstraint={this.draggableRConstraint}
          //responderOverride={this._panResponder}
          style={[defaultStyle.draggable, this.props.draggableStyle]}
          top={draggablePosition.top}
          xConstraints={this.draggableXConstraints}
          yConstraints={this.draggableYConstraints}
        />
      </View>
    )
  }

};

export default Joystick;
