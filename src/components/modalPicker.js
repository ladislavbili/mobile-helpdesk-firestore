import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-native';
import i18n from 'i18next';

import { Input, Picker, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Body, View, List, ListItem, Footer, FooterTab, CheckBox } from 'native-base';

export default class ModalPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpened:false,
      modalSearch:''
    }
  }


  render() {
    return (
      <View>
        <Text note>{this.props.label}</Text>
        <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
          <Button block onPress={()=>{this.setState({modalOpened:true})}}><Text>{this.props.buttonLabel}</Text></Button>
          <List
            dataArray={ this.props.selected }
            renderRow={ (item) =>
              <ListItem key={item.id}>
                { this.props.renderRow(item) }
              </ListItem>
             }
            />
        </View>
        <Modal
          animationType={"fade"}
          transparent={false}
          style={{flex:1}}
          visible={this.state.modalOpened}
          onRequestClose={() => this.setState({modalOpened:false})}
          >
          <Content style={{ padding: 0 }}>
            <Header>
              <Body>
                <Title>{this.props.label}</Title>
              </Body>
            </Header>

            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <ListItem>
                <Item rounded>
                  <Icon name="ios-search" />
                  <Input placeholder={i18n.t('search')} value={this.state.modalSearch} onChangeText={(value)=>this.setState({modalSearch: value})} />
                </Item>
              </ListItem>
              <List>
                {this.props.options.filter((item)=>this.props.getSearchValue(item).toLowerCase().includes(this.state.modalSearch.toLowerCase())).map((item)=>
                  <ListItem
                    thumbnail
                    key={item.id}
                    onPress={()=>{
                      if(this.props.selected.includes(item)){
                        let newData=[...this.props.selected];
                        newData.splice(newData.indexOf(item),1);
                        this.props.onChange(newData);
                      }else{
                        this.props.onChange([item,...this.props.selected]);
                      }
                    }}
                    >
                    <Left>
                      <CheckBox
                        checked={this.props.selected.includes(item)}
                        onPress={()=>{
                          if(this.props.selected.includes(item)){
                            let newData=[...this.props.selected];
                            newData.splice(newData.indexOf(item),1);
                            this.props.onChange(newData);
                          }else{
                            this.props.onChange([item,...this.props.selected]);
                          }
                        }}
                        />
                    </Left>
                    {this.props.renderRow(item)}
                  </ListItem>
                )}
              </List>

            </View>
          </Content>
          <Footer>

            <FooterTab>
              <Button style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
                onPress={()=>this.setState({modalOpened:false})}>
                <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Modal>
      </View>
    );
  }
}
