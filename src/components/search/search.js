import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-native';
import { Input, Picker, Item, Container, Header, Title, Content, Button, Icon, Text, Left, Body, View, List, ListItem, Footer, FooterTab, CheckBox } from 'native-base';
import { Actions } from 'react-native-router-flux';

import i18n from 'i18next';

import {compactUserForSearch} from '../../helperFunctions';

/**
 * Allows user to seach for a specific tasks
 * @extends Component
 */
class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title:'',
      modalCreatedBy:false,
      createdBySearch:'',
      createdBy:[],
      modalRequestedBy:false,
      requestedBySearch:'',
      requestedBy:[],
      modalAssignedTo:false,
      assignedToSearch:'',
      assignedTo:[],
      modalStatuses:false,
      statusesSearch:'',
      statuses:[],
      modalProjects:false,
      projectsSearch:'',
      projects:[],
      modalCompanies:false,
      companiesSearch:'',
      companies:[],
      modalLabel:false,
      tagsSearch:'',
      tags:[]
    }
  }

  /**
   * Gathers all of the data from the current state and sends them via actions to the redux. Then it returns user back to previous component
   */
  submit(){
    let tags = "";
    this.state.tags.map((item)=> tags+= item.id+',');

    let companies = "";
    this.state.companies.map((item)=> companies+= item.id+',');

    let projects = "";
    this.state.projects.map((item)=> projects+= item.id+',');

    let statuses = "";
    this.state.statuses.map((item)=> statuses+= item.id+',');

    let assignedTo = "";
    this.state.assignedTo.map((item)=> assignedTo+= item.id+',');

    let requestedBy = "";
    this.state.requestedBy.map((item)=> requestedBy+= item.id+',');

    let createdBy = "";
    this.state.createdBy.map((item)=> createdBy+= item.id+',');
      Actions.taskList({filter:
        {
          search:this.state.title,
          tag:tags.substring(0,tags.length-1),
          company:companies.substring(0,companies.length-1),
          project:projects.substring(0,projects.length-1),
          status:statuses.substring(0,statuses.length-1),
          assigned:assignedTo.substring(0,assignedTo.length-1),
          requester:requestedBy.substring(0,requestedBy.length-1),
          creator:createdBy.substring(0,createdBy.length-1),
        }
        ,listName:'Search results'});
    }

    render() {
      return (
        <Container>
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

            <Text note>{i18n.t('filterCreatedBy')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <Button block onPress={()=>{this.setState({modalCreatedBy:true})}}><Text>{i18n.t('filterByCreatedBy')}</Text></Button>
              <List
                dataArray={this.state.createdBy}
                renderRow={item =>
                  <ListItem>
                    <Body>
                      {
                        (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                      }
                      <Text note>{item.email}</Text>
                    </Body>
                  </ListItem>
                }
                />
            </View>
            <Modal
              animationType={"fade"}
              transparent={false}
              style={{flex:1}}
              visible={this.state.modalCreatedBy}
              onRequestClose={() => this.setState({modalCreatedBy:false})}
              >
              <Content style={{ padding: 15 }}>
                <Header>
                  <Body>
                    <Title>{i18n.t('selectFilterCreatedBy')}</Title>
                  </Body>
                </Header>

                <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                  <ListItem>
                    <Item rounded>
                      <Icon name="ios-search" />
                      <Input placeholder={i18n.t('search')} value={this.state.createdBySearch} onChangeText={(value)=>this.setState({createdBySearch:value})} />
                    </Item>
                  </ListItem>
                  <List>
                    {this.props.users.filter((item)=>compactUserForSearch(item).includes(this.state.createdBySearch.toLowerCase())).map((item)=>
                      <ListItem thumbnail key={item.id} onPress={()=>{
                          if(this.state.createdBy.includes(item)){
                            let newCreatedBy=[...this.state.createdBy];
                            newCreatedBy.splice(newCreatedBy.indexOf(item),1);
                            this.setState({createdBy:newCreatedBy});
                          }else{
                            this.setState({createdBy:[item,...this.state.createdBy]});
                          }}}>
                          <Left>
                            <CheckBox checked={this.state.createdBy.includes(item)}  onPress={()=>{
                                if(this.state.createdBy.includes(item)){
                                  let newCreatedBy=[...this.state.createdBy];
                                  newCreatedBy.splice(newCreatedBy.indexOf(item),1);
                                  this.setState({createdBy:newCreatedBy});
                                }else{
                                  this.setState({createdBy:[item,...this.state.createdBy]});
                              }}} />
                          </Left>
                          <Body>
                            {
                              (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                            }
                            <Text note>{item.email}</Text>
                          </Body>
                        </ListItem>
                      )}
                    </List>
                  </View>
              </Content>
              <Footer>

                <FooterTab>
                  <Button style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
                    onPress={()=>this.setState({modalCreatedBy:false})}>
                    <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Modal>

            <Text note>{i18n.t('filterRequestedBy')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <Button block onPress={()=>{this.setState({modalRequestedBy:true})}}><Text>{i18n.t('filterByRequestedBy')}</Text></Button>
              <List
                dataArray={this.state.requestedBy}
                renderRow={item =>
                  <ListItem>
                    <Body>
                      {
                        (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                      }
                      <Text note>{item.email}</Text>
                    </Body>
                  </ListItem>
                }
                />
            </View>
            <Modal
              animationType={"fade"}
              transparent={false}
              style={{flex:1}}
              visible={this.state.modalRequestedBy}
              onRequestClose={() => this.setState({modalRequestedBy:false})}
              >
              <Content style={{ padding: 15 }}>
                <Header>
                  <Body>
                    <Title>{i18n.t('selectFilterRequestedBy')}</Title>
                  </Body>
                </Header>

                <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                  <ListItem>
                    <Item rounded>
                      <Icon name="ios-search" />
                      <Input placeholder={i18n.t('search')} value={this.state.requestedBySearch} onChangeText={(value)=>this.setState({requestedBySearch:value})} />
                    </Item>
                  </ListItem>
                  <List>
                    {this.props.users.filter((item)=>compactUserForSearch(item).includes(this.state.requestedBySearch.toLowerCase())).map((item)=>
                      <ListItem thumbnail key={item.id} onPress={()=>{
                          if(this.state.requestedBy.includes(item)){
                            let newRequestedBy=[...this.state.requestedBy];
                            newRequestedBy.splice(newRequestedBy.indexOf(item),1);
                            this.setState({requestedBy:newRequestedBy});
                          }else{
                            this.setState({requestedBy:[item,...this.state.requestedBy]});
                          }}}>
                          <Left>
                            <CheckBox checked={this.state.requestedBy.includes(item)}  onPress={()=>{
                                if(this.state.requestedBy.includes(item)){
                                  let newRequestedBy=[...this.state.requestedBy];
                                  newRequestedBy.splice(newRequestedBy.indexOf(item),1);
                                  this.setState({requestedBy:newRequestedBy});
                                }else{
                                  this.setState({requestedBy:[item,...this.state.requestedBy]});
                                }}} />
                          </Left>
                          <Body>
                            {
                              (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                            }
                            <Text note>{item.email}</Text>
                          </Body>
                        </ListItem>
                      )}
                  </List>

                </View>
              </Content>
              <Footer>

                <FooterTab>
                  <Button style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
                    onPress={()=>this.setState({modalRequestedBy:false})}>
                    <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Modal>

            <Text note>{i18n.t('filterAssignedTo')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <Button block onPress={()=>{this.setState({modalAssignedTo:true})}}><Text>{i18n.t('filterByAssignedTo')}</Text></Button>
              <List
                dataArray={this.state.assignedTo}
                renderRow={item =>
                  <ListItem>
                    <Body>
                      {
                        (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                      }
                      <Text note>{item.email}</Text>
                    </Body>
                  </ListItem>
                }
                />
            </View>
            <Modal
              animationType={"fade"}
              transparent={false}
              style={{flex:1}}
              visible={this.state.modalAssignedTo}
              onRequestClose={() => this.setState({modalAssignedTo:false})}
              >
              <Content style={{ padding: 15 }}>
                <Header>
                  <Body>
                    <Title>{i18n.t('selectFilterAssignedTo')}</Title>
                  </Body>
                </Header>

                <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                  <ListItem>
                    <Item rounded>
                      <Icon name="ios-search" />
                      <Input placeholder={i18n.t('search')} value={this.state.assignedToSearch} onChangeText={(value)=>this.setState({assignedToSearch:value})} />
                    </Item>
                  </ListItem>
                  <List>
                    {this.props.users.filter((item)=>compactUserForSearch(item).includes(this.state.assignedToSearch.toLowerCase())).map((item)=>
                      <ListItem thumbnail key={item.id} onPress={()=>{
                          if(this.state.assignedTo.includes(item)){
                            let newAssignedTo=[...this.state.assignedTo];
                            newAssignedTo.splice(newAssignedTo.indexOf(item),1);
                            this.setState({assignedTo:newAssignedTo});
                          }else{
                            this.setState({assignedTo:[item,...this.state.assignedTo]});
                          }}}>
                          <Left>
                            <CheckBox checked={this.state.assignedTo.includes(item)}  onPress={()=>{
                                if(this.state.assignedTo.includes(item)){
                                  let newAssignedTo=[...this.state.assignedTo];
                                  newAssignedTo.splice(newAssignedTo.indexOf(item),1);
                                  this.setState({assignedTo:newAssignedTo});
                                }else{
                                  this.setState({assignedTo:[item,...this.state.assignedTo]});
                                }}} />
                            </Left>
                            <Body>
                              {
                                (item.name||item.surname)?<Text>{item.name?item.name+' ':''}{item.surname?item.surname:''}</Text>:null
                              }
                              <Text note>{item.email}</Text>
                            </Body>
                        </ListItem>
                      )}
                  </List>
                </View>
              </Content>
              <Footer>

                <FooterTab>
                  <Button style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
                    onPress={()=>this.setState({modalAssignedTo:false})}>
                    <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Modal>

            <Text note>{i18n.t('filterStatus')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <Button block onPress={()=>{this.setState({modalStatuses:true})}}><Text>{i18n.t('filterByStatus')}</Text></Button>
              <List
                dataArray={this.state.statuses}
                renderRow={status =>
                  <ListItem>
                    <View style={{backgroundColor:((status.color.includes('#')?'':'#')+status.color),paddingLeft:10}}>
                      <Text style={{color:'white'}}>{status.title}</Text>
                    </View>
                  </ListItem>
                }
                />
            </View>
            <Modal
              animationType={"fade"}
              transparent={false}
              style={{flex:1}}
              visible={this.state.modalStatuses}
              onRequestClose={() => this.setState({modalStatuses:false})}
              >
              <Content style={{ padding: 15 }}>
                <Header>
                  <Body>
                    <Title>{i18n.t('selectFilterStatus')}</Title>
                  </Body>
                </Header>

                <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                  <ListItem>
                    <Item rounded>
                      <Icon name="ios-search" />
                      <Input placeholder={i18n.t('search')} value={this.state.statusesSearch} onChangeText={(value)=>this.setState({statusesSearch:value})} />
                    </Item>
                  </ListItem>

                  <List>
                    {this.props.statuses.filter((item)=>item.title.toLowerCase().includes(this.state.statusesSearch.toLowerCase())).map((item)=>
                      <ListItem key={item.id} thumbnail onPress={()=>{
                          if(this.state.statuses.includes(item)){
                            let newStatuses=[...this.state.statuses];
                            newStatuses.splice(newStatuses.indexOf(item),1);
                            this.setState({statuses:newStatuses});
                          }else{
                            this.setState({statuses:[item,...this.state.statuses]});
                          }
                        }}>
                        <Left>
                          <CheckBox checked={this.state.statuses.includes(item)} onPress={()=>{
                              if(this.state.statuses.includes(item)){
                                let newStatuses=[...this.state.statuses];
                                newStatuses.splice(newStatuses.indexOf(item),1);
                                this.setState({statuses:newStatuses});
                              }else{
                                this.setState({statuses:[item,...this.state.statuses]});
                              }
                            }}/>
                        </Left>
                        <Body>
                          <View style={{backgroundColor:((item.color.includes('#')?'':'#')+item.color),paddingLeft:10}}>
                            <Text style={{color:'white'}}>{item.title}</Text>
                          </View>
                        </Body>
                    </ListItem>
                  )}
                </List>
              </View>
            </Content>
            <Footer>

              <FooterTab>
                <Button style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
                  onPress={()=>this.setState({modalStatuses:false})}>
                  <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Modal>

          <Text note>{i18n.t('filterProject')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Button block onPress={()=>{this.setState({modalProjects:true})}}><Text>{i18n.t('filterByProject')}</Text></Button>
            <List
              dataArray={this.state.projects}
              renderRow={project =>
                <ListItem>
                  <Text>{project.title}</Text>
                </ListItem>
              }
              />
          </View>
          <Modal
            animationType={"fade"}
            transparent={false}
            style={{flex:1}}
            visible={this.state.modalProjects}
            onRequestClose={() => this.setState({modalProjects:false})}
            >
            <Content style={{ padding: 15 }}>
              <Header>
                <Body>
                  <Title>{i18n.t('selectFilterProject')}</Title>
                </Body>
              </Header>

              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <ListItem>
                  <Item rounded>
                    <Icon name="ios-search" />
                    <Input placeholder={i18n.t('search')} value={this.state.projectsSearch} onChangeText={(value)=>this.setState({projectsSearch:value})} />
                  </Item>
                </ListItem>
                <List>
                  {this.props.projects.filter((item)=>item.title.toLowerCase().includes(this.state.projectsSearch.toLowerCase())).map((item)=>
                    <ListItem key={item.id} thumbnail onPress={()=>{
                        if(this.state.projects.includes(item)){
                          let newprojects=[...this.state.projects];
                          newprojects.splice(newprojects.indexOf(item),1);
                          this.setState({projects:newprojects});
                        }else{
                          this.setState({projects:[item,...this.state.projects]});
                        }
                      }}>
                      <Left>
                        <CheckBox checked={this.state.projects.includes(item)} onPress={()=>{
                            if(this.state.projects.includes(item)){
                              let newprojects=[...this.state.projects];
                              newprojects.splice(newprojects.indexOf(item),1);
                              this.setState({projects:newprojects});
                            }else{
                              this.setState({projects:[item,...this.state.projects]});
                            }
                          }}/>
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
                    onPress={()=>this.setState({modalProjects:false})}>
                    <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Modal>

            <Text note>{i18n.t('filterCompany')}</Text>
            <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
              <Button block onPress={()=>{this.setState({modalCompanies:true})}}><Text>{i18n.t('filterByCompany')}</Text></Button>
              <List
                dataArray={this.state.companies}
                renderRow={company =>
                  <ListItem>
                    <Text>{company.title}</Text>
                  </ListItem>
                }
                />
            </View>
            <Modal
              animationType={"fade"}
              transparent={false}
              style={{flex:1}}
              visible={this.state.modalCompanies}
              onRequestClose={() => this.setState({modalCompanies:false})}
              >
              <Content style={{ padding: 15 }}>
                <Header>
                  <Body>
                    <Title>{i18n.t('selectFilterCompany')}</Title>
                  </Body>
                </Header>

                <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                  <ListItem>
                    <Item rounded>
                      <Icon name="ios-search" />
                      <Input placeholder={i18n.t('search')} value={this.state.companiesSearch} onChangeText={(value)=>this.setState({companiesSearch:value})} />
                    </Item>
                  </ListItem>
                  <List>
                    {this.props.companies.filter((item)=>item.title.toLowerCase().includes(this.state.companiesSearch.toLowerCase())).map((item)=>
                      <ListItem key={item.id} thumbnail onPress={()=>{
                          if(this.state.companies.includes(item)){
                            let newCompanies=[...this.state.companies];
                            newCompanies.splice(newCompanies.indexOf(item),1);
                            this.setState({companies:newCompanies});
                          }else{
                            this.setState({companies:[item,...this.state.companies]});
                          }
                        }}>
                        <Left>
                          <CheckBox checked={this.state.companies.includes(item)} onPress={()=>{
                              if(this.state.companies.includes(item)){
                                let newCompanies=[...this.state.companies];
                                newCompanies.splice(newCompanies.indexOf(item),1);
                                this.setState({companies:newCompanies});
                              }else{
                                this.setState({companies:[item,...this.state.companies]});
                              }
                            }}/>
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
                      onPress={()=>this.setState({modalCompanies:false})}>
                      <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
                    </Button>
                  </FooterTab>
                </Footer>
              </Modal>

              <Text note>{i18n.t('filterLabel')}</Text>
              <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
                <Button block onPress={()=>{this.setState({modalLabel:true})}}><Text>{i18n.t('filterByLabel')}</Text></Button>
                <List
                  dataArray={this.state.tags}
                  renderRow={label =>
                    <ListItem>
                      <View style={{backgroundColor:((label.color.includes('#')?'':'#')+label.color),paddingLeft:10}}>
                        <Text style={{color:'white'}}>{label.title}</Text>
                      </View>
                    </ListItem>
                  }
                  />
              </View>
              <Modal
                animationType={"fade"}
                transparent={false}
                style={{flex:1}}
                visible={this.state.modalLabel}
                onRequestClose={() => this.setState({modalLabel:false})}
                >
                <Content style={{ padding: 15 }}>
                  <Header>
                    <Body>
                      <Title>{i18n.t('selectFilterLabel')}</Title>
                    </Body>
                  </Header>

                  <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>

                    <ListItem>
                      <Item rounded>
                        <Icon name="ios-search" />
                        <Input placeholder={i18n.t('search')} value={this.state.tagsSearch} onChangeText={(value)=>this.setState({tagsSearch:value})} />
                      </Item>
                    </ListItem>
                    <List>
                      {this.props.tags.filter((item)=>item.title.toLowerCase().includes(this.state.tagsSearch.toLowerCase())).map((item)=>
                        <ListItem key={item.id} thumbnail onPress={()=>{
                            if(this.state.tags.includes(item)){
                              let newtags=[...this.state.tags];
                              newtags.splice(newtags.indexOf(item),1);
                              this.setState({tags:newtags});
                            }else{
                              this.setState({tags:[item,...this.state.tags]});
                            }
                          }}>
                          <Left>
                            <CheckBox checked={this.state.tags.includes(item)} onPress={()=>{
                                if(this.state.tags.includes(item)){
                                  let newtags=[...this.state.tags];
                                  newtags.splice(newtags.indexOf(item),1);
                                  this.setState({tags:newtags});
                                }else{
                                  this.setState({tags:[item,...this.state.tags]});
                                }
                              }}/>
                          </Left>
                          <Body>
                            <View style={{backgroundColor:((item.color.includes('#')?'':'#')+item.color),paddingLeft:10}}>
                              <Text style={{color:'white'}}>{item.title}</Text>
                            </View>
                          </Body>
                        </ListItem>
                      )}
                  </List>
                </View>
              </Content>
              <Footer>

                <FooterTab>
                  <Button style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 0.5 }}
                    onPress={()=>this.setState({modalLabel:false})}>
                    <Text style={{ color: 'white' }}>{i18n.t('done')}</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Modal>

            <Button onPress={this.submit.bind(this)} primary block style={{ margin: 15 }}>
              <Text>{i18n.t('search')}</Text>
            </Button>
          </Content>
        </Container>
      );
    }
  }

  //creates function that maps actions (functions) to the redux store
  const mapStateToProps = ({ taskReducer, loginReducer, userReducer, companyReducer }) => {
    const { users } = userReducer;
    const { companies,statuses, projects,tags} = taskReducer;
    const { token } = loginReducer;

    return { users, companies,statuses, projects, tags, token};
  };

  //exports created Component connected to the redux store and redux actions
  export default connect(mapStateToProps,{})(Search);
