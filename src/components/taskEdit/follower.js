import React, { Component } from "react";
import { ListItem, Text, Thumbnail, Left, Body, CheckBox, Item, View} from "native-base";

/**
* Component that displays data about one specific lag that it recieves
* @extends Component
*/

export default class Follower extends Component {
  constructor(props) {
    super(props);
    this.state={selected:this.props.selected}
  }

  render() {
    return (
      <ListItem thumbnail  key={this.props.item.id} onPress={()=>{this.props.setFollower(this.state.selected,this.props.item);this.setState({selected:!this.state.selected});}}>
        <Left>
          <CheckBox checked={this.state.selected}  onPress={()=>{this.props.setFollower(this.state.selected,this.props.item);this.setState({selected:!this.state.selected});}} />
        </Left>
        <Body>
          <View style={{paddingLeft:10}}>
            {
              (this.props.item.name||this.props.item.surname)?<Text>{this.props.item.name?this.props.item.name+' ':''}{this.props.item.surname?this.props.item.surname:''}</Text>:null
            }
            <Text note>{this.props.item.username}</Text>
          </View>
        </Body>
      </ListItem>
    );
  }
}
