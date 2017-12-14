import React from 'react';
import Joystick from './Joystick';

const JoystickExtender = (Joystick) =>
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        draggableAnimationType: { type: 'none' },
        draggablePositionInstruction: { dx: 0, dy: 0 },
      };
      this.draggableResidualOffset = { dx: 0, dy: 0 };
      this.draggableRelativeDisplacement = { dx: 0, dy: 0 };

      this.handleDraggableMove = this.handleDraggableMove.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);
      this.onTouchMove = this.onTouchMove.bind(this);
    }

    onTouchStart(touch) {
      this.setState({
        draggablePositionInstruction: this.draggableResidualOffset,
        draggableAnimationType: { type: 'none' },
      });
    }

    onTouchMove(touch) {
      //console.log(touch);
      touch.dx += this.draggableResidualOffset.dx;
      touch.dy += this.draggableResidualOffset.dy;
      this.setState({
        draggablePositionInstruction: touch,
      });
    }

    onTouchEnd(touch) {
      if (this.props.isSticky) {
        this.setState({
          draggablePositionInstruction: { dx: 0, dy: 0 },
          draggableAnimationType: { type: 'spring '} ,
        });
      } else {
        if (this.draggableRelativeDisplacement.dx !== 0 || this.draggableRelativeDisplacement.dy !== 0) {
          // this check is necessary for cases where the joystick is touched but not moved
          this.draggableResidualOffset.dx = this.draggableRelativeDisplacement.dx;
          this.draggableResidualOffset.dy = this.draggableRelativeDisplacement.dy;
        }
      }
      this.draggableRelativeDisplacement.dx = 0;
      this.draggableRelativeDisplacement.dy = 0;
    }

    handleDraggableMove(touch) {
      // the dx and dy coming back are calculated FROM THE CENTER of the joystick
      this.draggableRelativeDisplacement.dx = touch.dx;
      this.draggableRelativeDisplacement.dy = touch.dy;
    }

    includes(x, y) {
      let xMin = this.props.neutralPointX + this.draggableResidualOffset.dx + this.draggableRelativeDisplacement.dx - this.joystick.draggableWidth / 2;
      let xMax = this.props.neutralPointX + this.draggableResidualOffset.dx + this.draggableRelativeDisplacement.dx + this.joystick.draggableWidth / 2;
      let yMin = this.props.neutralPointY + this.draggableResidualOffset.dy + this.draggableRelativeDisplacement.dy - this.joystick.draggableHeight / 2;
      let yMax = this.props.neutralPointY + this.draggableResidualOffset.dy + this.draggableRelativeDisplacement.dy + this.joystick.draggableHeight / 2;
      console.log(x, y);
      console.log(`xMin: ${xMin}, xMax: ${xMax}`);
      console.log(`yMin: ${yMin}, yMax: ${yMax}`);
      return x < xMax && x > xMin && y < yMax && y > yMin;
    }

    render() {
      return (
        <Joystick
          {...this.props}
          animationType={this.state.draggableAnimationType}
          draggablePosition={this.state.draggablePositionInstruction}
          hasResponderOverride
          onDraggableMove={this.handleDraggableMove}
          ref={item => this.joystick = item}
        />
      );
    }
  };

const JoystickDemuxed = JoystickExtender(Joystick);

export default JoystickDemuxed;
