import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleProvider, Drawer } from 'native-base';
import { Router, Scene } from 'react-native-router-flux';

import { closeDrawer } from '../redux/actions';
import material from '../../native-base-theme/variables/material';
import getTheme from '../../native-base-theme/components';
import SideBar from '../components/sidebar';
import Settings from '../components/settings';
import TaskList from '../components/taskList';
import TaskEdit from '../components/taskEdit';
import TaskAdd from '../components/taskAdd';
import CommentAdd from '../components/commentAdd';
import Account from '../components/account';
import ItemAdd from '../components/itemAdd';
import ItemEdit from '../components/itemEdit';
import SubtaskAdd from '../components/subtaskAdd';
import SubtaskEdit from '../components/subtaskEdit';
import UserList from '../components/userList';
import UserAdd from '../components/userAdd';
import UserEdit from '../components/userEdit';
import CompanyList from '../components/companyList';
import CompanyAdd from '../components/companyAdd';
import CompanyEdit from '../components/companyEdit';
import Search from '../components/search';

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
