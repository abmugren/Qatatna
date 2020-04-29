import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import { SaveUser } from './../Actions/AuthActions' //redux
import { SetLanguage } from './../Actions'
import Spinner from 'react-native-loading-spinner-overlay';

class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Processing: false
        };
    }

    ChooseLoginType() {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'ChooseLoginType' })
            ],
        }))
    }

    componentDidMount() {
        this.setState({ Processing: true })
        AsyncStorage.getItem('User').then((value) => {
            if (value != null) {
                const user = JSON.parse(value)

                AsyncStorage.getItem('Lang').then((value) => {
                    if (value != null) {
                        this.props.SetLanguage(value)
                        this.props.SaveUser(user)
                        this.setState({ Processing: false })
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'HomeRoutes' })
                            ],
                        }))
                    } else {
                        this.props.SetLanguage("AR")
                        this.props.SaveUser(user)
                        this.setState({ Processing: false })
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'HomeRoutes' })
                            ],
                        }))
                    }
                })

            } else {
                this.setState({ Processing: false })
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                {
                    this.state.Processing ?
                        null
                        :
                        <View >
                            <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                                <Image source={require('./../../Images/Logo.png')} style={[styles.image]} />
                            </View>

                            <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                                <Text style={{ textAlign: 'center', marginVertical: 80, }} >{"مرحبا بك في تطبيق قطتنا \n يمكنك التسجيل و أضافة جميع أصدقائك"}</Text>
                            </View>

                            <View style={[styles.row, styles.shadow, { width, justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.04 }]}>
                                <TouchableOpacity onPress={() => this.ChooseLoginType()} style={[styles.Button, styles.shadow, { backgroundColor: '#8AD032', borderColor: '#3E9545', borderWidth: 4, marginTop: 40, borderRadius: 60 }]} >
                                    <Text style={{ color: '#343434', fontSize: 19, fontWeight: 'bold' }}>
                                        {'سجل الأن'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }

            </SafeAreaView>
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
export default connect(mapStateToProps, { SaveUser, SetLanguage })(WelcomeScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    flex: {
        flex: 0
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column'
    },
    rowReverse: {
        flexDirection: 'row-reverse'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    image: {
        width: width - (36 * 4),
        // height: height * 0.2,
        aspectRatio: 1.8,
        resizeMode: 'stretch'
    },
    Button: {
        width: width - (36 * 2) + 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 18,
        marginHorizontal: 36
    },
})