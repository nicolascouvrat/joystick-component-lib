import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import { CustomView } from '../lib/index'
import { Joystick, TouchEventDemuxer, DummyElement } from 'component-lib';

const Demuxer = TouchEventDemuxer([DummyElement, DummyElement]);

export default class App extends React.Component {
  render() {
    return (
      <Demuxer
        childrenProps={[
          {
            top: 100,
            left: 100,
            height: 50,
            width: 50,
            name: 'compo 1'
          },
          {
            top: 200,
            left: 200,
            height: 50,
            width: 50,
            name: 'compo 2'
          }
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
