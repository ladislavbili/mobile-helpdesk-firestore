import React, { Component } from 'react';
import { Input, Item, Header, Title, Content, Button, Icon, Text, Left, Body, View, CheckBox, List, ListItem, Footer, FooterTab } from 'native-base';
import { Modal } from 'react-native';
import i18n from 'i18next';

export default class Multiselect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected:this.props.selected,
      opened:false,
      search:'',
    };
  }

  //selected title selectTitle options onChange

  render() {
    return (
    <View>
      <Text note>{this.props.title}</Text>
      <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
        <Button block onPress={()=>{this.setState({opened:true})}}><Text>{this.props.selectTitle}</Text></Button>
        <List
          dataArray={this.state.selected}
          renderRow={item =>
            <ListItem key={item.id}>
              <Body>
                <Text>{item.title}</Text>
              </Body>
            </ListItem>
          }
          />
      </View>
      <Modal
        animationType={"fade"}
        transparent={false}
        style={{flex:1}}
        visible={this.state.opened}
        onRequestClose={() => this.setState({opened:false})}
        >
        <Content style={{ padding: 15 }}>
          <Header>
            <Body>
              <Title>{this.props.selectTitle}</Title>
            </Body>
          </Header>

          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <ListItem>
              <Item rounded>
                <Icon name="ios-search" />
                <Input placeholder={i18n.t('search')} value={this.state.search} onChangeText={(value)=>this.setState({search:value})} />
              </Item>
            </ListItem>
            <List>
              {this.props.options.filter((item)=>item.title.toLowerCase().includes(this.state.search.toLowerCase())).map((item)=>
                <ListItem thumbnail key={item.id} onPress={()=>{
                    if(this.state.selected.some((selected)=>selected.id===item.id)){
                      let newSelected=[...this.state.selected];
                      newSelected.splice(newSelected.findIndex(item2=>item2.id===item.id),1);
                      this.props.onChange(newSelected);
                      this.setState({selected:newSelected});
                    }else{
                      this.props.onChange([item,...this.state.selected]);
                      this.setState({selected:[item,...this.state.selected]});
                    }}}>
                    <Left>
                      <CheckBox checked={this.state.selected.some((selected)=>selected.id===item.id)}
                        onPress={()=>{
                          if(this.state.selected.some((selected)=>selected.id===item.id)){
                            let newSelected=[...this.state.selected];
                            newSelected.splice(newSelected.findIndex(item2=>item2.id===item.id),1);
                            this.props.onChange(newSelected);
                            this.setState({selected:newSelected});
                          }else{
                            this.props.onChange([item,...this.state.selected]);
                            this.setState({selected:[item,...this.state.selected]});
                        }}} />
                    </Left>
                    <Body>
                      <Text>{item.title}</Text>
                    </Body>
                  </ListItem>
                )}
              </List>
            </View>
        </Content>
        <Footer>

          <FooterTab>
            <Button style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
              onPress={()=>this.setState({opened:false})}>
              <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Modal>
    </View>
    )
  }
}
