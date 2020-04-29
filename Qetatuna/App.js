import React, { Component } from 'react';
import NavigationServices from './Models/NavigationServices'
import Routes from './Models/Routes';
// import { AsyncStorage } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import Reducers from './Models/Reducers'

export default class App extends Component {

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    //alert(fcmToken)
    console.log(fcmToken)
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log(fcmToken)
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    firebase.notifications().onNotification(async notification => {
      const badgeCount = await firebase.notifications().getBadge();
      notification.android.setChannelId('insider').setSound('default')
      firebase.notifications().displayNotification(notification)
      firebase.notifications().setBadge(badgeCount + 1);
    });
  }

  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
  }

  render() {
    return (
      <Provider store={createStore(Reducers, {}, applyMiddleware(ReduxThunk))} >
        <Routes ref={navigatorRef => {
          NavigationServices.setTopLevelNavigator(navigatorRef);
        }} />
      </Provider>
    );
  }
}