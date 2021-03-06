import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import CountryPicker from 'react-native-country-picker-modal'
import Spinner from 'react-native-loading-spinner-overlay';
import { Input, Item, Textarea, Picker } from 'native-base'
import { Overlay } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
axios.defaults.timeout = 10000
import { DragContainer, Draggable, DropZone } from "react-native-drag-drop-and-swap";
import ModalDropdown from 'react-native-modal-dropdown'
import { PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts';

class DorayaMembersAdd extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.onHover = this.onHover.bind(this);
        this.state = {
            group: this.props.navigation.getParam('Doraya') ? this.props.navigation.getParam('Doraya').group : '',
            dorayaRepeatType: this.props.navigation.getParam('Doraya') ? this.props.navigation.getParam('Doraya').dorayaRepeatType : 1,
            repeatsPerWeek: this.props.navigation.getParam('Doraya') ? this.props.navigation.getParam('Doraya').repeatsPerWeek : 1,
            date: this.props.navigation.getParam('Doraya') ? this.props.navigation.getParam('Doraya').date : new Date(),
            dorayaTime: this.props.navigation.getParam('Doraya') ? this.props.navigation.getParam('Doraya').dorayaTime : -1,
            dorayaType: this.props.navigation.getParam('Doraya') ? this.props.navigation.getParam('Doraya').dorayaType : 1,
            members: this.props.navigation.getParam('Doraya') ? this.props.navigation.getParam('Doraya').members : [],
            code: '966',
            cca2: 'SA',
            fullname: '',
            mobile: '',
            selectedValue: 0,

            hoverData: {},
            dropData: {},

            isVisible: false,
            isVisible2: false,

            Processing: false,
            overlayHeight1: height - 180,
            overlayHeight2: height - 180,
            renderContacts: false,
            contacts: []
        };
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const { group, dorayaRepeatType, repeatsPerWeek, date, dorayaTime, dorayaType, members } = this.state
        const Doraya = { group, dorayaRepeatType, repeatsPerWeek, date, dorayaTime, dorayaType, members }
        this.props.navigation.navigate('DorayaAdd', { Doraya: Doraya });
        return true;
    }

    Language = this.props.Language ? this.props.Language : "AR"

    onDrop(data) {
        let members = this.state.members.map((item) => {
            if (item.mobile == data.mobile) {
                return this.state.hoverData;
            }
            if (item.mobile == this.state.hoverData.mobile) {
                return data;
            }
            return item;
        });

        members = this.resortDate(members)

        this.setState({ members });
        //console.log(members)
    }

    onHover(hoverData) {
        this.setState({ hoverData });
    }

    nextDayInWeek(x) {
        var now = new Date();
        now.setDate(now.getDate() + (x + (7 - now.getDay())) % 7);
        return now;
    }

    resortDate(members) {
        if (this.state.dorayaRepeatType == 1) {
            members.forEach((item, index) => {
                var nextDay = new Date()
                nextDay.setDate(nextDay.getDate() + index + 1)
                item.turnDate = nextDay
            })
            return members
        } else if (this.state.dorayaRepeatType == 2) {
            members.forEach((item, index) => {
                var nextDay = this.nextDayInWeek(this.state.repeatsPerWeek)
                // var nextDay = new Date()
                nextDay.setDate(nextDay.getDate() + (7 * index))
                item.turnDate = nextDay
            })
            return members
        } else {

            members.forEach((item, index) => {
                if (index == 0) {
                    item.turnDate = this.state.date
                } else {
                    delete item.turnDate;
                }
            })
            return members
            // members[0].turnDate = date
        }
    }

    addMember() {
        var newArr = this.state.members
        const { fullname, mobile } = this.state
        if (fullname.length >= 1) {
            if (mobile.length >= 6) {
                newArr.push({
                    fullname: this.state.fullname,
                    callingCode: this.state.code,
                    countryCode: this.state.cca2,
                    mobile: this.state.mobile
                })
                newArr = this.resortDate(newArr)
                this.setState({
                    members: newArr,
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

        console.log(this.state.members)
    }

    deleteMember() {
        var newArr = this.state.members
        const selectedValue = this.state.selectedValue
        if (this.state.members[selectedValue].mobile == this.props.User.mobile) {
            alert(this.Language != "EN" ? "عفوا لا يمكنك مسح مدير المجموعه" : "sorry you can't delete group manager")
        } else {
            newArr.splice(selectedValue, 1);
            newArr = this.resortDate(newArr)
            this.setState({ members: newArr, selectedValue: 0, isVisible2: false })
        }
    }

    saveEdits() {

        if (this.state.members.length < 1) {
            alert(this.Language != "EN" ? "من فضلك اضف اعضاء" : "Please add members")
        } else {

            const thisComponent = this
            const { group, dorayaRepeatType, repeatsPerWeek, date, dorayaTime, dorayaType, members } = this.state
            members.forEach((item, index) => {
                item.order = index
            })
            console.log(members)
            thisComponent.setState({ Processing: true })
            try {
                axios.post('http://167.172.183.142/api/user/addDoraya', {
                    group, dorayaRepeatType, repeatsPerWeek, date, dorayaTime, dorayaType, members, createBy: thisComponent.props.User._id,
                }).then(function (response) {
                    console.log(response)
                    thisComponent.setState({ Processing: false })
                    thisComponent.props.navigation.navigate('DorayaMain')
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
    }

    SearchAndGetObjectFromArray(arr, index) {
        return arr[index]
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "الأعضاء" : "Members"}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

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
                    style={[styles.column, { backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 40 }]}
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
                        <Text style={{ color: '#00C4CA', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
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

                    <View style={[styles.column, { width: "100%", marginVertical: 8 }]} >

                        <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center' }]} >
                            <Text style={{ color: '#707070' }} >{this.Language != "EN" ? "اسم العضو" : "Member name"}</Text>
                        </View>

                        <View style={[styles.row, { width: '100%', paddingHorizontal: 8, marginVertical: 4, marginBottom: 12, justifyContent: 'center' }]} >
                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <View style={[styles.inputFields, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, height: 50, overflow: 'hidden' }]}>
                                    <Item style={[{ width: '100%', height: '100%', borderBottomColor: '#E9E9E9' }]}>
                                        <View style={{ height: 24, width: 24, marginHorizontal: 12 }} ></View>
                                        <Input
                                            //defaultValue={"سارة المهدى"}
                                            placeholder={this.Language != "EN" ? 'الاسم كاملا' : 'Full name'}
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

                        <View style={[styles.row, { width: '100%', paddingHorizontal: 8, marginVertical: 4, justifyContent: 'center' }]} >
                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <View style={[styles.inputFields, styles.row, { flex: 1, backgroundColor: '#FFF', height: 50, overflow: 'hidden', alignItems: 'center', justifyContent: 'space-between' }]}>
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
                                    <Item style={[{ width: '60%', height: 48, borderBottomWidth: 0 }]}>
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


                    <View style={[styles.row, { justifyContent: 'space-evenly', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.addMember()} style={[styles.shadow, { width: '60%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#00C4CA", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "اضف" : "Add"}
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
                width={width - 18 * 2}
                height={this.state.overlayHeight2 + 45}
                borderRadius={34}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisible2: false })}
            >
                <View
                    onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        this.setState({ overlayHeight2: height })
                    }}
                    style={[styles.column, { backgroundColor: '#FFF', justifyContent: 'space-evenly', paddingHorizontal: 8, paddingVertical: 40 }]}
                >

                    <Text onPress={() => this.setState({ isVisible2: false })} style={{ color: '#000', fontSize: 22, fontWeight: 'bold', position: 'absolute', left: 10, top: 10 }}>
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
                        <Text style={{ color: '#00C4CA', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
                            {this.Language != "EN" ? "حذف عضو" : "Delete member"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View style={[styles.column, { width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 38 }]}>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 12 }]} >
                            <Text style={{ fontSize: 14, color: '#707070' }} >
                                {this.Language != "EN" ? 'اختر اسم العضو' : "Choose member"}
                            </Text>
                        </View>

                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >

                            <View style={[styles.row, styles.inputFields, { flex: 1, justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, marginTop: 8, paddingHorizontal: 12, backgroundColor: '#FFF', height: 40 }]}>
                                <AntDesign name="down" size={14} style={{ color: '#000' }} />
                                <View style={[styles.row, { flex: 1, justifyContent: 'center', height: 38 }]} >
                                    {/* <Picker
                                        selectedValue={this.state.selectedValue}
                                        // selectedValue={"0"}
                                        mode="dropdown"
                                        style={[Platform.OS === 'android' ? { marginRight: -75 } : {}, { backgroundColor: '#FFF', flex: 1, height: 38 }]}
                                        onValueChange={(item, Index) => this.setState({ selectedValue: item })}
                                    >
                                        {
                                            this.state.members.map((item, index) => {
                                                return (
                                                    <Picker.Item key={index.toString()} label={item.fullname} value={index} />
                                                )
                                            })
                                        }
                                    </Picker> */}
                                    <ModalDropdown
                                        // Data => Array
                                        options={this.state.members}
                                        // Default Value => Before Selection
                                        defaultValue={
                                            this.state.members[this.state.selectedValue] ?
                                                this.SearchAndGetObjectFromArray(this.state.members, this.state.selectedValue).fullname
                                                :
                                                ""
                                        }
                                        // Selection Process
                                        onSelect={(index, value) => { this.setState({ selectedValue: index }) }}
                                        // Value After Selection
                                        renderButtonText={(rowData) => (
                                            rowData.fullname
                                        )}
                                        // Styling
                                        style={{ backgroundColor: '#FFF', flex: 1, height: '100%', justifyContent: 'center' }} // abl ma t5tar
                                        textStyle={{ textAlign: 'center', fontSize: 16, color: '#000' }}
                                        dropdownStyle={{ width: 180, alignSelf: 'center', height: 160, borderColor: '#D7D7D7', borderWidth: 2, borderRadius: 3, }}
                                        renderRow={function (rowData, rowID, highlighted) {
                                            return (
                                                <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                                                    <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                                                        {rowData.fullname}
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

                    <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'space-evenly', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.setState({ isVisible2: false })} style={[styles.shadow, { width: '40%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#00C4CA", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "الغاء" : "Cancel"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.deleteMember()} style={[styles.shadow, { width: '40%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#00C4CA", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "حذف العضو" : "Delete"}
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
                {this.renderHeader()}
                {this.renderOverlay()}
                {this.renderOverlay2()}
                {this.contactsOverlay()}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style={[styles.column, { flex: 1, width }]} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 26 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }} >
                            {this.Language != "EN" ? 'قائمه الادوار' : "Turn list"}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 16, marginTop: 12 }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '100%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 26 }} >
                                <DragContainer
                                    style={[styles.column, {

                                    }]}>

                                    {
                                        this.state.members.map((item, index) => {
                                            return (
                                                <View key={index.toString()} >
                                                    <Draggy
                                                        //key={index.toString()}
                                                        item={item}
                                                        onHover={this.onHover}
                                                        onDrop={this.onDrop}
                                                        index={index + 1}
                                                    />
                                                </View>
                                            )
                                        })
                                    }

                                </DragContainer>
                            </ScrollView>
                        </View>
                    </View>

                </View>

                <View style={{ width, height: 80 }} >
                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }]} >
                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { justifyContent: 'space-evenly', alignItems: 'center', width: '45%' }]} >
                            <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#00C4CA', justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 24 }} >+</Text>
                            </TouchableOpacity>
                            <Text >{this.Language != "EN" ? "اضافه عضو" : "Add member"} </Text>
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ isVisible2: true })} style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: "45%", backgroundColor: '#DBEDFA', height: 40, justifyContent: 'space-evenly', paddingVertical: 8, borderRadius: 12, borderColor: '#00C4CA', borderWidth: 3, paddingHorizontal: 12 }]}>
                            <FontAwesome name={'trash-o'} style={{ fontSize: 16, color: '#00C4CA' }} />
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "حذف عضو" : "Delete member"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ width, height: 80, backgroundColor: '#00C4CA', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.saveEdits()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#00A5AA', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "أحفظ القائمة" : "Save members"}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </SafeAreaView>
        );
    }

}

class DraggyInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        if (this.props.dragOver && !this.props.ghost) {
            // drag over
            return (
                <View style={[styles.rowReverse, { width: '100%', backgroundColor: 'transparent', alignItems: 'center', marginBottom: 12, marginTop: -5, paddingHorizontal: 18, justifyContent: 'center' }]}>
                    <View style={[styles.rowReverse, { width: '100%', height: 50, alignItems: 'center' }]} >
                        <View style={[this.props.index == 1 ? { backgroundColor: '#DBF4FA' } : { backgroundColor: '#FFF' }, { width: 40, height: 50, borderRadius: 8, borderWidth: 1, borderColor: "#E9E9E9", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ fontWeight: 'bold', color: '#0C546A' }} >{(this.props.index).toString()}</Text>
                        </View>

                        <View style={[styles.rowReverse, this.props.index == 1 ? { backgroundColor: '#DBF4FA' } : { backgroundColor: '#FFF' }, { height: 50, flex: 2, borderWidth: 1, borderColor: '#E9E9E9', marginHorizontal: 8, borderRadius: 8, alignItems: 'center' }]} >
                            <View style={{ height: 30, width: 30, backgroundColor: '#CCC', borderRadius: 15, marginHorizontal: 8, overflow: 'hidden' }} >
                                <Image source={require('./../../../../../Images/user.jpg')} style={{ width: null, height: null, flex: 1, resizeMode: 'stretch' }} />
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0C546A' }} >{this.props.item.fullname}</Text>
                        </View>

                        <View style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ fontSize: 12, color: '#0C546A' }} >
                                {
                                    this.props.item.turnDate != undefined || this.props.item.turnDate != null ?
                                        this.props.item.turnDate.getDate()
                                        + '-' +
                                        parseInt(this.props.item.turnDate.getMonth() + 1)
                                        + '-' +
                                        this.props.item.turnDate.getFullYear()
                                        :
                                        "--"
                                }
                            </Text>
                        </View>

                    </View>
                </View>
            );
        } else {
            // ghost or item original 
            return (
                <View style={[styles.rowReverse, { width: '100%', backgroundColor: 'transparent', alignItems: 'center', marginBottom: 12, paddingHorizontal: 18, justifyContent: 'center' }]}>
                    <View style={[styles.rowReverse, { width: '100%', height: 40, alignItems: 'center' }]} >
                        <View style={[this.props.index == 1 ? { backgroundColor: '#DBF4FA' } : { backgroundColor: '#FFF' }, { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: "#E9E9E9", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ fontWeight: 'bold', color: '#0C546A' }} >{(this.props.index).toString()}</Text>
                        </View>

                        <View style={[styles.rowReverse, this.props.index == 1 ? { backgroundColor: '#DBF4FA' } : { backgroundColor: '#FFF' }, { height: 40, flex: 2, borderWidth: 1, borderColor: '#E9E9E9', marginHorizontal: 8, borderRadius: 8, alignItems: 'center' }]} >
                            <View style={{ height: 30, width: 30, backgroundColor: '#CCC', borderRadius: 15, marginHorizontal: 8, overflow: 'hidden' }} >
                                <Image source={require('./../../../../../Images/user.jpg')} style={{ width: null, height: null, flex: 1, resizeMode: 'stretch' }} />
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0C546A' }} >{this.props.item.fullname}</Text>
                        </View>

                        <View style={{ flex: 1, height: 40, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ fontSize: 12, color: '#0C546A' }} >
                                {/* {"12/11/2020"} */}
                                {
                                    this.props.item.turnDate != undefined || this.props.item.turnDate != null ?
                                        this.props.item.turnDate.getDate()
                                        + '-' +
                                        parseInt(this.props.item.turnDate.getMonth() + 1)
                                        + '-' +
                                        this.props.item.turnDate.getFullYear()
                                        :
                                        "--"
                                }
                            </Text>
                        </View>

                    </View>
                </View>
            );
        }
    }
}

//Drag helper
class Draggy extends React.Component {
    render() {
        return (
            <Draggable data={this.props.item} style={[this.props.styles]}>
                <DropZone
                    onDrop={e => this.props.onDrop(e)}
                    onEnter={e =>
                        this.props.onHover(this.props.item)
                    }
                >
                    <DraggyInner
                        item={this.props.item}
                        index={this.props.index}
                    />
                </DropZone>
            </Draggable>
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
    inputFields: {
        borderColor: '#E9E9E9',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 8
    },
})

//redux
const mapStateToProps = state => {
    return {
        Language: state.LanguageReducer.Language,
        User: state.AuthReducer.User,
    }
}
// redux
export default connect(mapStateToProps, {})(DorayaMembersAdd)

/*


var CurrentDate = new Date("Sun Jan 26 2020 14:11:05 GMT+0200 (Eastern European Standard Time)")

console.log(
  "First :: \n" +
  CurrentDate
)

console.log (
  "First :: \n" +
    CurrentDate.getDate()
    + '-' +
    parseInt( CurrentDate.getMonth() + 1 )
    + '-' +
    CurrentDate.getFullYear()
)

var NewDate = new Date(CurrentDate)
NewDate.setDate(NewDate.getDate() + 6 )

console.log("\n\n")

console.log(
  "Second :: \n" +
  NewDate
)

console.log (
  "Second :: \n" +
    NewDate.getDate()
    + '-' +
    parseInt( NewDate.getMonth() + 1 )
    + '-' +
    NewDate.getFullYear()
)

console.log("\n\n")

console.log(
  "First :: \n" +
  CurrentDate
)

console.log (
  "First :: \n" +
    CurrentDate.getDate()
    + '-' +
    parseInt( CurrentDate.getMonth() + 1 )
    + '-' +
    CurrentDate.getFullYear()
)

console.log("\n\n")

function nextDay(x){
    var now = new Date();
    now.setDate(now.getDate() + (x+(7-now.getDay())) % 7);
    return now;
}

console.log(
  nextDay(4).toUTCString()
)

console.log("\n\n")
console.log("\n\n")
console.log("\n\n")

var currDate = new Date()
console.log( currDate.toUTCString() )

var nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 7 )
console.log( nextWeek.toUTCString() )

var nextThurs = nextDay( 4 )
console.log( nextThurs.toUTCString() )



*/