import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import { CustomView } from '../lib/index'
import { Joystick1D } from 'component-lib';

export default class App extends React.Component {
  render() {
    return (
      <Joystick1D
        left={100}
        top={100}
        mainDimension={50}
        shape={'horizontal'}
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
