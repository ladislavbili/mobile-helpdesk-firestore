import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';

import TabComments from './tabComments';
import {setCommentsLoading,getComments} from '../../../redux/actions';

/**
 * Loads all of the data needed for user to seach for tasks
 * @extends Component
 */
class TabCommentsLoader extends Component {
  constructor(props){
    super(props);
    this.props.setCommentsLoading(false);
    this.props.getComments(this.props.id,this.props.token);
  }
  render() {
    if(!this.props.commentsLoaded){
      return (
        <ActivityIndicator
        animating size={ 'large' }
        color='#007299' />
      )
    }
    return (
      <TabComments id={this.props.id}/>
    );
  }
}

//creates function that maps actions (functions) to the redux store
const mapStateToProps = ({loginReducer, commentReducer}) => {
  const {token} = loginReducer;
  const {commentsLoaded } = commentReducer;
  return {token, commentsLoaded};
};

//exports created Component connected to the redux store and redux actions
export default connect(mapStateToProps,{setCommentsLoading,getComments})(TabCommentsLoader);
