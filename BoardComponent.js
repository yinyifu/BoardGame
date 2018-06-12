import React from 'react';
import { StyleSheet, Text, View, PanResponder, TouchableOpacity } from 'react-native';

const stateNormal = "#fff";
const stateSelected = "#0ff";
const stateAroundSelected = "#ff0";
const stateDisabled = "#aaa";
var overload = false; //check if you used the powerup
var player = 1; //what player 
var moves = 3; //move limits
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

    this.disabledPlayer = (value)=>{
      if(player == -1){
        return (value > 0 ? true : false);
      }else if(player == 1){
        return (value < 0 ? true : false);
      }
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
    this.powerUp = this.powerUp.bind(this); 
    this.endTurn = this.endTurn.bind(this);
  }

  //increase tha range 
  powerUp(x, y){
    arrayOfBlocks = []
    for(let i = x-2; i <= x+2; i++){
      for(let j = y-2; j <= y+2; j++){
        if(i < this.rows && i >= 0 && j < this.columns && j>=0 && !(i == x && y == j)){
          arrayOfBlocks.push({x:i, y:j});
        }
      }
    }
    return arrayOfBlocks;
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

  winState(){
    state = this.state.state;
    board = this.state.board;
    var playerOneWin = false;
    var playerTwoWin = false;
    var playerOneCount = 0;
    var playerTwoCount = 0;
    for(let i = 0;i < this.rows; i++ ){
      for(let j = 0;j < this.columns;j++){
        if(board[i][j] <= -1){
          playerTwoCount++;
        }else if(board[i][j] >= 1){
          playerOneCount++;
        }
      }
    }
    if(playerOneCount <= 0){
      playerTwoWin = true;
      console.log("Player two wins");
      console.log("player one loses");
    }
    if(playerTwoCount <= 0){
      playerOneWin = true;
      console.log("player one wins");
      console.log("player two loses");
    }
    this.state.state = state;
    this.setState({board:board, state:state});
  }

  buttonOnPress(x,y){
    board = this.state.board;
    state = this.state.state;
    if(state[x][y] === stateNormal && board[x][y] != 0 && moves > 0){
      if(player == 1 && board[x][y]>0){
        this.clearState();
        state[x][y] = stateSelected;
        let sur = this.surroundingBlocks(x, y);
        for(let i = 0; i < sur.length; i++){
          state[sur[i].x][sur[i].y] = stateAroundSelected;
        }
        this.currentSelected = {x: x, y: y};
      }else if(player == -1 && board[x][y]<0){
        this.clearState();
        state[x][y] = stateSelected;
        let sur = this.surroundingBlocks(x, y);
        for(let i = 0; i < sur.length; i++){
          state[sur[i].x][sur[i].y] = stateAroundSelected;
        }
        this.currentSelected = {x: x, y: y};
      }else{
        ;
      }
    }else if(state[x][y] === stateSelected && moves > 0){
        if(board[this.currentSelected.x][this.currentSelected.y]>0 && player == 1){
          if(board[this.currentSelected.x][this.currentSelected.y]!=1){
            if(!overload && board[this.currentSelected.x][this.currentSelected.y]>0){
                board[this.currentSelected.x][this.currentSelected.y] --;
                overload = true;
                let sur = this.powerUp(x,y);
                for(let i = 0;i < sur.length;i++){
                  state[sur[i].x][sur[i].y] = stateAroundSelected;
                }
                this.currentSelected = {x: x, y: y};
              }
          }else if(board[this.currentSelected.x][this.currentSelected.y]==1){
            ;
          }
        }else if(board[this.currentSelected.x][this.currentSelected.y] < 0 && player == -1){
          if(board[this.currentSelected.x][this.currentSelected.y]!=-1){
            if(!overload){
            board[this.currentSelected.x][this.currentSelected.y] ++;
            overload = true;
            let sur = this.powerUp(x,y);
            for(let i = 0;i < sur.length;i++){
              state[sur[i].x][sur[i].y] = stateAroundSelected;
            }
            this.currentSelected = {x: x, y: y};
            }
          }else if(board[this.currentSelected.x][this.currentSelected.y]==-1){
              ;
          }
        }
    }else if(state[x][y] === stateAroundSelected && moves > 0){
      if(board[this.currentSelected.x][this.currentSelected.y] > 0){
        board[this.currentSelected.x][this.currentSelected.y] --;
        board[x][y]++;
        moves--;
        overload = false;
      }else{
        board[this.currentSelected.x][this.currentSelected.y] ++;
        board[x][y]--;
        moves--;
        overload = false;
      }
      this.clearState();
    }else{
      this.clearState();
      if(overload && board[this.currentSelected.x][this.currentSelected.y] > 0){
        board[this.currentSelected.x][this.currentSelected.y] ++;
        overload = false;
      }else if(overload && board[this.currentSelected.x][this.currentSelected.y] < 0) {
        board[this.currentSelected.x][this.currentSelected.y] --;
        overload = false;
      }
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

  endTurn(){
    board = this.state.board;
    if(player==1){
      for(let i = 0;i < this.rows; i++ ){
        for(let j = 0;j < this.columns;j++){
          if(board[i][j] > 0){
            board[i][j]++;
            moves = 3;
          }
        }
      }
      player = player * -1;
      this.clearState();
      //console.log("Player 1");
    }else if(player == -1){
      for(let i = 0;i < this.rows; i++ ){
        for(let j = 0;j < this.columns;j++){
          if(board[i][j] < 0){
            board[i][j]--;
            moves = 3;
          }
        }
      }
      player = player * -1;
      this.clearState();
      //console.log("Player 2");
    }
    this.winState();
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
            //disabled={this.disabledPlayer(this.state.board[i][j])}
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
          onPress={this.endTurn}
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
