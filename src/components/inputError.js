import React, { Component } from 'react';
import { Text } from 'native-base';
import i18n from 'i18next';

export default class InputError extends Component{

  render(){
    if(this.props.show === undefined){
      return <div className="error-style">{`DEFINE PARAMETER SHOW - add to the component parameter show={true/false condition}`}</div>
    }
    if(!this.props.show){
      return null
    }
    return(
      <Text note style={{color:'red'}}>{i18n.t(this.props.message ? this.props.message : 'No message defined!')}</Text>
    )
  }
}
