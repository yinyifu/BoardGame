import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import BoardComponent from './BoardComponent';
export default class App extends React.Component {
  
  render() {
    return (
      <View 
          style={styles.container}>
          <StatusBar
           backgroundColor="blue"
           barStyle="light-content"
           hidden={true}
         />
        <BoardComponent style={{transform: [{rotate: "180deg"}]}}/>
        <BoardComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: "stretch",
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
