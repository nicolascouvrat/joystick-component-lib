import React from 'react';
import Joystick from './Joystick';

const JoystickExtender = (Joystick) =>
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        draggablePosition: { dx: 0, dy: 0 },
        draggableAnimationType: { type: 'none' },
        draggablePositionInstruction: { dx: 0, dy: 0 },
        draggableResidualOffset: { dx: 0, dy: 0 }
      };

      this.handleDraggableMove = this.handleDraggableMove.bind(this);
    }

    onTouchStart(touch) {
      console.log(touch);
      console.log(this.state.draggablePosition);
      this.setState({
        draggableAnimationType: { type: 'none' },
      });
    }

    onTouchMove(touch) {
      //console.log(touch);
      touch.dx += this.state.draggableResidualOffset.dx;
      touch.dy += this.state.draggableResidualOffset.dy;
      this.setState({
        draggablePositionInstruction: touch,
      });
    }

    onTouchEnd(touch) {
      // this.setState({
      //   draggablePosition: { dx: 0, dy: 0 },
      //   draggableAnimationType: { type: 'spring' }
      // });
      console.log(this.state.draggablePosition);
      this.setState((state, props) => {
        return { draggableResidualOffset: state.draggablePosition };
      });
      console.log(this.state.draggableResidualOffset)
    }

    handleDraggableMove(touch) {
      // convert coordinates of topleft corner of draggable to center coordinates
      //console.log(touch);
      this.setState({
        draggablePosition: touch,
      });
    }

    includes(x, y) {
      let xMin = this.props.neutralPointX + this.state.draggablePosition.dx - this.joystick.draggableWidth / 2;
      let xMax = this.props.neutralPointX + this.state.draggablePosition.dx + this.joystick.draggableWidth / 2;
      let yMin = this.props.neutralPointY + this.state.draggablePosition.dy - this.joystick.draggableHeight / 2;
      let yMax = this.props.neutralPointY + this.state.draggablePosition.dy + this.joystick.draggableHeight / 2;
      console.log(`x: ${xMin}, ${xMax}`);
      console.log(`y: ${yMin}, ${yMax}`);
      console.log(x, y);
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
