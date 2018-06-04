import React from 'react';
import { StyleSheet, Text, View, PanResponder, TouchableOpacity } from 'react-native';

const stateNormal = "#fff";
const stateSelected = "#0ff";
const stateAroundSelected = "#ff0";
const stateDisabled = "#aaa";
// Three states : clicked, ready to receive and unclicked.
export default class BoardComponent extends React.Component {

  componentWillMount() {

  }

  constructor(){
    super();
    this.rows = 12;
    this.columns = 7;

    // determine disabled side
    this.disabledPositive = (value)=>{
      return (value > 0 ? true : false);
    }

    this.disabledZero = (x, y)=>{
      return ((this.state.state[x][y] === stateNormal && this.state.board[x][y] == 0) ? true : false);
    }

    this.disabledNegative = (value)=>{
      return (value < 0 ? true : false);
    }

    // initialize array for board
    // initialize state for display purpose
    let array = [];
    let state = [];
    for(let i = 0;i < this.rows;i++ ){
      let col = [];
      let statecol = [];
      for(let j = 0;j < this.columns;j++){
        col[j] = 0;
        statecol[j] = "#fff";
      }
      array[i] = col;
      state[i] = statecol;
    }

    //initial minion
    array[this.rows-1][Math.floor(this.columns/2)] = 1;
    array[0][Math.floor(this.columns/2)] = -1;
    // Set State for Game Board
    this.state = {board: array, state: state};

    // bind function to call in render()
    this.buttonOnPress = this.buttonOnPress.bind(this);
    this.surroundingBlocks = this.surroundingBlocks.bind(this);
    this.clearState = this.clearState.bind(this);
    this.endTurnPositive = this.endTurnPositive.bind(this);
  }

  // get blocks around a block within a board
  surroundingBlocks(x, y){
    arrayOfBlocks = []
    for(let i = x-1; i <= x+1; i++){
      for(let j = y-1; j <= y+1; j++){
        if(i < this.rows && i >= 0 && j < this.columns && j>=0 && !(i == x && y == j)){
          arrayOfBlocks.push({x:i, y:j});
        }
      }
    }
    return arrayOfBlocks;
  }

  clearState(){
    state = this.state.state;
    for(let i = 0;i < this.rows; i++ ){
      for(let j = 0;j < this.columns;j++){
        state[i][j] = "#fff";
      }
    }
    this.state.state = state;
  }

  buttonOnPress(x,y){
    board = this.state.board;
    state = this.state.state;

    if(state[x][y] === stateNormal && board[x][y] != 0){
      this.clearState();
      state[x][y] = stateSelected;
      let sur = this.surroundingBlocks(x, y);
      for(let i = 0; i < sur.length; i++){
        state[sur[i].x][sur[i].y] = stateAroundSelected;
      }
      this.currentSelected = {x: x, y: y};
    }else if(state[x][y] === stateSelected){
      this.clearState();
    }else if(state[x][y] === stateAroundSelected){
      if(board[this.currentSelected.x][this.currentSelected.y] > 0){
        board[this.currentSelected.x][this.currentSelected.y] --;
        board[x][y]++;
      }else{
        board[this.currentSelected.x][this.currentSelected.y] ++;
        board[x][y]--;
      }
      this.clearState();
    }
    this.setState({board:board, state:state});
  }

  endTurnPositive(){
    board = this.state.board;
    for(let i = 0;i < this.rows; i++ ){
      for(let j = 0;j < this.columns;j++){
        if(board[i][j] > 0){
          board[i][j]++;
        }
      }
    }
    this.setState({board:board});
  }

  endTurnNegative(){
    board = this.state.board;
    for(let i = 0;i < this.rows; i++ ){
      for(let j = 0;j < this.columns;j++){
        if(board[i][j] < 0){
          board[i][j]--;
        }
      }
    }
    this.setState({board:board});
  }

  render() {
    let rows = this.rows;
    let columns = this.columns;
    let rowsOfViews = [];
    for(let i = 0; i < rows; i++){
      let columnOfViews = [];
      for(let j = 0; j < columns; j++){
        columnOfViews.push(
          <TouchableOpacity 
            key={j} 
            style={[styles.containerBlock, {backgroundColor: this.state.state[i][j]}]} 
            disabled={this.disabledNegative(this.state.board[i][j])}
            onPress={this.buttonOnPress.bind(this, i, j)}
          >
            <Text style={[styles.text, ]}>
              {this.state.board[i][j]}
            </Text>
          </TouchableOpacity>
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
      <View  style={[styles.containerSheet, style]}>
        {rowsOfViews}
      
        <TouchableOpacity style={{flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center'}}
          onPress={this.endTurnPositive}
        >
          <View style={{height: 50, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>
              End Turn
            </Text>
          </View>
        </TouchableOpacity>
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
    flex:1,
    flexDirection : 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  containerBlock: {
    flex: 1,
    borderColor: "#aaa",
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  text: {
    flex: 1,
    fontSize : 30,
    color: '#666'
  }
});
