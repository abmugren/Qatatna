import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Input, Item } from 'native-base'
import { Overlay } from 'react-native-elements';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import CountryPicker from 'react-native-country-picker-modal'
import { PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts';
import Spinner from 'react-native-loading-spinner-overlay';

class QattaAddMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alarm: this.props.navigation.getParam('Qatta') ? this.props.navigation.getParam('Qatta').alarm : "0",
            group: this.props.navigation.getParam('Qatta') ? this.props.navigation.getParam('Qatta').group : '',
            totalValue: this.props.navigation.getParam('Qatta') ? this.props.navigation.getParam('Qatta').totalValue : '',
            perMember: this.props.navigation.getParam('Qatta') ? this.props.navigation.getParam('Qatta').perMember : '',
            worth: this.props.navigation.getParam('Qatta') ? this.props.navigation.getParam('Qatta').worth : new Date(), //this.props.User.birthday,
            Members: this.props.navigation.getParam('Qatta') ?
                this.props.navigation.getParam('Qatta').Members
                :
                [{
                    fullname: this.props.User.fullname,
                    callingCode: this.props.User.callingCode,
                    countryCode: this.props.User.countryCode,
                    mobile: this.props.User.mobile
                }],
            isVisible: false,
            code: '966',
            cca2: 'SA',
            fullname: '',
            mobile: '',
            overlayHeight1: height - 180,
            renderContacts: false,
            contacts: [],
            Processing: false
        };
    }

    //members= [{fullname, callingCode, countryCode, mobile,email}]

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.save();
        return true;
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "اضافه القطه" : "Add Qatta"}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }


    SearchAndGetObjectFromArrayMobile(arr, mobile) {
        return arr.find(obj => obj.mobile == mobile)
    }

    addMember() {
        var newArr = this.state.Members
        const { fullname, mobile } = this.state

        const u = this.SearchAndGetObjectFromArrayMobile(newArr, mobile)
        console.log(u)
        if (u) {
            alert(this.Language != "EN" ? "هذا العضو موجود بالفعل" : "This member is allready exists")
        } else {

            if (fullname.length >= 1) {
                if (mobile.length >= 6) {
                    newArr.push({
                        fullname: this.state.fullname,
                        callingCode: this.state.code,
                        countryCode: this.state.cca2,
                        mobile: this.state.mobile
                    })
                    this.setState({
                        Members: newArr,
                        fullname: '',
                        mobile: '',
                        code: '966',
                        cca2: 'SA',
                        isVisible: false
                    })
                } else {
                    alert(this.Language != "EN" ? "اكتب رقم الهاتف " : "Enter mobile number")
                }
            } else {
                alert(this.Language != "EN" ? "اكتب الاسم كاملا" : "Enter full name")
            }

        }

        console.log(this.state.Members)
    }

    deleteMember(selectedValue) {
        Alert.alert(
            this.props.Language != "EN" ? "مسح العضو" : "Delete Member",
            this.props.Language != "EN" ? "هل تريد حقا مسح العضو" : "You are about to delete member",
            [
                {
                    text: this.props.Language != "EN" ? "الغاء" : 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: this.props.Language != "EN" ? "نعم" : 'OK', onPress: () => {
                        var newArr = this.state.Members
                        // const selectedValue = this.state.selectedValue
                        newArr.splice(selectedValue, 1);
                        this.setState({ Members: newArr, isVisible2: false })
                    }
                },
            ],
            { cancelable: false },
        );
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

                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 8 }]}>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                        <Text style={{ color: '#017ED4', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
                            {this.Language != "EN" ? "اضافه عضو" : "Add members"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View></View>


                    <View style={[styles.column, { width: "100%", marginVertical: 8 }]} >

                        <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center' }]} >
                            <Text style={{ color: '#707070' }} >{this.Language != "EN" ? "اسم العضو" : "Member name"}</Text>
                        </View>

                        <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4, marginBottom: 12, justifyContent: 'center' }]} >
                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <View style={[styles.inputFields, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: 50, overflow: 'hidden' }]}>
                                    <Item style={[{ width: '100%', height: '100%', borderBottomWidth: 0 }]}>
                                        <View style={{ height: 24, width: 24, marginHorizontal: 12 }} ></View>
                                        <Input
                                            defaultValue={this.state.fullname}
                                            placeholder={this.Language != "EN" ? 'الاسم كاملا' : 'Fullname'}
                                            style={{ color: '#000' }}
                                            textAlign={'center'}
                                            onChangeText={(text) => this.setState({ fullname: text })}
                                        />
                                        <FontAwesome name="user" style={{ color: "#E9E9E9", fontSize: 24, marginHorizontal: 12 }} />
                                    </Item>
                                </View>
                            </View>
                        </View>

                    </View>

                    <View style={[styles.column, { width: "100%", marginVertical: 8 }]} >

                        <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center' }]} >
                            <Text style={{ color: '#707070' }} >{this.Language != "EN" ? "رقم الجوال" : "Mobile"}</Text>
                        </View>

                        <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center' }]} >
                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <View style={[styles.inputFields, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: 50, overflow: 'hidden', justifyContent: 'space-between' }]}>
                                    <View style={[styles.row, { width: '35%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center', borderRightColor: '#d7d7d7', borderRightWidth: 1, borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}>
                                        <View style={{ flex: 0, height: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                                            <Entypo name="chevron-down" style={{ color: '#000', fontSize: 18 }} />
                                        </View>
                                        <CountryPicker
                                            countryCode={this.state.cca2}
                                            translation={'common'}
                                            withAlphaFilter
                                            withCallingCodeButton
                                            withFlagButton={false}
                                            withCallingCode
                                            onSelect={(country) => this.setState({ code: country.callingCode, cca2: country.cca2 })}
                                        />
                                    </View>
                                    <Item style={[{ width: '60%', height: '100%', borderBottomWidth: 0 }]}>
                                        <Input
                                            // disabled
                                            defaultValue={this.state.mobile}
                                            placeholder={this.Language != "EN" ? 'رقم الجوال' : 'Mobile'}
                                            style={{ color: '#000' }}
                                            keyboardType="numeric"
                                            textAlign={'center'}
                                            onChangeText={(text) => this.setState({ mobile: text })}
                                        />
                                        <TouchableOpacity style={{ marginHorizontal: 12 }} onPress={() => this.getContactsAfterPermission()} >
                                            <Ionicons name="ios-call" style={{ color: "#E9E9E9", fontSize: 24 }} />
                                        </TouchableOpacity>
                                    </Item>
                                </View>
                            </View>
                        </View>

                    </View>

                    <TouchableOpacity onPress={() => this.getContactsAfterPermission()} style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center', alignItems: 'center' }]} >
                        <AntDesign name="contacts" style={{ color: '#000', fontSize: 24, marginHorizontal: 8 }} />
                        <Text style={{ color: '#000' }} >{this.Language != "EN" ? "آختر من القائمه" : "Choose from Contacts"}</Text>
                    </TouchableOpacity>

                    <View style={[styles.row, { justifyContent: 'center', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.addMember()} style={[styles.shadow, { width: '60%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#017ED4", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "اضف" : "Add"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    // this.setState({ isVisible: false ,renderContacts: true })
    getContactsAfterPermission() {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts',
                    message: ' This app would like to see your contacts'
                }
            ).then(() => {
                this.getList();
            })
        } else if (Platform.OS === 'ios') {
            this.getList();
        }
    }

    getList = () => {
        this.setState({ Processing: true })
        Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
                console.log("cannot access");
            } else {
                this.setState({ contacts, Processing: false });
                this.setState({ isVisible: false, renderContacts: true })
                console.log(contacts);
            }
        })
    }

    contactsOverlay = () => {
        return (
            <Overlay
                isVisible={this.state.renderContacts}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width={width * 0.9}
                height={height * 0.8}
                // borderRadius={34}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ renderContacts: false })}
            >
                <View
                    style={[styles.column, { backgroundColor: '#F9F9F9', justifyContent: 'center', width: '100%', height: '100%', borderBottomColor: '#CCC', borderBottomWidth: 1 }]}
                >
                    {/* <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E7E7E7' }} >
                        <Text style={{ fontWeight: 'bold', color: '#000' }} >{this.Language != "EN" ? "الاسماء" : "Contacts"}</Text>
                    </View> */}
                    <View style={{ flex: 1, width: '100%', backgroundColor: '#FFF' }} >
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                            {
                                this.state.contacts.map((item, index) => {
                                    return (
                                        <View key={index.toString()} style={[styles.row, { width: '100%', paddingVertical: 8, borderBottomColor: '#CCC', borderBottomWidth: 1 }]} >
                                            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#E9E9E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 }} >
                                                <FontAwesome name="user" style={{ color: "#FFF", fontSize: 24 }} />
                                            </View>
                                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ mobile: item.phoneNumbers[0].number, renderContacts: false, isVisible: true })} style={[styles.column, { flex: 1 }]} >
                                                <Text style={{ fontWeight: 'bold', }}>
                                                    {`${item.givenName} `} {item.familyName}
                                                </Text>
                                                {
                                                    item.phoneNumbers.map((phone, index) => (
                                                        <Text key={index.toString()} style={{}}>{phone.number}</Text>
                                                    ))
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </Overlay>
        )
    }

    save() {
        if (false) {
            alert(this.Language != "EN" ? 'من فضلك أدخل أسم المجموعة ' : "Please Enter group name")
        } else {
            const { alarm, group, totalValue, perMember, worth, Members } = this.state
            const Qatta = { alarm, group, totalValue, perMember, worth, Members }
            this.props.navigation.navigate('QattaAdd', { Qatta: Qatta });
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >

                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                {this.renderOverlay()}
                {this.contactsOverlay()}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style={[styles.column, { flex: 1, width }]} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 16 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#414141', fontWeight: 'bold' }} >
                            {this.Language != "EN" ? 'أضافة مجموعة' : "Add Members"}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '100%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', padding: 10 }]} >
                                    <Text style={{ color: "#707070", marginHorizontal: 8, fontSize: 14 }} >{this.Language != "EN" ? "أسم المجموعة" : "Group Name"}</Text>
                                    <Item style={[{ flex: 1, backgroundColor: '#FFF', height: 45, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8, borderRadius: 12, borderColor: '#E9E9E9', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }]}>
                                        <Input
                                            defaultValue={this.state.group.toString()}
                                            placeholder={this.Language != "EN" ? 'أدخل أسم المجموعة' : "Enter group name"}
                                            placeholderTextColor={"#E9E9E9"}
                                            style={{ color: '#0C546A' }} textAlign={'center'}
                                            onChangeText={(text) => this.setState({ group: text })}
                                        />
                                    </Item>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { height: 80, width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', padding: 10 }]} >
                                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', borderColor: "#017ED4", borderWidth: 3, overflow: 'hidden' }} >
                                        <Image source={this.props.User.imgPath ? { uri: this.props.User.imgPath } : require('./../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                    </View>
                                    <View style={[styles.column, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }, { flex: 1, justifyContent: 'space-evenly', marginHorizontal: 10 }]} >
                                        <Text style={{ color: '#017ED4', fontSize: 18, fontWeight: 'bold' }} >{this.Language != "EN" ? "مدير المجموعة" : "Manager"}</Text>
                                        <Text style={{ color: '#707070', fontSize: 16 }} >{this.props.User.fullname}</Text>
                                    </View>
                                    <View>

                                    </View>
                                </View>

                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', paddingHorizontal: 10, marginVertical: 4 }]} >
                                    <Text style={{ color: '#707070', fontSize: 14, fontWeight: 'bold' }} >{this.state.Members.length} {this.Language != "EN" ? " أعضاء " : " Members "}</Text>
                                </View>

                                <View style={[styles.rowReverse, { flex: 1, marginVertical: 4, flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'flex-start' }]}>
                                    {
                                        this.state.Members.map((item, index) => {
                                            if (item.mobile != this.props.User.mobile) {
                                                return (
                                                    <View key={index.toString()} style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: "100%", backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, marginBottom: 4 }]} >
                                                        <TouchableOpacity onPress={() => this.deleteMember(index)} >
                                                            <FontAwesome name={'trash-o'} style={{ fontSize: 16, color: '#0069B1', marginHorizontal: 8 }} />
                                                        </TouchableOpacity>
                                                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, backgroundColor: '#FFF', height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#E9E9E9', paddingVertical: 4 }]} >
                                                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#E9E9E9' } : { borderLeftWidth: 1, borderLeftColor: '#E9E9E9' }, { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 6 }]} >
                                                                <Feather name={'phone-call'} style={{ color: '#E9E9E9', fontSize: 26 }} />
                                                                <Text style={{ fontSize: 12, flex: 1, marginHorizontal: 4 }} >‫‪{"+" + item.callingCode + "-" + item.mobile}</Text>
                                                            </View>
                                                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 6 }]} >
                                                                <FontAwesome name={"user"} style={{ color: '#E9E9E9', fontSize: 26 }} />
                                                                <Text style={{ fontSize: 12, flex: 1, marginHorizontal: 4 }} >‫‪{item.fullname}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        })
                                    }

                                </View>

                            </ScrollView>
                        </View>
                    </View>

                </View>

                <View style={{ width, height: 80 }} >
                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 18 }]} >
                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { justifyContent: 'space-evenly', alignItems: 'center' }]} >
                            <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#017ED4', justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 24 }} >+</Text>
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8 }} >{this.Language != "EN" ? "اضافه عضو" : "Add member"} </Text>
                        </View>
                        <View></View>
                    </View>
                </View>

                <View style={{ width, height: 80, backgroundColor: '#017ED4', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >
                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.save()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "أضف المجموعة" : "Add members"}</Text>
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
        User: state.AuthReducer.User,
        Language: state.LanguageReducer.Language,
    }
}
// redux
export default connect(mapStateToProps, {})(QattaAddMembers)

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
    inputFields: {
        borderColor: '#E9E9E9',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 8
    },
})

/*

import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')

export default class OdwayaHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('OdwayaMain');
        return true;
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6', paddingHorizontal: 8 }]} >
                <TouchableOpacity onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{"الأعضاء"}</Text>
                <View></View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                <View style={[styles.column, { flex: 1, width }]} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#81C32E', fontWeight: 'bold' }} >
                            {'شلة البحر'}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 16 }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '90%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >

                            </ScrollView>
                        </View>
                    </View>

                </View>

                <View style={{ width, height: 65 }} >

                </View>

            </SafeAreaView>
        );
    }

}

*/