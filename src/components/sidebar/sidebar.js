import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Title ,Header, Body, Content, Text, List, ListItem, Icon, Container, Left, Right, Badge, Picker, View, Item } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator } from 'react-native';

import { closeDrawer } from '../../redux/actions';
import styles from './style';
import i18n from 'i18next';

/**
 * Displays user a list of all projects and filters
 * @extends Component
 */
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project:'all',
      filter:'none',
    };
  }
  render() {
    let filters = [{title:i18n.t('none'),id:'none'}].concat(this.props.filters.filter((filter)=>filter.createdBy===this.props.currentUser.id||filter.public||this.props.currentUser.userData.role === 3 ));
    let projects = [{title:i18n.t('all'), id:'all'}].concat(
      this.props.projects.filter((project)=>{
        let curr = this.props.currentUser;
        if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
          return true;
        }
        let permission = project.permissions.find((permission)=>permission.user===curr.id);
        return permission && permission.read;
      })
    );

    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: '#fff', top: -1 }}
          >
          <Header>
            <Body>
              <Title>{i18n.t('appName')}</Title>
            </Body>
            <Right />
          </Header>
          <Text note>{i18n.t('project')}</Text>
          <View style={{ borderColor: '#CCCCCC', borderWidth: 0.5, marginBottom: 15 }}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Select your project"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              style={{ width: undefined }}
              selectedValue={this.state.project}
              onValueChange={(value)=>{
                Actions.currentScene==='taskList'?
                  Actions.refresh({filterID:this.state.filter,projectID:value,order:this.props.generalOrder}):
                  Actions.taskList({filterID:this.state.filter,projectID:value,order:this.props.generalOrder});
                this.setState({project:value});
                this.props.closeDrawer()}}
            >
            {
              projects.map((project,index)=>
                <Picker.Item label={project.title} value={project.id} />
              )
            }
            </Picker>
        </View>
          <List
            dataArray={filters} renderRow={data =>
              <ListItem button noBorder onPress={() => {
                  Actions.currentScene==='taskList'?
                  Actions.refresh({filterID:data.id,projectID:this.state.project,order:this.props.generalOrder}):
                  Actions.taskList({filterID:data.id,projectID:this.state.project,order:this.props.generalOrder});
                  this.setState({filter:data.id});
                  this.props.closeDrawer()}} >
                <Left>
                  <Text style={styles.text}>{data.title}</Text>
                </Left>
              </ListItem>
            }
            />
        </Content>
      </Container>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ storageHelpFilters, storageHelpProjects, loginReducer }) => {
  const { filters } = storageHelpFilters;
  const { projects } = storageHelpProjects;
  return { filters, projects, currentUser:loginReducer };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {closeDrawer})(Sidebar);
