import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { Input, Item, Picker } from 'native-base'
import { Overlay } from 'react-native-elements';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import CountryPicker from 'react-native-country-picker-modal'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown'
import { PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts';

class GamayaEditMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya')._id : '',
            group: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').group : '',
            aljameiaType: this.props.navigation.getParam('Gamaya').aljameiaType,
            aljameiaAmount: this.props.navigation.getParam('Gamaya').aljameiaAmount,
            membersNum: this.props.navigation.getParam('Gamaya').membersNum,
            startDate: this.props.navigation.getParam('Gamaya').startDate,
            alarm: this.props.navigation.getParam('Gamaya').alarm,
            createBy: this.props.navigation.getParam('Gamaya').createBy,
            members: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').members : [],
            membersEdited: [],
            // "1" => weekly "2" => "Monthly"
            isVisible: false,
            isVisible2: false,
            code: '966',
            cca2: 'SA',
            fullname: '',
            mobile: '',
            Processing: false,
            selectedValue: 0,
            overlayHeight1: height - 180,
            overlayHeight2: height - 180,
            renderContacts: false,
            contacts: []
        };
    }

    //members= [{fullname, callingCode, countryCode, mobile,email}]

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        this.getMembers()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const { _id, group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members } = this.state
        //const Gamaya = { group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members }
        this.props.navigation.navigate('GamayaEdit', {
            Gamaya: {
                data: {
                    _id, group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy
                },
                membersNumber: members
            }
        });
        return true;
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
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "تعديل الجميعية" : "Gamaya Edit"}</Text>
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

    deleteMember() {
        var newArr = this.state.membersEdited
        const selectedValue = this.state.selectedValue
        newArr.splice(selectedValue, 1);
        this.setState({ membersEdited: newArr, selectedValue: 0, isVisible2: false })
    }

    SearchAndGetObjectFromArrayMobile(arr, mobile) {
        return arr.find(obj => obj.mobile == mobile)
    }

    editMember() {
        /*
        const { group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members } = this.state
        const Gamaya = { group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members }
        this.props.navigation.navigate('GamayaHomeManager', { Gamaya: Gamaya });
        */

        var newArr = this.state.membersEdited
        const { fullname, mobile } = this.state

        const u = this.SearchAndGetObjectFromArrayMobile(newArr, mobile)
        console.log(u)
        if (u) {
            alert(this.Language != "EN" ? "هذا العضو موجود بالفعل" : "This member is allready exists")
        } else {

            if (parseInt(this.state.membersNum) > this.state.membersEdited.length) {
                if (fullname.length >= 1) {
                    if (mobile.length >= 6) {
                        newArr.push({
                            fullname: this.state.fullname,
                            callingCode: this.state.code,
                            countryCode: this.state.cca2,
                            mobile: this.state.mobile
                        })
                        this.setState({
                            membersEdited: newArr,
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
            } else {
                alert(this.Language != "EN" ? "العدد مكتمل" : "Members list is full")
            }

        }
        console.log(this.state.members)

    }

    getMembers() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        const Gamaya = thisComponent.props.navigation.getParam('Gamaya')
        try {
            axios.get('http://167.172.183.142/api/user/getMembersByAljameia', {
                params: {
                    aljameiaID: Gamaya._id
                }
            }).then(function (response) {
                var newArr = thisComponent.state.membersEdited
                response.data.map((item, index) => {
                    if (item.membersID.fullname != "0") {
                        newArr.push(item.membersID)

                    }
                })
                thisComponent.setState({ membersEdited: newArr, Processing: false })
                console.log(response.data)
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
                        <Text style={{ color: '#E1D115', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
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

                    <TouchableOpacity onPress={() => this.getContactsAfterPermission()} style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4, justifyContent: 'center', alignItems: 'center' }]} >
                        <AntDesign name="contacts" style={{ color: '#000', fontSize: 24, marginHorizontal: 8 }} />
                        <Text style={{ color: '#000' }} >{this.Language != "EN" ? "آختر من القائمه" : "Choose from Contacts"}</Text>
                    </TouchableOpacity>


                    <View style={[styles.row, { justifyContent: 'space-evenly', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.editMember()} style={[styles.shadow, { width: '60%', backgroundColor: "#FFF", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#E1D115", justifyContent: 'center', alignItems: 'center' }]} >
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
                    style={[styles.column, { backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 40 }]}
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
                        <Text style={{ color: '#E1D115', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
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
                                        style={[Platform.OS === 'android' ? { marginRight: -75 } : {}, { backgroundColor: '#FFF', flex: 1, height:38 }]}
                                        onValueChange={(item, Index) => this.setState({ selectedValue: item })}
                                    >
                                        {
                                            this.state.Members.map((item, index) => {
                                                return (
                                                    <Picker.Item key={index.toString()} label={item.fullname} value={index} />
                                                )
                                            })
                                        }
                                    </Picker> */}
                                    <ModalDropdown
                                        // Data => Array
                                        options={this.state.membersEdited}
                                        // Default Value => Before Selection
                                        defaultValue={
                                            this.state.membersEdited[this.state.selectedValue] ?
                                                this.SearchAndGetObjectFromArray(this.state.membersEdited, this.state.selectedValue).fullname
                                                :
                                                ""
                                        }
                                        // Selection Process
                                        onSelect={(index, value) => { this.setState({ selectedValue: index }) }}
                                        // Value After Selection
                                        renderButtonText={(rowData) => (
                                            rowData.membersID ? rowData.membersID.fullname : rowData.fullname
                                        )}
                                        // Styling
                                        style={{ backgroundColor: '#FFF', flex: 1, height: '100%', justifyContent: 'center' }} // abl ma t5tar
                                        textStyle={{ textAlign: 'center', fontSize: 16, color: '#0C546A' }}
                                        dropdownStyle={{ width: 180, alignSelf: 'center', height: 160, borderColor: '#D7D7D7', borderWidth: 2, borderRadius: 3, }}
                                        renderRow={function (rowData, rowID, highlighted) {
                                            if (rowData.membersID && rowData.membersID.fullname == "0") {
                                                return (
                                                    <View></View>
                                                )
                                            } else {
                                                return (
                                                    rowData.mobile == this.props.User.mobile ? <View></View> :
                                                        <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                                                            <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                                                                {rowData.membersID ? rowData.membersID.fullname : rowData.fullname}
                                                            </Text>
                                                        </View>
                                                )
                                            }
                                        }.bind(this)}
                                    />
                                </View>
                                <View></View>
                            </View>
                        </View>
                    </View>


                    <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'space-evenly', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.setState({ isVisible2: false })} style={[styles.shadow, { width: '40%', backgroundColor: "#FFF", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#E1D115", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "الغاء" : "Cancel"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.deleteMember()} style={[styles.shadow, { width: '40%', backgroundColor: "#FFF", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#E1D115", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "حذف العضو" : "Delete"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Overlay>
        )
    }

    resortDate(members) {
        if (this.state.aljameiaType == "1") {
            members.forEach((item, index) => {
                var nextDay = new Date(this.state.startDate)
                nextDay.setDate(nextDay.getDate() + index * 7)
                item.turnDate = nextDay
            })
            return members
        } else {
            members.forEach((item, index) => {
                var nextDay = new Date(this.state.startDate)
                nextDay.setDate(nextDay.getDate() + index * 30)
                item.turnDate = nextDay
            })
            return members
            // members[0].turnDate = date
        }
    }

    save() {
        const { _id, group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members, membersEdited } = this.state
        var newArr = this.state.membersEdited
        newArr = this.resortDate(newArr)
        const Gamaya = { _id, group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members, membersEdited }
        //this.props.navigation.navigate('GamayaHomeManager', { Gamaya: Gamaya });
        if (group == "") {
            alert(this.Language != "EN" ? 'من فضلك أدخل أسم المجموعة ' : "Please Enter group name")
        } else {
            console.log(Gamaya.membersEdited)
            this.props.navigation.navigate('GamayaHomeManagerEdit', { Gamaya: Gamaya });
            // this.setState({ isVisible3: true })
            // const { _id, alarm, group, totalValue, perMember, worth, Members } = this.state
            // const Qatta = { _id, alarm, group, totalValue, perMember, worth, Members }
            // this.props.navigation.navigate('QattaEdit', { Qatta: Qatta });
        }
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
                {this.renderHeader()}
                {this.renderOverlay()}
                {this.renderOverlay2()}
                {this.contactsOverlay()}
                <View style={[styles.column, { flex: 1, width }]} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 16 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#414141', fontWeight: 'bold' }} >
                            {this.state.group.toString()}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '100%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', padding: 10 }]} >
                                    <Text style={{ color: "#707070", marginHorizontal: 8, fontSize: 14 }} >{this.Language != "EN" ? "أسم المجموعة" : "Group Name"}</Text>
                                    <Item style={[{ flex: 1, backgroundColor: '#FFF', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderColor: '#E9E9E9', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }]}>
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
                                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', borderColor: "#E1D115", borderWidth: 3, overflow: 'hidden' }} >
                                        <Image source={this.props.User.imgPath ? { uri: this.props.User.imgPath } : require('./../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                    </View>
                                    <View style={[styles.column, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }, { flex: 1, justifyContent: 'space-evenly', marginHorizontal: 10 }]} >
                                        <Text style={{ color: '#E1D115', fontSize: 18, fontWeight: 'bold' }} >{this.Language != "EN" ? "مدير المجموعة" : "Manager"}</Text>
                                        <Text style={{ color: '#707070', fontSize: 16 }} >{this.props.User.fullname}</Text>
                                    </View>
                                    <View style={[styles.column, { height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 }]} >

                                    </View>
                                </View>

                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', paddingHorizontal: 10, marginVertical: 4 }]} >
                                    <Text style={{ color: '#707070', fontSize: 14, fontWeight: 'bold' }} >{this.state.membersEdited.length} {this.Language != "EN" ? " أعضاء " : " Members "}</Text>
                                </View>

                                <View style={[styles.rowReverse, { flex: 1, marginVertical: 4, flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'flex-start' }]}>

                                    {
                                        this.state.membersEdited.map((item, index) => {
                                            return (
                                                item.fullname == "0" || item.mobile == this.props.User.mobile ? null :
                                                    <View key={index.toString()} style={[styles.column, { width: "30%", aspectRatio: 0.7, backgroundColor: '#FFF', justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                                        <View style={{ width: width * 0.2, height: width * 0.2, backgroundColor: '#FFF', borderRadius: width * 0.1, borderWidth: 1, borderColor: "#000", overflow: 'hidden' }} >
                                                            <Image source={require('./../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                                        </View>
                                                        <View style={[styles.column, { alignItems: 'center' }]} >
                                                            <Text style={{ color: '#707070', fontWeight: 'bold' }} >{item.fullname}</Text>
                                                        </View>
                                                    </View>


                                            )
                                        })
                                    }



                                </View>

                            </ScrollView>
                        </View>
                    </View>

                </View>

                <View style={{ width, height: 80 }} >
                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18 }]} >
                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { justifyContent: 'flex-start', alignItems: 'center', width: '45%' }]} >
                            <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E1D115', justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 24 }} >+</Text>
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8 }} >{this.Language != "EN" ? "اضافه عضو" : "Add member"} </Text>
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ isVisible2: true })} style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: "45%", backgroundColor: '#FFF', height: 40, justifyContent: 'space-evenly', paddingVertical: 8, borderRadius: 12, borderColor: '#E1D115', borderWidth: 3, paddingHorizontal: 12 }]}>
                            <FontAwesome name={'trash-o'} style={{ fontSize: 16, color: '#E1D115' }} />
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "حذف عضو" : "Delete member"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <View style={{ width, height: 80 }} >
                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 18 }]} >
                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { justifyContent: 'space-evenly', alignItems: 'center' }]} >
                            <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E1D115', justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 24 }} >+</Text>
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8 }} >{this.Language != "EN" ? "اضافه عضو" : "Add member"} </Text>
                        </View>
                        <View></View>
                    </View>
                </View> */}

                <View style={{ width, height: 80, backgroundColor: '#E1D115', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >
                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.save()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#CBBE21', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: "bold" }} >{this.Language != "EN" ? "حفظ التعديلات" : "Save Edits"}</Text>
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
export default connect(mapStateToProps, {})(GamayaEditMembers)

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