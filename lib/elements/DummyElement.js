/**
 * used to test the TouchEventDemuxer
 */
import React from 'react';
import {
  View,
  Animated,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

class DummyElement extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    left: PropTypes.number,
    name: PropTypes.string,
    top: PropTypes.number,
    width: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
    };

    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.includes = this.includes.bind(this);
  }

  onTouchStart(touch) {
    console.log(`touch start ${this.props.name}`);
  }
  onTouchEnd(touch) {
    console.log(`touch end ${this.props.name}`);
  }
  onTouchMove(touch) {
    console.log(`touch move ${this.props.name}`);
  }
  includes(x, y) {
    let xMin = this.props.left;
    let xMax = this.props.left + this.props.width;
    let yMin = this.props.top;
    let yMax = this.props.top + this.props.height;

    return x > xMin && x < xMax && y > yMin && y < yMax;
  }

  render() {
    let style = StyleSheet.create({
      dummy: {
        backgroundColor: 'black',
        width: this.props.width,
        height: this.props.height,
        top: this.props.top,
        left: this.props.left,
        position: 'absolute'
      }
    });
    return <View style={style.dummy} />;
  }
}

export default DummyElement;
