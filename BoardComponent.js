import React from 'react';
import { StyleSheet, Text, View, PanResponder, TouchableOpacity } from 'react-native';

const stateNormal = "#fff";
const stateSelected = "#0ff";
const stateAroundSelected = "#dd0";
const stateDisabled = "#aaa";

const specNone = "none";
const specGrowthx2 = "growth+";
const specAttackx2 = "att+";
const specMaxx2 = "limit+";
const specDefensex2 = "defense+";

const sideNeutral = "#000";
const sideRed = "#f00"
const sideBlue = "#00f"

const freeBlock = {value: 0, side: sideNeutral, state: stateNormal, spec: specNone};

var overload = false; //check if you used the powerup
var player = -1; //what player 
var moves = 1; //move limits
import NodeComponent from "./NodeComponent"

// Three states : clicked, ready to receive and unclicked.
export default class BoardComponent extends React.Component {

  componentWillMount() {
  	const start = () => {
    		this.start = this.state.value;
  	    }
  	    const end= ({dx, dy}) => {
  	    }
	  	const move=(state) => {
	  		const {moveX} = state;
	  		console.log(moveX);
	  	}
	    this._panResponder = PanResponder.create({
	        onStartShouldSetPanResponder: (evt, gestureState) => true,
	        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onMoveShouldSetPanResponder: (evt, gestureState) => true,
	        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onPanResponderGrant: (evt, gestureState) => start(),
	        onPanResponderMove: (evt, gestureState) => move(gestureState),
	        onPanResponderTerminationRequest: (evt, gestureState) => false,
	        onPanResponderRelease: (evt, gestureState) =>end(gestureState),
	        onPanResponderTerminate: (evt, gestureState) =>end(gestureState),
	        onShouldBlockNativeResponder: (evt, gestureState) => true,
	    });
  }
  constructor(){
    super();
    this.rows = 8;
    this.columns = 5;

    // determine disabled side
    this.disabledPositive = (value) => {
      return (value > 0 ? true : false);
    }

    this.disabledZero = (x, y) => {
  //    return ((this.state.board[x][y].state === stateNormal && this.state.board[x][y].val == 0) ? true : false);
    }

    this.disabledNegative = (value) => {
      return (value < 0 ? true : false);
    }

    this.disabledPlayer = (value) => {
      if(player == -1){
        return (value > 0 ? true : false);
      }else if(player == 1){
        return (value < 0 ? true : false);
      }
    }
    // initialize array for board
    // initialize state for display purpose
    let array = [];
    for(let i = 0;i < this.rows;i++ ){
      let col = [];
      for(let j = 0;j < this.columns;j++){
        col[j] = {value: 0, side: sideNeutral, state: stateNormal, spec: specNone};
      }
      array[i] = col;
    }

    //initial minion
    array[this.rows-1][Math.floor(this.columns/2)].side = sideBlue;
    array[this.rows-1][Math.floor(this.columns/2)].value = 1;
    array[0][Math.floor(this.columns/2)].side = sideRed;
    array[0][Math.floor(this.columns/2)].value = 1;
    // Set State for Game Board
    this.state = {board: array};

    // bind function to call in render()
    this.buttonOnPress = this.buttonOnPress.bind(this);
    this.surroundingBlocks = this.surroundingBlocks.bind(this);
    this.clearState = this.clearState.bind(this);
    this.powerUp = this.powerUp.bind(this); 
    this.endTurn = this.endTurn.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getState = this.getState.bind(this);
    this.setStateGame = this.setStateGame.bind(this);
    this.getSide = this.getSide.bind(this);
    this.setSide = this.setSide.bind(this);
    this.isBlueSide = this.isBlueSide.bind(this);
    this.isRedSide = this.isRedSide.bind(this);
    this.isOccupied = this.isOccupied.bind(this);
    this.getSpec = this.getSpec.bind(this);
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
    for(let i = 0;i < this.rows; i++ ){
      for(let j = 0;j < this.columns;j++){
        this.setStateGame(i, j, stateNormal);
      }
    }
  }

  getValue(x, y){
  	return this.state.board[x][y].value;
  }
  setValue(x, y, v){
  	return this.state.board[x][y].value = v;
  }
  getSide(x, y){
  	return this.state.board[x][y].side;
  }
  setSide(x, y, v){
  	return this.state.board[x][y].side = v;
  }

  
  
  getState(x, y){
  	return this.state.board[x][y].state;
  }


  setStateGame(x, y, v){
  	return this.state.board[x][y].state = v;
  }

  isRedSide(x, y){
  	return this.state.board[x][y].side == sideRed;
  }

  isBlueSide(x, y){
  	return this.state.board[x][y].side == sideBlue;
  }

  isOccupied (x, y){
  	return this.getState(x, y) === stateNormal && this.getSide(x, y) != sideNeutral && moves > 0
  }

  currentTurn(){
  	return player == 1 ? sideRed: sideBlue;
  }

  getSpec(x, y){
  	return this.state.board[x][y].spec;
  }

  attack(node1, node2){
  	node1.value--;
  	node2.value--;
  }


  winState(){
    var playerOneWin = false;
    var playerTwoWin = false;
    var playerOneCount = 0;
    var playerTwoCount = 0
    for(let i = 0;i < this.rows; i++ ){
      for(let j = 0;j < this.columns;j++){
        if(this.getSide(i, j) == sideBlue){
          playerTwoCount++;
        }else if(this.getSide(i, j) == sideRed){
          playerOneCount++;
        }
      }
    }
    if(playerOneCount == 0){
      playerTwoWin = true;
      console.log("Player one wins");
    }
    if(playerTwoCount == 0){
      playerOneWin = true;
      console.log("player two wins");
    }
  }

  buttonOnPress(x,y){

  	board = this.state.board;
  	// if clicking on block with minion
    if(this.isOccupied(x, y)){
      // if the clicking occupied block match the turn
      if(this.currentTurn() == this.getSide(x, y)){

        this.clearState();
        this.setStateGame(x, y, stateSelected);
        this.surroundingBlocks(x, y).map((v) => {
        	this.setStateGame(v.x, v.y, stateAroundSelected);
        });
        this.currentSelected = {x: x, y: y};
      }
    // Peter's code
    }else if(this.getState(x,y) === stateSelected && moves > 0){
       /* if(board[this.currentSelected.x][this.currentSelected.y]>0 && player == 1){
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
        }*/
    }else if(this.getState(x, y) === stateAroundSelected && moves > 0){

	  fromNode = this.state.board[this.currentSelected.x][this.currentSelected.y];
	  toNode = this.state.board[x][y];
      if(this.getSide(x, y) != sideNeutral){
        this.attack(fromNode, toNode);
      }else{
        board[this.currentSelected.x][this.currentSelected.y] = board[x][y];
        board[x][y] = fromNode;
      }
      this.clearState();
    }else{
      this.clearState();
      /*if(overload && board[this.currentSelected.x][this.currentSelected.y] > 0){
        board[this.currentSelected.x][this.currentSelected.y] ++;
        overload = false;
      }else if(overload && board[this.currentSelected.x][this.currentSelected.y] < 0) {
        board[this.currentSelected.x][this.currentSelected.y] --;
        overload = false;
      }*/
    }

    this.forceUpdate();
  }


  endTurn(){
    this.state.board.map((col) => {
    	col.map(node=>{
    		node.value++;
    	})
    });
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
            style={[styles.containerBlock, {backgroundColor: "#aaa"}]}
            {...this._panResponder.panHandlers}
          >
            <NodeComponent 
            	value = {this.getValue(i, j)}
            	state = {this.getState(i, j)} 
            	spec = {this.getSpec(i, j)}
            	side = {this.getSide(i, j)}	
            />
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
      <View  style={[styles.containerSheet, style]} >
      	<View style={{flex: rowsOfViews.length, flexDirection : 'column', 
    alignSelf: 'stretch',}} onLayout={(event) => {
      		this.width = event.nativeEvent.layout.width;
      		this.height = event.nativeEvent.layout.height;
      	}}>
      		{rowsOfViews}
        </View>
      
        <TouchableOpacity style={{flex: 1, flexDirection: "row"}}
          onPress={this.endTurn}
        >
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  
});
