import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { JoystickDemuxed, TouchEventDemuxer, DummyElement } from 'component-lib';

const Demuxer = TouchEventDemuxer([JoystickDemuxed, JoystickDemuxed]);

const firstHandler = (xProp, yProp) => {
  console.log(`first joystick: ${xProp}, ${yProp}`);
}

const secondHandler = (xProp, yProp) => {
  console.log(`second joystick: ${xProp}, ${yProp}`);
}

export default class App extends React.Component {
  render() {
    return (
      <Demuxer
        childrenProps={[
          {
            neutralPointX: 100,
            neutralPointY: 100,
            length: 75,
            shape: 'circular',
            isSticky: true,
            onJoystickMove: firstHandler,
          },
          {
            neutralPointX: 200,
            neutralPointY: 300,
            length: 50,
            shape: 'vertical',
            onJoystickMove: secondHandler,
          },
        ]}
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
