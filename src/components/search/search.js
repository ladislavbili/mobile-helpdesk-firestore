import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-native';
import { Input, Picker, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Right, Body, View, List, ListItem, Footer, FooterTab, CheckBox } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ModalPicker from '../modalPicker';
import DateTimePicker from 'react-native-modal-datetime-picker';

import i18n from 'i18next';

import { compactUserForSearch, formatDate } from '../../helperFunctions';

/**
* Allows user to seach for a specific tasks
* @extends Component
*/
class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title:'',
      requester:[],
      assigned:[],
      status:[],
      company:[],
      workType:[],

      closeDateFrom:null,
      closeDateFromOpen:false,
      closeDateTo:null,
      closeDateToOpen:false,
      pendingDateFrom:null,
      pendingDateFromOpen:false,
      pendingDateTo:null,
      pendingDateToOpen:false,
      statusDateFrom:null,
      statusDateFromOpen:false,
      statusDateTo:null,
      statusDateToOpen:false,
    }
  }

  /**
  * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
  */
  submit(){
    let filter = {
      title:this.state.title,
      requester:this.state.requester.map((item)=>item.id),
      assigned:this.state.assigned.map((item)=>item.id),
      status:this.state.status.map((item)=>item.id),
      company:this.state.company.map((item)=>item.id),
      workType:this.state.workType.map((item)=>item.id),
      closeDateFrom:this.state.closeDateFrom,
      closeDateTo:this.state.closeDateTo,
      pendingDateFrom:this.state.pendingDateFrom,
      pendingDateTo:this.state.pendingDateTo,
      statusDateFrom:this.state.statusDateFrom,
      statusDateTo:this.state.statusDateTo,
    };
    Actions.taskList({ forcedFilter:filter , listTitle: 'searchResults' });
  }

  render() {
    /*
    requester
    status - z usera
    company
    assigned
    workType

    closeDateFrom
    closeDateTo
    pendingDateFrom
    pendingDateTo
    statusDateFrom
    statusDateTo
    */
    return (
      <Container style={{marginBottom: 20 }}>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{i18n.t('search')}</Title>
          </Body>
        </Header>
        <Content style={{ padding: 15 }}>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Input
              placeholder={i18n.t('filterTaskTitle')}
              value={ this.state.title }
              onChangeText={ value => this.setState({title:value}) }
              />
          </View>

          <ModalPicker
            options={this.props.users}
            selected={this.state.requester}
            label={i18n.t('filterRequestedBy')}
            buttonLabel={i18n.t('filterByRequestedBy')}
            getSearchValue={compactUserForSearch}
            renderRow={(item)=>
              <Body key={item.id}>
                {
                  (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                }
                <Text note>{item.email}</Text>
              </Body>
            }
            onChange={(newData)=>{
              this.setState({requester:newData});
            }}
            />

          <ModalPicker
            options={this.props.users}
            selected={this.state.assigned}
            label={i18n.t('filterAssignedTo')}
            buttonLabel={i18n.t('filterByAssignedTo')}
            getSearchValue={compactUserForSearch}
            renderRow={(item)=>
              <Body>
                {
                  (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                }
                <Text note>{item.email}</Text>
              </Body>
            }
            onChange={(newData)=>{
              this.setState({assigned:newData});
            }}
            />

          <ModalPicker
            options={this.props.statuses}
            selected={this.state.status}
            label={i18n.t('filterStatus')}
            buttonLabel={i18n.t('filterByStatus')}
            getSearchValue={(status)=>status.title}
            renderRow={(status)=>
              <Body style={{backgroundColor:((status.color.includes('#')?'':'#')+status.color),paddingLeft:10}}>
                <Text style={{color:'white', fontWeight:'bold'}}>{status.title}</Text>
              </Body>
            }
            onChange={(newData)=>{
              this.setState({status:newData});
            }}
            />

          <ModalPicker
            options={this.props.companies}
            selected={this.state.company}
            label={i18n.t('filterCompany')}
            buttonLabel={i18n.t('filterByCompany')}
            getSearchValue={ (company)=> company.title }
            renderRow={(company)=>
              <Body>
                <Text>{company.title}</Text>
              </Body>
            }
            onChange={(newData)=>{
              this.setState({company:newData});
            }}
            />

          <ModalPicker
            options={this.props.taskTypes}
            selected={this.state.workType}
            label={i18n.t('filterWorkType')}
            buttonLabel={i18n.t('filterByWorkType')}
            getSearchValue={ (type)=> type.title }
            renderRow={(type)=>
              <Body>
                <Text>{type.title}</Text>
              </Body>
            }
            onChange={(newData)=>{
              this.setState({workType:newData});
            }}
            />
          <Item>
            <Left>
              <Text note>{i18n.t('closeDateFrom')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Button block style={{backgroundColor:'white', width:'99%'}} onPress={()=>this.setState({closeDateFromOpen: true})}>
                  <Left>
                    <Text style={{textAlign:'left',color:'black'}}>{this.state.closeDateFrom === null ? i18n.t('selectCloseDateFrom') : formatDate(this.state.closeDateFrom)}</Text>
                  </Left>
                </Button>
                <DateTimePicker
                  mode="datetime"
                  isVisible={this.state.closeDateFromOpen}
                  onConfirm={(date)=>{ this.setState({closeDateFrom:(new Date(date)).getTime(),closeDateFromOpen:false})}}
                  onCancel={()=>this.setState({closeDateFromOpen:false})}
                  />
              </View>
            </Left>
            <Left>
              <Text note style={{marginLeft: 0 }}>{i18n.t('closeDateTo')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Button block style={{backgroundColor:'white', width:'99%' }} onPress={()=>this.setState({closeDateToOpen: true})}>
                  <Left>
                    <Text style={{textAlign:'left',color:'black'}}>{this.state.closeDateTo === null ? i18n.t('selectCloseDateTo') : formatDate(this.state.closeDateTo)}</Text>
                  </Left>
                </Button>
                <DateTimePicker
                  mode="datetime"
                  isVisible={this.state.closeDateToOpen}
                  onConfirm={(date)=>{ this.setState({closeDateTo:(new Date(date)).getTime(),closeDateToOpen:false})}}
                  onCancel={()=>this.setState({closeDateToOpen:false})}
                  />
              </View>
            </Left>
          </Item>

          <Item>
            <Left>
              <Text note>{i18n.t('pendingDateFrom')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Button block style={{backgroundColor:'white', width:'99%'}} onPress={()=>this.setState({pendingDateFromOpen: true})}>
                  <Left>
                    <Text style={{textAlign:'left',color:'black'}}>{this.state.pendingDateFrom === null ? i18n.t('selectpendingDateFrom') : formatDate(this.state.pendingDateFrom)}</Text>
                  </Left>
                </Button>
                <DateTimePicker
                  mode="datetime"
                  isVisible={this.state.pendingDateFromOpen}
                  onConfirm={(date)=>{ this.setState({pendingDateFrom:(new Date(date)).getTime(),pendingDateFromOpen:false})}}
                  onCancel={()=>this.setState({pendingDateFromOpen:false})}
                  />
              </View>
            </Left>
            <Left>
              <Text note style={{marginLeft: 0 }}>{i18n.t('pendingDateTo')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Button block style={{backgroundColor:'white', width:'99%' }} onPress={()=>this.setState({pendingDateToOpen: true})}>
                  <Left>
                    <Text style={{textAlign:'left',color:'black'}}>{this.state.pendingDateTo === null ? i18n.t('selectPendingDateTo') : formatDate(this.state.pendingDateTo)}</Text>
                  </Left>
                </Button>
                <DateTimePicker
                  mode="datetime"
                  isVisible={this.state.pendingDateToOpen}
                  onConfirm={(date)=>{ this.setState({pendingDateTo:(new Date(date)).getTime(),pendingDateToOpen:false})}}
                  onCancel={()=>this.setState({pendingDateToOpen:false})}
                  />
              </View>
            </Left>
          </Item>

          <Item>
            <Left>
              <Text note>{i18n.t('statusDateFrom')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Button block style={{backgroundColor:'white', width:'99%'}} onPress={()=>this.setState({statusDateFromOpen: true})}>
                  <Left>
                    <Text style={{textAlign:'left',color:'black'}}>{this.state.statusDateFrom === null ? i18n.t('selectstatusDateFrom') : formatDate(this.state.statusDateFrom)}</Text>
                  </Left>
                </Button>
                <DateTimePicker
                  mode="datetime"
                  isVisible={this.state.statusDateFromOpen}
                  onConfirm={(date)=>{ this.setState({statusDateFrom:(new Date(date)).getTime(),statusDateFromOpen:false})}}
                  onCancel={()=>this.setState({statusDateFromOpen:false})}
                  />
              </View>
            </Left>
            <Left>
              <Text note style={{marginLeft: 0 }}>{i18n.t('statusDateTo')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Button block style={{backgroundColor:'white', width:'99%' }} onPress={()=>this.setState({statusDateToOpen: true})}>
                  <Left>
                    <Text style={{textAlign:'left',color:'black'}}>{this.state.statusDateTo === null ? i18n.t('selectStatusDateTo') : formatDate(this.state.statusDateTo)}</Text>
                  </Left>
                </Button>
                <DateTimePicker
                  mode="datetime"
                  isVisible={this.state.statusDateToOpen}
                  onConfirm={(date)=>{ this.setState({statusDateTo:(new Date(date)).getTime(),statusDateToOpen:false})}}
                  onCancel={()=>this.setState({statusDateToOpen:false})}
                  />
              </View>
            </Left>
          </Item>

          <Button onPress={this.submit.bind(this)} primary block style={{ margin: 15 }}>
            <Text>{i18n.t('search')}</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ storageHelpStatuses, storageUsers, storageCompanies, storageHelpTaskTypes }) => {
  const { statuses } = storageHelpStatuses;
  const { users } = storageUsers;
  const { companies } = storageCompanies;
  const { taskTypes } = storageHelpTaskTypes;
  return {
    statuses,
    users,
    companies,
    taskTypes,
  };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{})(Search);
