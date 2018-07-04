import React from 'react';
import { StyleSheet, Text, View, PanResponder, TouchableOpacity } from 'react-native';

export default class NodeComponent extends React.Component {
	

	render(){
		const { value, state, spec, side} = this.props;
		return(
			<View style={[styles.view, {backgroundColor: state}]}>
					<Text style={[{flex: 1,fontSize: 10}, {color: "#000"}]}>
						{spec}
					</Text>
				{value != 0 &&<Text style={[styles.text, {color: side}]}>
					{value}
				</Text>}
				
			</View>
		);
	}
}
const styles = StyleSheet.create({
  view:{
  	flex: 1,
  	margin: 3,
  	borderRadius: 5,
    alignSelf: 'stretch',
    alignItems: "center",
    justifyContent: "flex-start"

  },
  text: {
    flex: 2,
    fontSize : 30,
    color: '#666'
  }
})