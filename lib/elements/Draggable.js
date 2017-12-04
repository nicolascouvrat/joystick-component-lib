import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
const NOOP = () => {};

/**
 * Component that can be dragged around the screen.
 * Accepts optional constraint parameters, either x y or r
 * @extends React.Component
 */

class Draggable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
    };
    this.containerStyle = StyleSheet.create({
      container: {
        position: 'absolute',
        top: this.props.top,
        left: this.props.left,
      },
    });
    // if override, it will be the responsibility of the parent to make
    // the draggable move
    this._panResponder = this.props.responderOverride ?
      this.props.responderOverride:
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gesture) => this.onTouchMove.bind(this)(gesture),
        onPanResponderEnd: (evt, gesture) => this.onTouchEnd.bind(this)(gesture),
      });
  }

  componentWillReceiveProps(newProps) {
    // we assume gesture is similar to react native gesture object
    // meaning that it had dx & dy
    if (newProps.draggablePosition) {
      // testing to prevent infinite loops!
      if (newProps.draggablePosition.dx !== this.state.pan.x.__getValue() ||
          newProps.draggablePosition.dy !== this.state.pan.y.__getValue()) {
        this.onTouchMove(newProps.draggablePosition);
      }
    }
  }

  // TODO: refactor these to be more explicit?
  // (move them to pan responder?)
  onTouchMove(touch) {

    touch = this._applyConstraints(touch);
    Animated.event([{
      dx: this.state.pan.x,
      dy: this.state.pan.y
    }])(touch);

    this.props.onDraggableMove(touch);
  }

  onTouchEnd(touch) {
    Animated.spring(
      this.state.pan,
      { toValue: { x: 0, y: 0 } }
    ).start();

    this.props.onDraggableRelease(touch);
  }

  includes(x, y) {
    // __getValue() is used because pan.x returns an object
    // of type Animated.Value
    // (see https://facebook.github.io/react-native/docs/animated.html)
    let xMin = this.props.left + this.state.pan.x.__getValue();
    let yMin = this.props.top + this.state.pan.y.__getValue();
    let xMax = xMin + this.width;
    let yMax = yMin + this.height;

    return x > xMin && x < xMax && y > yMin && y < yMax;
  }

  /**
   * Apply constraints to gesture
   * @param  {object} gesture object similar to PanResponder's gesture
   */

  _applyConstraints(gesture) {
    [gesture.dx, gesture.dy] = this.props.rConstraint ?
      this._applyRadiusConstraints(gesture.dx, gesture.dy, this.props.rConstraint):
      [gesture.dx, gesture.dy];
    gesture.dx = this.props.xConstraints ?
      this._apply1DConstraints(gesture.dx, this.props.xConstraints):
      gesture.dx;
    gesture.dy = this.props.yConstraints ?
      this._apply1DConstraints(gesture.dy, this.props.yConstraints):
      gesture.dy;

    return gesture;
  };

  /**
   * Forces radius to be inferior to a constraint
   * @param  {number} xValue
   * @param  {number} yValue
   * @param  {number} radiusConstraint
   * @return {array}                  of shape [x, y]
   */

  _applyRadiusConstraints(xValue, yValue, radiusConstraint) {
    let radius = Math.sqrt(xValue * xValue + yValue * yValue);
    let cos = xValue/radius;
    let sin = yValue/radius;
    if (radius > radiusConstraint) {
      xValue = cos * radiusConstraint;
      yValue = sin * radiusConstraint;
    }
    return [xValue, yValue];
  }

  /**
   * Restrict value to be within the boundaries of constraints
   * @param  {number} value       the value to be controlled
   * @param  {array} constraints array of shape [minimum, maximum]
   *                              -- accepts the 'none' joker
   * @return {number}
   */

  _apply1DConstraints(value, constraints) {
    if (constraints[0] !== 'none' && value < constraints[0]) {
      value = constraints[0];
    };
    if (constraints[1] !== 'none' && value > constraints[1]) {
      value = constraints[1];
    };
    return value;
  }

  render() {
    return (
      <View style={this.containerStyle.container}>
        <Animated.View
          style={[this.state.pan.getLayout(), this.props.style]}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

};
// TODO: find a better name for gesture?
// TODO: decide if override is bool or PanResponder?

Draggable.propTypes = {
  draggablePosition: PropTypes.object,
  left: PropTypes.number,
  onDraggableMove: PropTypes.func,
  onDraggableRelease: PropTypes.func,
  onDraggableStart: PropTypes.func,
  rConstraint: PropTypes.number,
  responderOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  style: View.propTypes.style,
  top: PropTypes.number,
  xConstraints: PropTypes.array,
  yConstraints: PropTypes.array,
};

Draggable.defaultProps = {
  top: 0,
  left: 0,
  style: {},
  onMove: NOOP,
  onRelease: NOOP,
  onStartMove: NOOP,
};

export default Draggable;
