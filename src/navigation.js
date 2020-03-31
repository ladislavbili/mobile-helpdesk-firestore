import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleProvider, Drawer } from 'native-base';
import { Router, Scene } from 'react-native-router-flux';

import { closeDrawer } from './redux/actions';
import material from '../native-base-theme/variables/material';
import getTheme from '../native-base-theme/components';

import SideBar from './components/sidebar';
import Search from './components/search';

import Settings from './scenes/settings';
import UserList from './scenes/settings/users/userList';
import UserAdd from './scenes/settings/users/userAdd';
import UserEdit from './scenes/settings/users/userEdit';
import CompanyList from './scenes/settings/companies/companyList';
import CompanyAdd from './scenes/settings/companies/companyAdd';
import CompanyEdit from './scenes/settings/companies/companyEdit';
import Account from './scenes/settings/account';

import TaskList from './scenes/task/taskList';
import TaskEdit from './scenes/task/taskEdit';
import TaskAdd from './scenes/task/taskAdd';
import CommentAdd from './scenes/task/commentAdd';
import ItemAdd from './scenes/task/itemAdd';
import ItemEdit from './scenes/task/itemEdit';
import SubtaskAdd from './scenes/task/subtaskAdd';
import SubtaskEdit from './scenes/task/subtaskEdit';

/**
 * Contains router that was connected to the redux storage
 * @type {[router]}
*/
const RouterWithRedux = connect()(Router);

/**
 * Navigator that setups all the Scenes(screens) and Sidebar for the application.
 * @extends Component
*/
class AppNavigator extends Component {
  render() {
    return (
      <StyleProvider style={getTheme((this.props.themeState === 'material') ? material : undefined)}>
        <Drawer
          ref={(ref) => { this._drawer = ref; }}
          content={<SideBar navigator={this._navigator} />}
          onClose={() => this.closeDrawer()}
          >
          <RouterWithRedux>
            <Scene key="root" hideNavBar>
              <Scene key="taskList" component={TaskList} initial={true} />
              <Scene key="settings" component={Settings} />
              <Scene key="account" component={Account} />
              <Scene key="taskEdit" component={TaskEdit} />
              <Scene key="taskAdd" component={TaskAdd} />
              <Scene key="commentAdd" component={CommentAdd} />
              <Scene key="itemAdd" component={ItemAdd} />
              <Scene key="itemEdit" component={ItemEdit} />
              <Scene key="subtaskAdd" component={SubtaskAdd} />
              <Scene key="subtaskEdit" component={SubtaskEdit} />
              <Scene key="userList" component={UserList} />
              <Scene key="userAdd" component={UserAdd} />
              <Scene key="userEdit" component={UserEdit} />
              <Scene key="companyList" component={CompanyList} />
              <Scene key="companyAdd" component={CompanyAdd} />
              <Scene key="companyEdit" component={CompanyEdit} />
              <Scene key="search" component={Search} />
            </Scene>
          </RouterWithRedux>
        </Drawer>
      </StyleProvider>
    );
  }
  /**
   * Checks, if sidebar was openned or closed, if yes, it triggers the correct action
   * @return {null}
   */
  componentDidUpdate() {
    if (this.props.drawerState === 'opened') {
      this.openDrawer();
    }

    if (this.props.drawerState === 'closed') {
      this._drawer._root.close();
    }
  }

  /**
   * Opens sidebar
   * @return {null}
   */
  openDrawer() {
    this._drawer._root.open();
  }
/**
 * Closes sidebar
 * @return {null}
 */
  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({ drawerReducer, navigationReducer }) => {
  return { drawerState: drawerReducer.drawerState, themeState:drawerReducer.themeState, navigation:navigationReducer };
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps, {closeDrawer})(AppNavigator);
