import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import { Input, Item, Picker } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Entypo from 'react-native-vector-icons/Entypo'
import CountryPicker from 'react-native-country-picker-modal'
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux
import { SaveUser } from './../Actions/AuthActions' //redux
import { StackActions, NavigationActions } from 'react-navigation'

class LoginMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '966',
            cca2: 'SA',
            mobile: '',
            Processing: false
        };
    }

    renderHeader(lang) {
        return (
            <View style={[styles.flex, styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6', shadowOpacity: 0.1 }]} >
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
                <Text style={{ color: '#000', fontSize: 16 }}>{"تسجيل دخول"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.User) {
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'HomeRoutes' })
                ],
            }))
        }
    }

    MemberLogin = async () => {
        const thisComponent = this
        const { mobile } = this.state
        var fcmToken = await AsyncStorage.getItem("fcmToken");
        thisComponent.setState({ Processing: true })
        try {
            axios.get('http://167.172.183.142/api/user/loginMember', {
                params: {
                    mobile, callingCode: thisComponent.state.code, countryCode: thisComponent.state.cca2, userKey: fcmToken
                }
            }).then(function (response) {
                console.log(response)
                const usr = {
                    _id: response.data._id,
                    fullname: response.data.fullname,
                    mobile: response.data.mobile,
                    email: response.data.email,
                    countryCode: response.data.countryCode,
                    callingCode: response.data.callingCode,
                    imgPath: response.data.imgPath,
                    membershipStatus: response.data.membershipStatus ? response.data.membershipStatus : 1,
                    isMember: true
                }
                AsyncStorage.setItem('User', JSON.stringify(usr))
                thisComponent.props.SaveUser(usr)
                thisComponent.setState({ Processing: false })
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
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 14, color: '#000' }} >
                            {'عضو داخل مجموعة'}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.column, { flex: 1, marginHorizontal: 18, backgroundColor: '#FFF', paddingHorizontal: 12 }]}>

                            <View style={[styles.column, { width: '100%', height: height * 0.08 }]} ></View>

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', }]} >
                                <Text style={{ fontSize: 14, color: '#707070' }} >
                                    {'رقم الجوال'}
                                </Text>
                            </View>

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical:4 }]} >
                                <Text style={{ fontSize: 14, color: 'red' }} >
                                    {' ادخل الرقم بدون صفر'}
                                </Text>
                            </View>

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >

                                <View style={[styles.row, styles.inputFields, { width: '35%', justifyContent: 'space-evenly', alignItems: 'center', borderBottomWidth: 1, borderTopEndRadius: 0, borderBottomEndRadius: 0, marginTop: 8 }]}>
                                    <CountryPicker
                                        countryCode={this.state.cca2}
                                        translation={'common'}
                                        withAlphaFilter
                                        withCallingCodeButton
                                        withFlagButton={false}
                                        withCallingCode
                                        onSelect={(country) => this.setState({ code: country.callingCode, cca2: country.cca2 })}
                                    />
                                    <View style={{ flex: 0, height: 50, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                                        <Entypo name="chevron-down" style={{ color: '#000', fontSize: 18 }} />
                                    </View>
                                </View>

                                <Item style={[styles.inputFields, { marginTop: 8, flex: 1, borderTopStartRadius: 0, borderBottomStartRadius: 0, marginLeft: -1 }]}>
                                    <Input
                                        placeholder={'رقم الجوال'}
                                        placeholderTextColor={"#E9E9E9"}
                                        keyboardType="numeric"
                                        style={{ color: '#003F51', height: 50 }} textAlign={'center'}
                                        onChangeText={(text) => this.setState({ mobile: text })}
                                    />
                                </Item>
                            </View>

                            <View style={[styles.column, { width: '100%', height: height * 0.08 }]} ></View>

                        </View>
                    </View>

                    <View style={[styles.column, { width: "100%" }]}>
                        <View style={[styles.row, styles.shadow, { width, justifyContent: 'center', elevation: 5, alignItems: 'center' }]}>
                            <TouchableOpacity onPress={() => this.MemberLogin()} style={[styles.Button, styles.shadow, { backgroundColor: '#8AD032', elevation: 5, borderColor: '#3E9545', borderWidth: 4, borderRadius: 12 }]} >
                                <Text style={{ color: '#343434', fontSize: 19, fontWeight: 'bold' }}>
                                    {'تسجيل الدخول'}
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

//redux
const mapStateToProps = state => {
    return {
        User: state.AuthReducer.User,
    }
}
// redux
export default connect(mapStateToProps, { SaveUser })(LoginMember)

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