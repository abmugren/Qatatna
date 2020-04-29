import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import NavigationServices from './../../NavigationServices';

import { connect } from 'react-redux' // redux
import { logOut } from './../../Actions' //redux

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  UNSAFE_componentWillMount(){
    this.props.logOut()
    NavigationServices.reset('ChooseLoginType')
  }

  render() {
    return (
      <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
}

//redux
const mapStateToProps = state => {
  return {
     User: state.AuthReducer.User,
  }
}
// redux
export default connect(mapStateToProps, { logOut })(Logout)