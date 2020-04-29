import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
const { width, height } = Dimensions.get('window')

export default class SplashScreen extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   componentDidMount() {
      setTimeout(() => {
         this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
               NavigationActions.navigate({ routeName: 'WelcomeScreen' })
            ],
         }))
      }, 1500)
   }

   render() {
      return (
         <SafeAreaView style={styles.container} >
            <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
            <Image source={require('./../../Images/Logo.png')} style={[styles.image]} />
         </SafeAreaView>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
   },
   image: {
      width: width-( 36*2 ),
      height: height*0.24,
      resizeMode:'stretch'
   },
});