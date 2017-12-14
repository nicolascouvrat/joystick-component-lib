import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import { CustomView } from '../lib/index'
import { JoystickDemuxed, TouchEventDemuxer, DummyElement } from 'component-lib';

const Demuxer = TouchEventDemuxer([JoystickDemuxed, JoystickDemuxed]);

export default class App extends React.Component {
  render() {
    console.log(JoystickDemuxed.prototype)
    return (
      <Demuxer
        childrenProps={[
          {
            neutralPointX: 100,
            neutralPointY: 100,
            length: 75,
            shape: 'circular',
            isSticky: true,
          },
          {
            neutralPointX: 200,
            neutralPointY: 300,
            length: 50,
            shape: 'vertical'
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
