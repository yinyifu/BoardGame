import React from 'react';
import { StyleSheet, Text, View, PanResponder } from 'react-native';

export default class BoardComponent extends React.Component {

  componentWillMount() {
      const start = ({x0, y0}) => {

        console.log(y0 );
      }
      const end= ({dx, dy}) => {
      }
      const move=({dx, dy}) => {
        //console.log(dx);
        //console.log(dy);
      }
      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => start(gestureState),
          onPanResponderMove: (evt, gestureState) => move(gestureState),
          onPanResponderTerminationRequest: (evt, gestureState) => false,
          onPanResponderRelease: (evt, gestureState) =>end(gestureState),
          onPanResponderTerminate: (evt, gestureState) =>end(gestureState),
          onShouldBlockNativeResponder: (evt, gestureState) => true,
      });
    }

  constructor(){
    super();

    // initialize array
    this.rows = 4;
    this.columns = 7;
    var array = [];
    for(let i = 0; i < this.rows; i++){
      let col = [];
      for(let j = 0; j < this.columns; j++){
        col[j] = 0;
      }
      array[i] = col;
    }

    //initial minion
    array[this.rows-1][Math.floor(this.columns/2)] = 1;
    this.state = {board: array};
  }

  render() {
    let rows = this.rows;
    let columns = this.columns;

    let rowsOfViews = [];
    for(let i = 0; i < rows; i++){
      let columnOfViews = [];
      for(let j = 0; j < columns; j++){
        columnOfViews.push(
          <View key={j} style={styles.containerBlock}>
            <Text style={styles.text}>
              {this.state.board[i][j]}
            </Text>
          </View>
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
      <View {...this._panResponder.panHandlers} style={[styles.containerSheet, style]}>
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
    justifyContent: 'flex-end',
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
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize : 20,
    color: '#666'
  }
});
