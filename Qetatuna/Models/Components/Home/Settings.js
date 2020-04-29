import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, YellowBox, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Overlay } from 'react-native-elements';
import { Input, Item, DatePicker, Picker } from 'native-base'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux' // redux
import { SetLanguage, SaveUser } from './../../Actions' //redux
import axios from 'axios'
axios.defaults.timeout = 10000
YellowBox.ignoreWarnings(['Warning: Can\'t perform a React state update']);
import ImagePicker from 'react-native-image-picker';
import CountryPicker from 'react-native-country-picker-modal'

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            Processing: false,
            fullname: this.props.User.fullname,
            mobile: this.props.User.mobile,
            email: this.props.User.email,
            password: this.props.User.password,
            countryCode: this.props.User.countryCode,
            callingCode: this.props.User.callingCode,
            countryID: this.props.User.countryID,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            imgPath: this.props.User.imgPath ? { uri: this.props.User.imgPath } : require('./../../../Images/user.jpg'),
            overlayHeight1: height - 180,
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    setAppLanguage = () => {
        this.setState({ Processing: true })
        const lang = this.props.Language ? this.props.Language == "AR" ? "EN" : "AR" : "EN"
        setTimeout(() => {
            try {
                AsyncStorage.setItem('Lang', lang).then((value) => {
                    AsyncStorage.getItem('Lang')
                        .then((val) => {
                            this.props.SetLanguage(val)
                            this.setState({ Processing: false })
                            this.props.navigation.navigate('Home');
                        })
                })

            } catch (error) {
                this.setState({ Processing: false })
                alert(error)
            }
        }, 1000)
    };

    emailIsValid(email) {
        if ( this.props.User.isMember ) {
            return true
        } else {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        }
    }

    updateUser(newpass) {
        const usr = {
            _id: this.props.User._id,
            email: this.state.email,
            fullname: this.state.fullname,
            mobile: this.state.mobile,
            password: newpass ? this.state.newPassword : this.state.password,
            countryCode: this.state.countryCode,
            callingCode: this.state.callingCode,
            countryID: this.state.countryID,
            imgPath: this.state.imgPath.uri ? this.state.imgPath.uri : null,
        }
        if (this.emailIsValid(usr.email)) {
            if (usr.fullname.length >= 1) {
                if (usr.mobile.length >= 6) {
                    if (this.props.User.isMember) {
                        this.updateUserMember(usr)
                    } else {
                        this.UpdateUser(usr)
                    }
                } else {
                    alert(this.Language != "EN" ? "اكتب رقم الهاتف " : "You must enter a mobile number")
                }
            } else {
                alert(this.Language != "EN" ? "اكتب الاسم كاملا" : "You must enter a username")
            }
        } else {
            alert(this.Language != "EN" ? "البريد الاكتروني غير صالح" : "Email is not valid")
        }
    }

    ChagePassowrd = () => {
        if (this.state.password !== this.state.currentPassword) {
            alert(this.Language != "EN" ? "كلمه المرور السابقه خاطئه" : "Old password is wrong")
        } else {
            if (this.state.newPassword.length >= 8) {
                if (this.state.newPassword !== this.state.confirmPassword) {
                    alert(this.Language != "EN" ? "تاكيد كلمه المرور غير صحيحه" : "Please confirm passord correctly")
                } else {
                    const newpass = this.state.newPassword
                    this.setState({ isVisible: false })
                    this.updateUser(newpass)
                }
            } else {
                alert(this.Language != "EN" ? "كلمه السر يجب ان تكون ٨ حروف علي الاقل" : "password must be more than 8 letters or numbers")
            }
        }
    }

    updateUserMember = (usr) => {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.put('http://167.172.183.142/api/user/member/' + usr._id, {
                fullname: usr.fullname,
                mobile: usr.mobile,
                email: usr.email,
                countryCode: usr.countryCode,
                callingCode: usr.callingCode,
                countryID: usr.countryID,
                imgPath: usr.imgPath,
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
                    isMember: true
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

    UpdateUser = (usr) => {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.put('http://167.172.183.142/api/user/manager/' + usr._id, {
                fullname: usr.fullname,
                mobile: usr.mobile,
                email: usr.email,
                password: usr.password,
                countryCode: usr.countryCode,
                callingCode: usr.callingCode,
                countryID: usr.countryID,
                imgPath: usr.imgPath,
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
                    imgPath: response.data.imgPath,
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

    pickImageFromPhone() {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            this.setState({ Processing: true })
            console.log('Response = ', response);

            if (response.didCancel) {
                this.setState({ Processing: false })
                console.log('User cancelled image picker');
            } else if (response.error) {
                this.setState({ Processing: false })
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                this.setState({ Processing: false })
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = {
                    uri: (Platform.OS === 'android') ? response.uri : response.uri.replace('file://', ''),
                    fileName: response.fileName
                }
                this.editUserPhoto(source)

                // this.setState({
                //     imgPath: source, renderSelectedImage: true
                // });

            }
        });
    }

    editUserPhoto = (imagePicked) =>
        new Promise((resolve, reject) => {
            try {
                const thisComponent = this
                const data = new FormData();
                data.append('personalImg', { uri: imagePicked.uri, name: "FileName", type: 'image/jpeg' });
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                };
                console.log(data)
                // thisComponent.setState({ Processing: false })
                return axios.post(
                    "http://167.172.183.142/api/user/uploadFile", data, config
                ).then(response => {
                    resolve(response)
                    console.log(response)
                    thisComponent.setState({
                        imgPath: { uri: response.data.toString() },
                    });
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
        });

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "أعدادات" : "Settings"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
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
                width={width - 18 * 2}
                height={this.state.overlayHeight1 + 45}
                borderRadius={34}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View
                    onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        this.setState({ overlayHeight1: height })
                    }}
                    style={[styles.column, { backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }]}
                >


                    <Text onPress={() => this.setState({ isVisible: false })} style={{ color: '#000', fontSize: 22, fontWeight: 'bold', position: 'absolute', left: 10, top: 10 }}>
                        {"×"}
                    </Text>


                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 28 }]}>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                        <Text style={{ color: '#81C32E', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
                            {this.Language != "EN" ? "تعديل كلمه المرور" : "Change Password"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>
                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 4 }]}>
                        <Item style={[styles.inputFields, styles.inputFields2, { marginHorizontal: 0, borderBottomColor: '#E9E9E9' }]}>
                            <Input
                                placeholder={this.Language != "EN" ? 'كلمه المرور السابقه' : "Old Password"}
                                placeholderTextColor={"#343434"}
                                secureTextEntry={true}
                                style={{ color: '#000' }}
                                textAlign={'center'}
                                onChangeText={(text) => this.setState({ currentPassword: text })}
                            />
                        </Item>
                    </View>
                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 4 }]}>
                        <Item style={[styles.inputFields, styles.inputFields2, { marginHorizontal: 0, borderBottomColor: '#E9E9E9' }]}>
                            <Input
                                placeholder={this.Language != "EN" ? 'كلمه المرور الجديده' : "New Password"}
                                placeholderTextColor={"#343434"}
                                secureTextEntry={true}
                                style={{ color: '#000' }}
                                textAlign={'center'}
                                onChangeText={(text) => this.setState({ newPassword: text })}
                            />
                        </Item>
                    </View>
                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 4 }]}>
                        <Item style={[styles.inputFields, styles.inputFields2, { marginHorizontal: 0, borderBottomColor: '#E9E9E9' }]}>
                            <Input
                                placeholder={this.Language != "EN" ? 'تاكيد كلمه المرور الجديده' : "Confirm Password"}
                                placeholderTextColor={"#343434"}
                                secureTextEntry={true}
                                style={{ color: '#000' }}
                                textAlign={'center'}
                                onChangeText={(text) => this.setState({ confirmPassword: text })}
                            />
                        </Item>
                    </View>
                    <View style={[styles.row, { justifyContent: 'center', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.ChagePassowrd()} style={[styles.shadow, styles.button]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "حفظ" : "Save"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    renderSelectedImage() {
        return (
            <Image source={this.state.imgPath} style={{ flex: 1, height: null, width: null }} />
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                {this.renderOverlay()}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />

                <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#8AD032', width: width, height: height * 0.2, paddingHorizontal: 8, marginBottom: 30 }]}>
                    {
                        this.props.User.isMember ?
                            <View></View> :
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ isVisible: true })} style={[styles.shadow, { backgroundColor: '#E5F1D7', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 8, borderWidth: 1, borderColor: '#6DB611', width: (width / 3) - 16, justifyContent: 'center', alignItems: 'center', marginTop: 12 }]}>
                                <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }} >
                                    {this.Language != "EN" ? "كلمه المرور" : "Password"}
                                </Text>
                            </TouchableOpacity>

                    }

                    <View style={[styles.column, { width: (width / 3) - 8, height: '100%', justifyContent: 'space-between', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.setAppLanguage()} activeOpacity={1} style={[styles.shadow, this.Language != "EN" ? styles.rowReverse : styles.row, { backgroundColor: '#E5F1D7', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 8, borderWidth: 1, borderColor: '#6DB611', width: (width / 3) - 16, justifyContent: 'space-evenly', alignItems: 'center', marginTop: 12 }]}>
                            <AntDesign name="earth" style={{ color: '#000', fontSize: 18 }} />
                            <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }} >
                                {this.Language != "EN" ? "English" : "العربيه"}
                            </Text>
                        </TouchableOpacity>
                        <Text numberOfLines={1} style={[{ color: '#FFF', fontSize: 18 }, { textAlign: 'right' }]} >{this.props.User.fullname}</Text>
                        <View></View>
                    </View>

                    <TouchableOpacity onPress={() => this.pickImageFromPhone()} style={[styles.shadow, { width: width * 0.3, height: width * 0.3, borderRadius: width * 0.3 / 2, borderColor: '#000', borderWidth: 1, overflow: 'hidden', position: 'absolute', bottom: -20, left: (width / 2) - (width * 0.3 / 2) }]}>
                        {this.renderSelectedImage()}
                    </TouchableOpacity>

                </View>

                <View style={{ width, flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }} >
                    <View style={[styles.shadow, { height: '100%', width: '90%', backgroundColor: '#FFF' }]} >
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', }} >

                            <View style={[styles.column, { width: '100%', justifyContent: 'space-between', paddingHorizontal: '5%', flex: 1, }]} >

                                <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '95%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'flex-end' }, { alignItems: 'center', flex: 1 }]}>
                                        <Text style={[{ color: '#000', fontSize: 14 }, { textAlign: this.Language != "EN" ? 'right' : 'left' }]}>
                                            {this.Language != "EN" ? "الاسم بالكامل" : 'Full name'}
                                        </Text>
                                    </View>
                                    <View style={[styles.row, { flex: 3, justifyContent: 'center', alignItems: 'center' }]} >
                                        <View style={[styles.shadow, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: '100%', elevation: 3 }]}>
                                            <Item style={[{ width: '100%', height: '100%', borderBottomWidth: 0 }]}>
                                                <Input
                                                    defaultValue={this.state.fullname}
                                                    //placeholder = {""}
                                                    style={{ color: '#000' }}
                                                    textAlign={'center'}
                                                    onChangeText={(text) => this.setState({ fullname: text })}
                                                />
                                            </Item>
                                        </View>
                                    </View>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '95%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'flex-end' }, { alignItems: 'center', flex: 1 }]}>
                                        <Text style={[{ color: '#000', fontSize: 14 }, { textAlign: this.Language != "EN" ? 'right' : 'left' }]}>
                                            {this.Language != "EN" ? "رقم الجوال" : "Mobile"}
                                        </Text>
                                    </View>

                                    <View style={[styles.row, { flex: 3, justifyContent: 'center', alignItems: 'center' }]} >
                                        <View style={[styles.shadow, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, height: '100%', elevation: 3, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 8, overflow: 'hidden' }]}>

                                            <View style={[styles.row, styles.inputFields2, { width: '35%', justifyContent: 'space-evenly', alignItems: 'center', borderBottomWidth: 1, borderTopStartRadius: 12, borderBottomStartRadius: 12, height: '100%' }]}>
                                                <View style={{ flex: 0, height: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Entypo name="chevron-down" style={{ color: '#000', fontSize: 18 }} />
                                                </View>
                                                <CountryPicker
                                                    countryCode={this.state.countryCode}
                                                    translation={'common'}
                                                    withAlphaFilter
                                                    withCallingCodeButton
                                                    withFlagButton={false}
                                                    withCallingCode
                                                    onSelect={(country) => this.setState({ callingCode: country.callingCode, countryCode: country.cca2 })}
                                                />
                                            </View>

                                            <Item style={[{ flex: 1, height: '100%', borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }]}>
                                                <Input
                                                    disabled
                                                    defaultValue={this.state.mobile}
                                                    //placeholder = {""}
                                                    keyboardType="numeric"
                                                    style={{ color: '#000' }}
                                                    textAlign={'center'}
                                                    onChangeText={(text) => this.setState({ mobile: text })}
                                                />
                                            </Item>

                                        </View>
                                    </View>

                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '95%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'flex-end' }, { alignItems: 'center', flex: 1 }]}>
                                        <Text style={[{ color: '#000', fontSize: 14 }, { textAlign: this.Language != "EN" ? 'right' : 'left' }]}>
                                            {this.Language != "EN" ? "البريد الألكترونى" : "Email"}
                                        </Text>
                                    </View>

                                    <View style={[styles.row, { flex: 3, justifyContent: 'center', alignItems: 'center' }]} >
                                        <View style={[styles.shadow, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: '100%', elevation: 3 }]}>
                                            <Item style={[{ width: '100%', height: '100%', borderBottomWidth: 0 }]}>
                                                <Input
                                                    defaultValue={this.state.email}
                                                    //placeholder = {""}
                                                    style={{ color: '#000' }}
                                                    textAlign={'center'}
                                                    onChangeText={(text) => this.setState({ email: text })}
                                                />
                                            </Item>
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }]} >
                                    <TouchableOpacity onPress={() => this.updateUser()} activeOpacity={1} style={[styles.shadow, { backgroundColor: '#E5F1D7', borderRadius: 12, borderWidth: 2, borderColor: '#6DB611', width: (width / 3), justifyContent: 'center', alignItems: 'center', height: height * 0.06, minHeight: 35, maxHeight: 60, elevation: 5 }]}>
                                        <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }} >
                                            {this.Language != "EN" ? "حفظ" : "Save"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                            </View>



                        </ScrollView>

                    </View>
                </View>

                <View style={{ width, height: 80, backgroundColor: '#81C32E', borderTopLeftRadius: 38, borderTopRightRadius: 38, marginTop: 12 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Subscribe')} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "الأشتراك" : "Subscribe"}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </SafeAreaView>
        );
    }
}

//redux
const mapStateToProps = state => {
    return {
        Language: state.LanguageReducer.Language,
        User: state.AuthReducer.User,
    }
}
// redux
export default connect(mapStateToProps, { SetLanguage, SaveUser })(Settings)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
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
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    inputFields: {
        borderBottomColor: '#FFF',
        borderRadius: 12,
        backgroundColor: '#FFF',
        marginHorizontal: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
    },
    inputFields2: {
        borderColor: '#E9E9E9',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 8
    },
    button: {
        backgroundColor: '#E5F1D7',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 8,
        borderRadius: 12,
        marginTop: 46,
        borderColor: '#6DB611',
        borderWidth: 2,
    }
})