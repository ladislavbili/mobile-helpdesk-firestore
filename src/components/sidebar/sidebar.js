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
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project:'all',
      filter:'none',
    };
  }
  render() {
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
              supportedOrientations={['portrait', 'landscape']}
              selectedValue={this.state.project}
              onValueChange={(value)=>{
                Actions.currentScene==='taskList'?
                  Actions.refresh({filterID:this.state.filter,projectID:value,order:this.props.generalOrder}):
                  Actions.taskList({filterID:this.state.filter,projectID:value,order:this.props.generalOrder});
                this.setState({project:value});
                this.props.closeDrawer()}}>
              {[{title:i18n.t('all'), id:'all'}].concat(this.props.projects).map(
                (project)=> <Item label={project.title} key={project.id} value={project.id} />
            )}
          </Picker>
        </View>
        { false &&
          <ListItem button noBorder >
            <Text>{i18n.t('filters')}</Text>
          </ListItem>
          }
          <List
            dataArray={[{title:i18n.t('none'),id:'none'}].concat(this.props.filters)} renderRow={data =>
              <ListItem button noBorder onPress={() => {
                  Actions.currentScene==='taskList'?
                  Actions.refresh({filterID:data.id,projectID:this.state.project,order:this.props.generalOrder}):
                  Actions.taskList({filterID:data.id,projectID:this.state.project,order:this.props.generalOrder});
                  this.setState({filter:data.id});
                  this.props.closeDrawer()}} >
                <Left>
                  <Icon active name="ios-color-filter-outline" style={{ color: data.id===this.state.filter?'#3F51B5':'#777', fontSize: 26, width: 30 }} />
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
const mapStateToProps = ({ sidebarReducer,taskReducer }) => {
  const { sidebar } = sidebarReducer;
  const {generalOrder} = taskReducer;
  return { filters:sidebar.filters,projects:sidebar.projects.concat(sidebar.archived),generalOrder};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {closeDrawer})(SideBar);
