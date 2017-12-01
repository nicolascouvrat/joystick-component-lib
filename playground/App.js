import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import { CustomView } from '../lib/index'
import { CustomView } from 'component-lib';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <CustomView />
        <Text>Test</Text>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
