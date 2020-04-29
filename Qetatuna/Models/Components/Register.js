import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Platform } from 'react-native';
import { Input, Item, Picker } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Overlay } from 'react-native-elements'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
const { width, height } = Dimensions.get('window')
import CountryPicker from 'react-native-country-picker-modal'
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
axios.defaults.timeout = 10000
import { connect } from 'react-redux' // redux
import { SaveUser } from './../Actions/AuthActions' //redux
import { StackActions, NavigationActions } from 'react-navigation'
import ModalDropdown from 'react-native-modal-dropdown'

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            isVisible2: false,
            isVisible3: false,
            Processing: false,
            code: '966',
            cca2: 'SA',
            Countries: [],
            countryID: "0",
            username: '',
            password: '',
            mobile: '',
            email: null,
        };
    }

    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    Register() {
        const { username, password, mobile, email, countryID, code, cca2 } = this.state
        if (this.emailIsValid(email)) {
            if (password.length >= 8) {
                if (username.length >= 1) {
                    if (mobile.length >= 6) {
                        if (countryID != "0") {
                            this.UserRegister(username, email, password, countryID, mobile, code, cca2)
                        } else {
                            alert("اختر الدوله")
                        }
                    } else {
                        alert("اكتب رقم الهاتف ")
                    }
                } else {
                    alert("اكتب الاسم كاملا")
                }
            } else {
                alert("كلمه السر يجب ان تكون ٨ حروف علي الاقل")
            }
        } else {
            alert("البريد الاكتروني غير صالح")
        }
    }

    UserRegister = async (fullname, email, password, countryID, mobile, callingCode, countryCode) => {
        const thisComponent = this
        var fcmToken = await AsyncStorage.getItem("fcmToken");
        thisComponent.setState({ Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/register', {
                fullname, mobile, email: email.toLowerCase(), password, countryCode, callingCode, countryID, userKey: fcmToken
            }).then(function (response) {
                console.log(response)
                const usr = {
                    _id: response.data._id,
                    fullname: response.data.fullname,
                    mobile: response.data.mobile,
                    email: response.data.email,
                    password: response.data.password,
                    countryCode: response.data.countryCode,
                    callingCode: response.data.callingCode,
                    countryID: response.data.countryID,
                    membershipStatus: response.data.membershipStatus,
                    isMember: false
                }
                AsyncStorage.setItem('User', JSON.stringify(usr))
                thisComponent.props.SaveUser(usr)
                thisComponent.setState({ Processing: false })
            }).catch(function (error) {
                // console.log(error)
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

    UNSAFE_componentWillMount() {
        this.getCountries()
    }

    getCountries = () => {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getAllCountries")
                .then(response => {
                    thisComponent.setState({ Countries: response.data, Processing: false })
                }).catch(function (error) {
                    // console.log(error)
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

    renderHeader(lang) {
        return (
            <View style={[styles.flex, styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6', shadowOpacity: 0.1 }]} >
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
                <Text style={{ color: '#000', fontSize: 16 }}>{"أنشاء حساب"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    renderOverlay = () => {
        return (
            <Overlay
                isVisible={this.state.isVisible}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width={width - 36}
                height={height * 0.5}
                borderRadius={24}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 24, }]}>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 18 }]}>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                        <Text style={{ color: '#8AD032', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8 }}>
                            {"كود التفعيل"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 32 }]}>
                        <Text style={{ color: '#707070', fontSize: 14, textAlign: 'center' }}>
                            {"سيتم أرسال كود خاص على رقم الجوال لأتمام عملية التسجيل"}
                        </Text>
                    </View>

                    <View style={[styles.row, styles.shadow, { justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={() => this.setState({ isVisible: false, isVisible2: true })} style={[styles.Button, styles.shadow, { backgroundColor: '#E5F1D7', borderColor: '#8AD032', borderWidth: 4, borderRadius: 12, width: null, paddingHorizontal: 26, marginTop: 12 }]} >
                            <Text style={{ color: '#343434', fontSize: 19, fontWeight: 'bold' }}>
                                {'موافق'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Overlay>
        )
    }

    renderOverlay2 = () => {
        return (
            <Overlay
                isVisible={this.state.isVisible2}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width={width - 36}
                height={height * 0.5}
                borderRadius={24}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisible2: false })}
            >
                <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 24, }]}>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 18 }]}>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                        <Text style={{ color: '#8AD032', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8 }}>
                            {"كود التفعيل"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 18 }]}>
                        <Text style={{ color: '#707070', fontSize: 14, textAlign: 'center' }}>
                            {"برجاء أدخال كود التفعيل الذى تم أرساله على رقم الجوال التالى"}
                        </Text>
                    </View>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#3E9545', fontSize: 14, textAlign: 'center' }}>
                            {"+996-504208820"}
                        </Text>
                    </View>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', }]} >
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}>
                            <TouchableOpacity onPress={() => alert('Login')} style={[{ height: 40, backgroundColor: '#8AD032', borderColor: '#3E9545', borderWidth: 2, borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18, marginRight: -2 }]} >
                                <Text style={{ color: '#343434', fontSize: 14, fontWeight: 'bold' }}>
                                    {'تفعيل'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Item style={[styles.inputFields, { marginTop: 8, flex: 1, borderTopStartRadius: 0, borderBottomStartRadius: 0 }]}>
                            <Input
                                placeholder={'أدخل كود التفعيل'}
                                style={{ color: '#003F51', height: 40 }} textAlign={'center'}
                                onChangeText={(text) => this.setState({ mobile: text })}
                            />
                        </Item>
                    </View>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}>
                        <Text style={{ color: '#3E9545', fontSize: 14, textAlign: 'center' }}>
                            {"الكود غير صحيح"}
                        </Text>
                    </View>

                    <View style={[styles.row, styles.shadow, { justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={() => alert('Login')} style={[styles.Button, styles.shadow, { backgroundColor: '#E5F1D7', borderColor: '#D6D6D6', borderWidth: 1, borderRadius: 12, width: null, paddingHorizontal: 26, marginTop: 12 }]} >
                            <Text style={{ color: '#343434', fontSize: 12, fontWeight: '500' }}>
                                {'أعادة أرسال الكود'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Overlay>
        )
    }

    renderOverlay3 = () => {
        return (
            <Overlay
                isVisible={this.state.isVisible3}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width={width - 36}
                height={height * 0.5}
                borderRadius={24}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisible3: false })}
            >
                <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 24, }]}>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 18 }]}>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                        <Text style={{ color: '#8AD032', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8 }}>
                            {"عذرا"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 32 }]}>
                        <Text style={{ color: '#707070', fontSize: 14, textAlign: 'center' }}>
                            {"تم استنفاذ العدد المسموح به  للمحاولات   يمكنك المحاولة مرة أخرى بعد 24 ساعة "}
                        </Text>
                    </View>

                    <View style={[styles.row, styles.shadow, { justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={() => alert('Login')} style={[styles.Button, styles.shadow, { backgroundColor: '#8AD032', borderColor: '#3E9545', borderWidth: 4, borderRadius: 12, width: null, paddingHorizontal: 28, marginTop: 12 }]} >
                            <Text style={{ color: '#343434', fontSize: 19 }}>
                                {'موافق'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Overlay>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader(this.props.Language)}
                {this.renderOverlay()}
                {this.renderOverlay2()}
                {this.renderOverlay3()}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 22 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 14, color: '#000' }} >
                            {'البيانات'}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, styles.shadow, { flex: 1, width, justifyContent: 'center', alignItems: 'center', marginTop: 18 }]} >
                        <View style={[styles.column, { flex: 1, height: '100%', marginHorizontal: 18, backgroundColor: '#FFF', justifyContent: 'space-evenly', paddingHorizontal: 12 }]}>

                            <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                            <View style={[styles.column, { width: '100%' }]} >
                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.01 }]} >
                                    <Text style={{ fontSize: 14, color: '#707070' }} >
                                        {'أسم المستخدم'}
                                    </Text>
                                </View>

                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.015 }]} >
                                    <Item style={[styles.inputFields, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60 }]}>
                                        <Input
                                            placeholder={'ادخل أسم المستخدم'}
                                            placeholderTextColor={"#E9E9E9"}
                                            style={{ color: '#3E9545' }} textAlign={'center'}
                                            defaultValue={this.state.username}
                                            onChangeText={(text) => this.setState({ username: text })}
                                        />
                                    </Item>
                                </View>
                            </View>

                            <View style={[styles.column, { width: '100%' }]} >
                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.01 }]} >
                                    <Text style={{ fontSize: 14, color: '#707070' }} >
                                        {'البريد الألكترونى'}
                                    </Text>
                                </View>

                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.015 }]} >
                                    <Item style={[styles.inputFields, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60 }]}>
                                        <Input
                                            placeholder={'ادخل البريد الالكتروني'}
                                            placeholderTextColor={"#E9E9E9"}
                                            style={{ color: '#3E9545' }} textAlign={'center'}
                                            defaultValue={this.state.email}
                                            onChangeText={(text) => this.setState({ email: text })}
                                        />
                                    </Item>
                                </View>
                            </View>

                            <View style={[styles.column, { width: '100%' }]} >
                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.01 }]} >
                                    <Text style={{ fontSize: 14, color: '#707070' }} >
                                        {'كلمة المرور'}
                                    </Text>
                                </View>

                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.015 }]} >
                                    <Item style={[styles.inputFields, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60 }]}>
                                        <Input
                                            placeholder={'ادخل كلمة المرور'}
                                            placeholderTextColor={"#E9E9E9"}
                                            secureTextEntry={true}
                                            style={{ color: '#3E9545' }} textAlign={'center'}
                                            onChangeText={(text) => this.setState({ password: text })}
                                        />
                                    </Item>
                                </View>
                            </View>

                            <View style={[styles.column, { width: '100%' }]} >
                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.01 }]} >
                                    <Text style={{ fontSize: 14, color: '#707070' }} >
                                        {'الدولة'}
                                    </Text>
                                </View>

                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.015 }]} >

                                    <View style={[styles.row, styles.inputFields, { flex: 1, justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingHorizontal: 12, width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60 }]}>
                                        <AntDesign name="down" size={14} style={{ color: '#000' }} />
                                        <View style={[styles.row, { flex: 1, justifyContent: 'center', height: "90%" }]} >
                                            {/* <Picker
                                            selectedValue={this.state.countryID ? this.state.countryID : "0"}
                                            //selectedValue={"0"}
                                            mode="dropdown"
                                            style={[Platform.OS === 'android' ? { marginRight: -75 } : {}, { backgroundColor: '#FFF', flex: 1, }]}
                                            onValueChange={(item, Index) => this.setState({ countryID: item })}
                                            placeholderStyle={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center' }}
                                        >
                                            <Picker.Item label={"اختر الدوله"} textAlign={'center'} color={'#000'} value="0" />
                                            {
                                                this.state.Countries.map((item, index) => {
                                                    return (
                                                        <Picker.Item
                                                            textAlign={'center'}
                                                            label={item.titleAR}
                                                            value={item._id}
                                                            key={index.toString()}
                                                        />
                                                    )
                                                })
                                            }
                                        </Picker> */}
                                            <ModalDropdown
                                                // Data => Array
                                                options={this.state.Countries} // data
                                                // Default Value => Before Selection
                                                defaultValue={"اختر الدوله"}
                                                // Selection Process
                                                onSelect={(index, value) => { this.setState({ countryID: value._id }) }}
                                                // Value After Selection
                                                renderButtonText={(rowData) => (rowData.titleAR)} // ba3d ma t5tar
                                                // Styling
                                                style={{ backgroundColor: '#FFF', flex: 1, height: '100%', justifyContent: 'center' }} // abl ma t5tar
                                                textStyle={{ textAlign: 'center', fontSize: 16, color: '#3E9545' }}
                                                dropdownStyle={{ width: 180, alignSelf: 'center', height: 160, borderColor: '#D7D7D7', borderWidth: 2, borderRadius: 3, }}
                                                renderRow={function (rowData, rowID, highlighted) {
                                                    return (
                                                        <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                                                            <Text style={[{ fontSize: 16, color: '#D7D7D7', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                                                                {rowData.titleAR}
                                                            </Text>
                                                        </View>
                                                    );
                                                }.bind(this)}
                                            />
                                        </View>
                                        <View></View>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.column, { width: '100%' }]} >
                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.01 }]} >
                                    <Text style={{ fontSize: 14, color: '#707070' }} >
                                        {'رقم الجوال'}
                                    </Text>
                                </View>

                                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.015 }]} >

                                    <View style={[styles.row, styles.inputFields, { width: '35%', justifyContent: 'space-evenly', alignItems: 'center', borderBottomWidth: 1, borderTopEndRadius: 0, borderBottomEndRadius: 0 }]}>
                                        <View style={{ flex: 0, height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                                            <Entypo name="chevron-down" style={{ color: '#000', fontSize: 18 }} />
                                        </View>
                                        <CountryPicker
                                            countryCode={this.state.cca2}
                                            translation={'common'}
                                            withAlphaFilter
                                            withCallingCode
                                            withCallingCodeButton
                                            withFlagButton={false}
                                            onSelect={(country) => this.setState({ code: country.callingCode, cca2: country.cca2 })}
                                        />
                                    </View>

                                    <Item style={[styles.inputFields, { flex: 1, borderTopStartRadius: 0, borderBottomStartRadius: 0, marginLeft: -1, height: height * 0.06, minHeight: 35, maxHeight: 60 }]}>
                                        <Input
                                            placeholder={'ادخل رقم الجوال'}
                                            placeholderTextColor={"#E9E9E9"}
                                            keyboardType="numeric"
                                            style={{ color: '#3E9545' }} textAlign={'center'}
                                            onChangeText={(text) => this.setState({ mobile: text })}
                                        />
                                    </Item>
                                </View>
                            </View>

                            <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                        </View>
                    </View>

                    <View style={[styles.row, styles.shadow, { width, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={() => { this.Register() }} style={[styles.Button, styles.shadow, { backgroundColor: '#8AD032', borderColor: '#3E9545', borderWidth: 4, borderRadius: 12 }]} >
                            <Text style={{ color: '#343434', fontSize: 19, fontWeight: 'bold' }}>
                                {'موافق'}
                            </Text>
                        </TouchableOpacity>
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
export default connect(mapStateToProps, { SaveUser })(Register)

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
        height: height * 0.2,
        resizeMode: 'stretch',
        marginTop: 18
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