import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import { Input, Item, Picker } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Entypo from 'react-native-vector-icons/Entypo'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            Processing: false
        };
    }

    renderHeader(lang) {
        return (
            <View style={[styles.flex, styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6', shadowOpacity: 0.1 }]} >
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
                <Text style={{ color: '#000', fontSize: 16 }}>{"نسيت كلمه المرور"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    sendEmail () {
        const thisComponent = this
        const { email } = this.state
        thisComponent.setState({ Processing: true })
        try {
            axios.get('http://167.172.183.142/api/user/forgetPassword', {
                params : {
                    email: email.toLowerCase()
                },
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.props.navigation.goBack()
            }).catch(function (error) {
                console.log(error)
                thisComponent.setState({ Processing: false })
                if (error.response && error.response.data && error.response.data.message) {
                    setTimeout(() => {
                        alert('Oops! ' + error.response.data.message);
                    }, 100);
                } else {
                    setTimeout(() => {
                        alert('Oops! ' + "Network error");
                    }, 100);
                }
            })
        } catch (error) {
            // console.log(error)
            thisComponent.setState({ Processing: false })
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader(this.props.Language)}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-evenly' }} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                        <Image source={require('./../../Images/Logo.png')} style={[styles.image]} />
                    </View>

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.column, { flex: 1, marginHorizontal: 18, backgroundColor: '#FFF', paddingHorizontal: 12 }]}>

                            <View style={[styles.column, { width: '100%', height: height * 0.08 }]} ></View>

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', }]} >
                                <Text style={{ fontSize: 14, color: '#707070' }} >
                                    {'ارسل علي البريد الألكترونى'}
                                </Text>
                            </View>

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                                <Item style={[styles.inputFields, { marginTop: 8, flex: 1, marginLeft: -1 }]}>
                                    <Input
                                        placeholder={'البريد الألكترونى'}
                                        placeholderTextColor={"#E9E9E9"}
                                        // keyboardType="numeric"
                                        style={{ color: '#003F51', height: 50 }} textAlign={'center'}
                                        onChangeText={(text) => this.setState({ email: text })}
                                    />
                                </Item>
                            </View>

                            <View style={[styles.column, { width: '100%', height: height * 0.08 }]} ></View>

                        </View>
                    </View>

                    <View style={[styles.column, { width: "100%" }]}>
                        <View style={[styles.row, styles.shadow, { width, justifyContent: 'center', elevation: 5, alignItems: 'center' }]}>
                            <TouchableOpacity onPress={() => this.sendEmail()} style={[styles.Button, styles.shadow, { backgroundColor: '#8AD032', elevation: 5, borderColor: '#3E9545', borderWidth: 4, borderRadius: 12 }]} >
                                <Text style={{ color: '#343434', fontSize: 19, fontWeight: 'bold' }}>
                                    {'ارسل'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 14 }]} >
                            <Text style={{ fontSize: 14, color: '#0C546A', fontWeight: 'bold' }} >
                                {'فقدت كلمة المرور؟'}
                            </Text>
                        </View> */}
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
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
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    image: {
        width: width - (36 * 4),
        // height: height * 0.2,
        aspectRatio: 1.8,
        resizeMode: 'stretch',
        // marginVertical: height * 0.04
    },
    inputFields: {
        borderColor: '#E9E9E9',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRadius: 8
    },
    Button: {
        width: width - (18 * 2),
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginHorizontal: 18
    },
})