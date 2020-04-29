import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import { DragContainer, Draggable, DropZone } from "react-native-drag-drop-and-swap";
import Entypo from 'react-native-vector-icons/Entypo'
import { Input, Item, Textarea, Picker } from 'native-base'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Overlay } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import CountryPicker from 'react-native-country-picker-modal'
import { PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts';

class GamayaHomeManager extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.onHover = this.onHover.bind(this);
        this.addUser = this.addUser.bind(this);
        this.state = {
            group: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').group : '',
            aljameiaType: this.props.navigation.getParam('Gamaya').aljameiaType,
            aljameiaAmount: this.props.navigation.getParam('Gamaya').aljameiaAmount,
            membersNum: this.props.navigation.getParam('Gamaya').membersNum,
            startDate: this.props.navigation.getParam('Gamaya').startDate,
            alarm: this.props.navigation.getParam('Gamaya').alarm,
            createBy: this.props.navigation.getParam('Gamaya').createBy,
            members: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').members : [],
            membersEdit: [],
            Processing: false,

            hoverData: {},
            dropData: {},
            isVisible: false,
            list: this.props.navigation.getParam('Gamaya').members,

            ChangedUserIndex: null,
            overlayHeight1: height - 180,
            code: '966',
            cca2: 'SA',
            fullname: '',
            mobile: '',
            // list: [
            //     { id: 1, name: 'A' },
            //     { id: 2, name: 'B' },
            //     { id: 4, name: 'C' },
            //     { id: 5, name: 'D' },
            // ]
            // newArr.push({
            //     fullname: "*****",
            //     callingCode: '966',
            //     countryCode: 'SA',
            //     mobile: "000000"
            // });
            renderContacts: false,
            contacts: []
        };
    }

    save() {
        const thisComponent = this
        const { group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members, membersEdit } = this.state
        membersEdit.forEach((item, index) => {
            item.order = index
        })
        console.log(membersEdit)
        thisComponent.setState({ Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/addAljameia', {
                group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members: membersEdit
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.props.navigation.navigate('GamayaMain')
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

    Language = this.props.Language ? this.props.Language : "AR"

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

    onDrop(data) {
        let membersEdit = this.state.membersEdit.map((item) => {
            if (item.mobile == data.mobile) {
                return this.state.hoverData;
            }
            if (item.mobile == this.state.hoverData.mobile) {
                return data;
            }
            return item;
        });
        membersEdit = this.resortDate(membersEdit)
        console.log(membersEdit)
        this.setState({ membersEdit });
        //console.log(members)
    }

    onHover(hoverData) {
        this.setState({ hoverData });
    }

    UNSAFE_componentWillMount() {
        this.fillArray()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    fillArray() {
        const newArr = [...this.state.members]
        const numberOfSA = parseInt(this.state.membersNum) - newArr.length
        for (var i = 1; i <= numberOfSA; i++) {
            newArr.push({
                fullname: "0",
                callingCode: '966',
                countryCode: 'SA',
                mobile: "A" + i
            });
        }
        console.log(newArr)
        this.setState({ membersEdit: newArr })

    }

    SearchAndGetObjectFromArrayMobile(arr, mobile) {
        return arr.find(obj => obj.mobile == mobile)
    }

    addMember() {

        var newArr = this.state.membersEdit
        const { fullname, mobile } = this.state

        const u = this.SearchAndGetObjectFromArrayMobile(newArr, mobile)
        console.log(u)
        if (u) {
            alert(this.Language != "EN" ? "هذا العضو موجود بالفعل" : "This member is allready exists")
        } else {

        if (fullname.length >= 1) {
            if (mobile.length >= 6) {
                this.setState({ membersEdit: [], })
                newArr[this.state.ChangedUserIndex] = {
                    fullname: this.state.fullname,
                    callingCode: this.state.code,
                    countryCode: this.state.cca2,
                    mobile: this.state.mobile
                }
                console.log("membersafteredit1")
                newArr = this.resortDate(newArr)
                console.log(newArr)
                this.setState({ membersEdit: newArr, isVisible: false })
                console.log("membersafteredit")
                console.log(this.state.membersEdit)
            } else {
                alert(this.Language != "EN" ? "اكتب رقم الهاتف " : "Enter mobile number")
            }
        } else {
            alert(this.Language != "EN" ? "اكتب الاسم كاملا" : "Enter full name")
        }
        console.log(this.state.members)

    }

    }

    addUser(item) {
        // this.setState({
        //     memberData: {
        //         fullname: item.fullname,
        //         callingCode: item.callingCode,
        //         countryCode: item.countryCode,
        //         mobile: item.mobile
        //     }
        // })
        const index = this.state.membersEdit.indexOf(item)
        console.log(index)
        this.setState({ isVisible: true, ChangedUserIndex: index })
        //alert(/*this.state.memberData.mobile*/ a)
        //this.state.membersEdited.find(item => item.id == this.props.item.mobile)
    }

    handleBackButtonClick = () => {
        const { group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members } = this.state
        const Gamaya = { group, aljameiaType, aljameiaAmount, membersNum, startDate, alarm, createBy, members }
        this.props.navigation.navigate('GamayaMembers', { Gamaya: Gamaya });
        return true;
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
                overlayStyle={{ overflow: 'hidden', justifyContent: 'center' }}
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View
                    onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        this.setState({ overlayHeight1: height })
                    }}
                    style={[styles.column, { backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 40 }]}
                >

                    <Text onPress={() => this.setState({ isVisible: false })} style={{ color: '#000', fontSize: 22, fontWeight: 'bold', position: 'absolute', left: 10, top: 0 }}>
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
                                <View style={[styles.inputFields, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, height: 50, overflow: 'hidden', elevation: 3 }]}>
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
                                <View style={[styles.inputFields, styles.row, { flex: 1, backgroundColor: '#FFF', height: 50, overflow: 'hidden', elevation: 3, alignItems: 'center', justifyContent: 'space-between' }]}>
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
                        <TouchableOpacity onPress={() => this.addMember()} style={[styles.shadow, { width: '60%', backgroundColor: "#FFF", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#E1D115", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {"اضف"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Overlay>
        )
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.state.group}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

    renderMenu() {
        if (this.state.membersEdit.length < 5) {
            return this.renderLessThan5Items()
        } else if (this.state.membersEdit.length == 5) {
            return this.render5Items()
        } else if (this.state.membersEdit.length == 6) {
            return this.render6Items()
        } else if (this.state.membersEdit.length == 7) {
            return this.render7Items()
        } else if (this.state.membersEdit.length == 8) {
            return this.render8Items()
        } else if (this.state.membersEdit.length == 9) {
            return this.render9Items()
        } else if (this.state.membersEdit.length == 10) {
            return this.render10Items()
        } else {
            return this.render12Items()
        }
    }

    renderLessThan5Items() {
        return (
            <DragContainer>
                <View style={{ justifyContent: 'flex-start' }} >
                    {/* ------------------------------------ Grid Start ------------------------------------ */}
                    <View
                        style={{
                            width: width,
                            height: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {/* ------------------ First Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {
                                    this.state.membersEdit.length > 1 ?  // second 1
                                        (
                                            <Draggy
                                                //key={index.toString()}
                                                addUser={this.addUser}
                                                item={this.state.membersEdit[1]}
                                                onHover={this.onHover}
                                                onDrop={this.onDrop}
                                            //index={index}
                                            />
                                        )
                                        :
                                        (
                                            <View />
                                        )
                                }
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                            </View>
                        </View>

                        {/* ------------------ Second Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {
                                    this.state.membersEdit.length > 0 ? // first 0
                                        (
                                            <Draggy
                                                //key={index.toString()}
                                                addUser={this.addUser}
                                                item={this.state.membersEdit[0]}
                                                onHover={this.onHover}
                                                onDrop={this.onDrop}
                                            //index={index}
                                            />
                                        )
                                        :
                                        (
                                            <View />
                                        )
                                }
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {/* center circle */}
                                <View
                                    style={[styles.shadow, {
                                        width: width / 3,
                                        height: width / 3,
                                        borderRadius: width / 1.5,
                                        backgroundColor: 'white',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10
                                    }]}
                                >
                                    <Text numberOfLines={1} style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                                    <Text numberOfLines={1} style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {
                                    this.state.membersEdit.length > 2 ? // third 2
                                        (
                                            <Draggy
                                                //key={index.toString()}
                                                addUser={this.addUser}
                                                item={this.state.membersEdit[2]}
                                                onHover={this.onHover}
                                                onDrop={this.onDrop}
                                            //index={index}
                                            />
                                        )
                                        :
                                        (
                                            <View />
                                        )
                                }
                            </View>
                        </View>

                        {/* ------------------ Third Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {
                                    this.state.membersEdit.length > 3 ? // forth 3
                                        (
                                            <Draggy
                                                //key={index.toString()}
                                                addUser={this.addUser}
                                                item={this.state.membersEdit[3]}
                                                onHover={this.onHover}
                                                onDrop={this.onDrop}
                                            //index={index}
                                            />
                                        )
                                        :
                                        (
                                            <View />
                                        )
                                }
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                            </View>
                        </View>
                    </View>

                    {/* ------------------------------------ Grid End ------------------------------------ */}
                </View>
            </DragContainer>
        )
    }

    render5Items() {
        return (
            <DragContainer>
                {/* ------------------------------------ Grid Start ------------------------------------ */}
                <View
                    style={{
                        width: width,
                        height: width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {/* ------------------ First Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                width: width / 3,
                                height: '100%',
                            }}>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* first 0 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                item={this.state.membersEdit[0]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                        </View>
                    </View>

                    {/* ------------------ Second Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* fifth 4 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                item={this.state.membersEdit[4]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>
                            {/* center circle */}
                            <View
                                style={[styles.shadow, {
                                    width: width / 3,
                                    height: width / 3,
                                    borderRadius: width / 1.5,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10
                                }]}
                            >
                                <Text numberOfLines={1} style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                                <Text numberOfLines={1} style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second 1 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                item={this.state.membersEdit[1]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>
                    </View>

                    {/* ------------------ Third Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* forth 3 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginRight: - width / 12 }}
                                item={this.state.membersEdit[3]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* third 2 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginLeft: - width / 12 }}
                                item={this.state.membersEdit[2]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </DragContainer>
        )
    }

    render6Items() {
        return (
            <DragContainer>
                {/* ------------------------------------ Grid Start ------------------------------------ */}
                <View
                    style={{
                        width: width,
                        height: width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {/* ------------------ First Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* sixth 5 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginBottom: - width / 12 }}
                                item={this.state.membersEdit[5]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* first 0 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                item={this.state.membersEdit[0]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second 1 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginBottom: - width / 12 }}
                                item={this.state.membersEdit[1]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>
                    </View>

                    {/* ------------------ Second Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>
                            {/* center circle */}
                            <View
                                style={[styles.shadow, {
                                    width: width / 3,
                                    height: width / 3,
                                    borderRadius: width / 1.5,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10
                                }]}
                            >
                                <Text numberOfLines={1} style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                                <Text numberOfLines={1} style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                        </View>
                    </View>

                    {/* ------------------ Third Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* fifth 4 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginTop: - width / 12 }}
                                item={this.state.membersEdit[4]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* forth 3 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                item={this.state.membersEdit[3]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* third 2 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginTop: - width / 12 }}
                                item={this.state.membersEdit[2]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </DragContainer>
        )
    }

    render7Items() {
        return (
            <DragContainer>
                {/* ------------------------------------ Grid Start ------------------------------------ */}
                <View
                    style={{
                        width: width,
                        height: width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {/* ------------------ First Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* Seventh 6 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginBottom: - width / 12 }}
                                item={this.state.membersEdit[6]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* first 0 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                item={this.state.membersEdit[0]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />


                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second 1 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginBottom: - width / 12 }}
                                item={this.state.membersEdit[1]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>
                    </View>

                    {/* ------------------ Second Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>
                            {/* center circle */}
                            <View
                                style={[styles.shadow, {
                                    width: width / 3,
                                    height: width / 3,
                                    borderRadius: width / 1.5,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10
                                }]}
                            >
                                <Text numberOfLines={1} style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                                <Text numberOfLines={1} style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                        </View>
                    </View>

                    {/* ------------------ Third Row ----------------- */}

                    <View
                        style={{
                            flexDirection: 'row',
                            width: width,
                            height: width / 3,
                        }}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* sixth 5 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginTop: - width / 12 }}
                                item={this.state.membersEdit[5]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* fifth 4 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginBottom: - width / 15, marginLeft: - width / 15, }}
                                item={this.state.membersEdit[4]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />


                            {/* forth 3 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginBottom: - width / 15, marginRight: - width / 15, }}
                                item={this.state.membersEdit[3]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />


                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* third 2 */}
                            <Draggy
                                //key={index.toString()}
                                addUser={this.addUser}
                                styles={{ marginTop: - width / 12 }}
                                item={this.state.membersEdit[2]}
                                onHover={this.onHover}
                                onDrop={this.onDrop}
                            //index={index}
                            />

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </DragContainer>
        )
    }

    render8Items() {

        return (
            <DragContainer>
                <View style={{ justifyContent: 'flex-start' }} >
                    {/* ------------------------------------ Grid Start ------------------------------------ */}
                    <View
                        style={{
                            width: width,
                            height: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {/* ------------------ First Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* eighth 7 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[7]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* first 0 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[0]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* second 1 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[1]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>
                        </View>

                        {/* ------------------ Second Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* seventh 6 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[6]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {/* center circle */}
                                <View
                                    style={[styles.shadow, {
                                        width: width / 3,
                                        height: width / 3,
                                        borderRadius: width / 1.5,
                                        backgroundColor: 'white',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10
                                    }]}
                                >
                                    <Text numberOfLines={1} style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                                    <Text numberOfLines={1} style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* third 2 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[2]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>
                        </View>

                        {/* ------------------ Third Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* sixth 5 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[5]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* fifth 4 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[4]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* forth 3 */}
                                <Draggy
                                    //key={index.toString()}
                                    addUser={this.addUser}
                                    item={this.state.membersEdit[3]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                //index={index}
                                />

                            </View>
                        </View>
                    </View>

                    {/* ------------------------------------ Grid End ------------------------------------ */}
                </View>
            </DragContainer>
        )
    }

    render9Items() {

        return (
            <DragContainer>
                <View style={{ justifyContent: 'flex-start' }} >
                    {/* ------------------------------------ Grid Start ------------------------------------ */}
                    <View
                        style={{
                            width: width,
                            height: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {/* ------------------ First Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* nineth */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[8]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,

                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* first 0 */}
                                <Draggy
                                    //key={index.toString()}
                                    item={this.state.membersEdit[0]}
                                    onHover={this.onHover}
                                    addUser={this.addUser}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginBottom: width / 16, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* second 1 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[1]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 22 }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>
                        </View>

                        {/* ------------------ Second Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* eighth */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[7]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 22, marginTop: width / 32, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                                {/* seventh */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[6]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 12, marginBottom: - width / 32, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {/* center circle */}
                                <View
                                    style={[styles.shadow, {
                                        width: width / 3,
                                        height: width / 3,
                                        borderRadius: width / 1.5,
                                        backgroundColor: 'white',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10
                                    }]}
                                >
                                    <Text numberOfLines={1} style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                                    <Text numberOfLines={1} style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* third 2 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[2]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 22, marginTop: width / 32, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                                {/* forth 3 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[3]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 12, marginBottom: - width / 32, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>
                        </View>

                        {/* ------------------ Third Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* sixth 5 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[5]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 8, marginTop: width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* fifth 4 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[4]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 8, marginTop: width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>
                        </View>
                    </View>

                    {/* ------------------------------------ Grid End ------------------------------------ */}
                </View>
            </DragContainer>
        )
    }

    render10Items() {

        return (
            <DragContainer>
                <View style={{ justifyContent: 'flex-start' }} >
                    {/* ------------------------------------ Grid Start ------------------------------------ */}
                    <View
                        style={{
                            width: width,
                            height: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {/* ------------------ First Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* tenth */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[9]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* first 0 */}
                                <Draggy
                                    //key={index.toString()}
                                    item={this.state.membersEdit[0]}
                                    onHover={this.onHover}
                                    addUser={this.addUser}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginBottom: width / 16, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* second 1 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[1]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>
                        </View>

                        {/* ------------------ Second Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* ninth */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[8]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                                {/* eighth */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[7]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>
                                {/* center circle */}
                                <View
                                    style={[styles.shadow, {
                                        width: width / 3,
                                        height: width / 3,
                                        borderRadius: width / 1.5,
                                        backgroundColor: 'white',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10
                                    }]}
                                >
                                    <Text numberOfLines={1} style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                                    <Text numberOfLines={1} style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* third 2 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[2]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                                {/* forth 3 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[3]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 22 }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>
                        </View>

                        {/* ------------------ Third Row ----------------- */}

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width,
                                height: width / 3,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* seventh 6 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[6]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginRight: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* sixth 5 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[5]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginTop: width / 16, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    width: width / 3,
                                    height: '100%',
                                }}>

                                {/* fifth 4 */}
                                <Draggy
                                    addUser={this.addUser}
                                    //key={index.toString()}
                                    item={this.state.membersEdit[4]}
                                    onHover={this.onHover}
                                    onDrop={this.onDrop}
                                    styles={{ margin: 0, marginLeft: - width / 22, }}
                                    DraggyInnerStyle={{
                                        width: width / 8,
                                        height: width / 8,
                                        borderRadius: width / 4,
                                    }}
                                    DraggyInnerDragOverStyle={{
                                        width: width / 8 + 10,
                                        height: width / 8 + 10,
                                        borderRadius: width / 4 + 10,
                                    }}
                                //index={index}
                                />

                            </View>
                        </View>
                    </View>

                    {/* ------------------------------------ Grid End ------------------------------------ */}
                </View>
            </DragContainer>
        )
    }

    render12Items() {
        return (
            <View style={[styles.column, { width, alignItems: 'center' }]} >

                <View style={[styles.column, { width: '90%', backgroundColor: '#FFF', borderRadius: 18, paddingVertical: 8, marginTop: 16, justifyContent: 'space-evenly' }]} >

                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }]}>
                        {/* <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{"شهر يناير"}</Text> */}
                        <View style={[styles.column, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 12 }]}>
                            <Text style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.state.aljameiaAmount}</Text>
                            <Text style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                        </View>
                        {/* <View style={{ alignItems: 'center' }} >
                            <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#3E9545', justifyContent: 'center', alignItems: 'center' }]} >
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{"0"}</Text>
                            </View>
                            <Text style={{ color: '#000' }} >{this.Language != "EN" ? "لم يدفع" : "Not Paid"}</Text>
                        </View> */}
                    </View>

                </View>

                <DragContainer
                    style={[styles.row, {
                        width: width,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        marginTop: 10,
                    }]}>
                    {
                        this.state.membersEdit.map((item, index) => {
                            return (
                                <View key={index.toString()} style={{ marginVertical: 8 }} >
                                    <Draggy
                                        addUser={this.addUser}

                                        //key={index.toString()}
                                        item={item}
                                        onHover={this.onHover}
                                        onDrop={this.onDrop}
                                    //index={index}
                                    />
                                </View>
                            )
                        })
                    }
                </DragContainer>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <View style={{ flex: 1, width, backgroundColor: '#E1D115' }} >

                    <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                    {this.renderHeader()}
                    {this.renderOverlay()}
                    {this.contactsOverlay()}
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 70, paddingTop: 12 }} >
                        {
                            this.renderMenu()
                        }
                    </ScrollView>

                    <View style={[styles.column, { justifyContent: 'center', width, height: 80, backgroundColor: '#FFF', borderTopLeftRadius: 38, borderTopRightRadius: 38 }]} >

                        {
                            true ?
                                <View style={[styles.row, { flex: 0.5, justifyContent: 'center', alignItems: 'center' }]} >
                                    <TouchableOpacity onPress={() => this.save()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#E1D115', paddingVertical: 8, borderRadius: 16, borderColor: '#CBBE21', borderWidth: 1, paddingHorizontal: 12 }]}>
                                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: "bold" }} >{this.Language != "EN" ? "حفظ الاعضاء" : "Save Members"}</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                            // <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 0.5, justifyContent: 'space-evenly', alignItems: 'center' }]} >
                            //     <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#E1D115', paddingVertical: 8, borderRadius: 16, borderColor: '#CBBE21', borderWidth: 1, paddingHorizontal: 12 }]}>
                            //         <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "تم دفع قيمة الجمعية" : "Paid"}</Text>
                            //     </TouchableOpacity>
                            //     <TouchableOpacity onPress={() => this.props.navigation.navigate('GamayaEdit')} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#E1D115', paddingVertical: 8, borderRadius: 16, borderColor: '#CBBE21', borderWidth: 1, paddingHorizontal: 12 }]}>
                            //         <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "تعديل الجمعية" : "Edit Gamaya"}</Text>
                            //     </TouchableOpacity>
                            // </View>
                        }

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
    }
}
// redux
export default connect(mapStateToProps, {})(GamayaHomeManager)

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
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    }, inputFields: {
        borderColor: '#E9E9E9',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 8
    },
})

// Main component to render
class DraggyInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    shadow = {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    }

    Monthes = [
        { id: 0, MonAr: "يناير", MonEn: "Jan" },
        { id: 1, MonAr: "فبراير", MonEn: "Feb" },
        { id: 2, MonAr: "مارس", MonEn: "Mar" },
        { id: 3, MonAr: "أبريل", MonEn: "Apr" },
        { id: 4, MonAr: "مايو", MonEn: "May" },
        { id: 5, MonAr: "يونيو", MonEn: "Jun" },
        { id: 6, MonAr: "يوليو", MonEn: "Jul" },
        { id: 7, MonAr: "أغسطس", MonEn: "Aug" },
        { id: 8, MonAr: "سبتمبر", MonEn: "Seb" },
        { id: 9, MonAr: "أكتوبر", MonEn: "Oct" },
        { id: 10, MonAr: "نوفمبر", MonEn: "Nov" },
        { id: 11, MonAr: "ديسمبر", MonEn: "Dec" },
    ]

    render() {
        if (this.props.dragOver && !this.props.ghost) {
            // drag over
            return (
                <View
                    style={[this.shadow, {
                        width: width / 6 + 10,
                        height: width / 6 + 10,
                        borderRadius: width / 3 + 10,
                        backgroundColor: "#CCC",
                        alignItems: "center",
                        justifyContent: "center",
                    }, this.props.DraggyInnerDragOverStyle]}
                >
                    {
                        this.props.item.fullname != "0" ?
                            <View style={[{ width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }, this.props.DraggyInnerStyle]} >
                                <Image source={require('../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                            </View>
                            :
                            <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                    }
                    <Text style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                        {
                            this.props.item.fullname != "0" ?
                                new Date(this.props.item.turnDate).getDate() + " " + this.Monthes[new Date(this.props.item.turnDate).getMonth()].MonAr
                                :
                                ""
                        }
                    </Text>
                    <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >{this.props.item.fullname != "0" ? this.props.item.fullname : ""}</Text>
                </View>
            );
        } else {
            // ghost or item original 
            return (
                <View
                    style={[
                        this.shadow,
                        {
                            width: width / 6,
                            height: width / 6,
                            borderRadius: width / 3,
                            backgroundColor: this.props.ghost ? "#E6E6E6" : "#FFF",
                            alignItems: "center",
                            justifyContent: "center"
                        }, this.props.DraggyInnerStyle
                    ]}
                >
                    {
                        this.props.item.fullname != "0" ?
                            <View style={[{ width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }, this.props.DraggyInnerStyle]} >
                                <Image source={require('../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                            </View>
                            :
                            <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                    }

                    <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                        {
                            this.props.item.fullname != "0" ?
                                new Date(this.props.item.turnDate).getDate() + " " + this.Monthes[new Date(this.props.item.turnDate).getMonth()].MonAr
                                :
                                ""
                        }
                    </Text>
                    <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >{this.props.item.fullname != "0" ? this.props.item.fullname : ""}</Text>
                </View>
            );
        }
    }
}

//Drag helper
class Draggy extends React.Component {
    render() {
        return (
            <Draggable
                onPress={
                    () => {
                        this.props.addUser(this.props.item) // this.state.membersEdited.find(item => item.id == this.props.item.mobile
                    }
                }
                data={this.props.item}
                style={[{ margin: 7.5 }, this.props.styles]}
            >
                <DropZone
                    onDrop={e => this.props.onDrop(e)}
                    onEnter={e =>
                        this.props.onHover(this.props.item)
                    }
                >
                    <DraggyInner
                        item={this.props.item}
                        DraggyInnerStyle={this.props.DraggyInnerStyle}
                        DraggyInnerDragOverStyle={this.props.DraggyInnerDragOverStyle}
                    //index={this.props.index}
                    />
                </DropZone>
            </Draggable>
        );
    }
}