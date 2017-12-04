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
 * Can either work on itself (with its own pan responder)
 * OR be controlled entirely by parent, in which case callbacks are deactivated
 * as well as any movement logic (sticky, etc.)
 * => override implies that the full responsability of the movement belongs to the parent
 * @extends React.Component
 */

class Draggable extends React.Component {

  static propTypes = {
    animationType: PropTypes.object,
    draggablePosition: PropTypes.object,
    left: PropTypes.number,
    // these will NOT be triggered if override!
    // assumes the new gesture provider (= the parent component)
    // will take care of triggering its own callbacks itself
    onDraggableMove: PropTypes.func,
    onDraggableRelease: PropTypes.func,
    onDraggableStart: PropTypes.func,

    rConstraint: PropTypes.number,
    responderOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    // no effect if overriden
    sticky: PropTypes.bool,

    style: View.propTypes.style,
    top: PropTypes.number,
    xConstraints: PropTypes.array,
    yConstraints: PropTypes.array,
  };

  static defaultProps = {
    top: 0,
    left: 0,
    style: {},
    onMove: NOOP,
    onRelease: NOOP,
    onStartMove: NOOP,
    animationType: { type: 'none' },
  };

  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      //if no spring to orgin, keeps memory of last stop position
      //will never be updated if override (becomes responsability of parent)
      residualOffset: {
        x: 0,
        y: 0,
      }
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
      typeof this.props.responderOverride === 'object' ? this.props.responderOverride : {} :
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gesture) => {
          let constrainedGesture = this._applyConstraints(gesture);
          console.log(constrainedGesture.dx, constrainedGesture.dy);
          this.state.pan.x.setValue(constrainedGesture.dx + this.state.residualOffset.x);
          this.state.pan.y.setValue(constrainedGesture.dy + this.state.residualOffset.y);
          this.props.onDraggableMove(constrainedGesture);
        },
        onPanResponderEnd: (evt, gesture) => {
          let constrainedGesture = this._applyConstraints(gesture);
          if (this.props.sticky) {
            Animated.spring(
              this.state.pan,
              { toValue: { x: 0, y: 0 } }
            ).start();
          } else {
            // keep track of where we stopped
            // so that the draggable does not 'teleport to 0'
            let residualOffset = {
              x: this.state.pan.x.__getValue(),
              y: this.state.pan.y.__getValue(),
            };
            console.log(residualOffset);
            this.setState({
              residualOffset: residualOffset
            });
          }
          this.props.onDraggableRelease(constrainedGesture);
        },
        onPanResponderStart: (evt, gesture) => {
          this.props.onDraggableStart();
        }
      });
  }

  componentWillReceiveProps(newProps) {
    // we assume gesture is similar to react native gesture object
    // meaning that it had dx & dy
    if (newProps.draggablePosition) {
      // testing to prevent infinite loops!
      if (newProps.draggablePosition.dx !== this.state.pan.x.__getValue() ||
          newProps.draggablePosition.dy !== this.state.pan.y.__getValue()) {
        let constrainedPosition = this._applyConstraints(newProps.draggablePosition);
        this._moveDraggableTo(
          constrainedPosition.dx,
          constrainedPosition.dy,
          newProps.animationType);
      }
    }
  }

  /**
   * Move draggable to x, y according to animationType
   * Intended to be used only from componentWillReceiveProps
   * @param  {number} x
   * @param  {number} y
   * @param  {object} animationType containing at least .type (and .options for timing)
   */

  _moveDraggableTo(x, y, animationType) {
    console.log(animationType.type);
    switch (animationType.type) {
      case 'timing':
        console.log('WARNING: animation type "timing" is not implemented yet');
        console.log('defaulting to none');
        this.state.pan.x.setValue(x);
        this.state.pan.y.setValue(y);
        break;
      case 'none':
        this.state.pan.x.setValue(x);
        this.state.pan.y.setValue(y);
        break;
      case 'spring':
        Animated.spring(
          this.state.pan,
          { toValue: { x: x, y: y } }
        ).start();
        break;
      default:
        throw new Error(`unknown animation type: ${animationType.type}`);
    }
  }

  /**
   * Apply constraints to gesture
   * (takes the residual offset into account)
   * @param  {object} gesture object similar to PanResponder's gesture
   */

  _applyConstraints(gesture) {
    [gesture.dx, gesture.dy] = this.props.rConstraint ?
      this._applyRadiusConstraints(
        gesture.dx + this.state.residualOffset.x,
        gesture.dy + this.state.residualOffset.y,
        this.props.rConstraint):
      [gesture.dx, gesture.dy];
    gesture.dx = this.props.xConstraints ?
      this._apply1DConstraints(
        gesture.dx + this.state.residualOffset.x,
        this.props.xConstraints):
      gesture.dx;
    gesture.dy = this.props.yConstraints ?
      this._apply1DConstraints(
        gesture.dy + this.state.residualOffset.y,
        this.props.yConstraints):
      gesture.dy;

    gesture.dy -= this.state.residualOffset.y;
    gesture.dx -= this.state.residualOffset.x;
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

export default Draggable;
