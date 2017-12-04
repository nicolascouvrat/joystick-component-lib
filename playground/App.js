import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import { CustomView } from '../lib/index'
import { Joystick } from 'component-lib';

export default class App extends React.Component {
  render() {
    return (
      <Joystick
        neutralPointX={100}
        neutralPointY={100}
        length={50}
        shape={'circular'}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    backgroundColor: 'green',
  },
});
