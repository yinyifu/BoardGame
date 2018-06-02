import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class BoardComponent extends React.Component {
  render() {
    const rows = 4
    const columns = 7

    let rowsOfViews = [];
    for(let i = 0; i < rows; i++){
      let columnOfViews = [];
      for(let j = 0; j < columns; j++){
        columnOfViews.push(
          <View key={j} style={styles.containerBlock}/>
        );
      }

      rowsOfViews.push(
          <View key={i} style={styles.containerList}>
            {columnOfViews}
          </View>
        );
    }
    const { style } = this.props;

    return (
      <View style={[styles.containerSheet, style]}>
        {rowsOfViews}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerSheet: {
    flex: 1,

    flexDirection : 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerList: {
    flexDirection : 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  containerBlock: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderColor: "#aaa",
    borderWidth: 3
  },
});
