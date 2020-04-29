import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
import { Overlay } from 'react-native-elements';
import { Input, Item } from 'native-base'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

class QattaHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            isVisibleMember: false,
            Members: [],
            Processing: false,
            overlayHeight1: height - 180,
            isPaid: this.props.navigation.getParam('Qatta').isPaid,
            member: null
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        this.getManagerName()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('QattaMain');
        return true;
    }

    componentDidMount() {
        this.getMembers()
    }

    getManagerName() {
        const thisComponent = this
        // thisComponent.setState({ Processing: true })
        const id = thisComponent.props.navigation.getParam('Qatta').createBy
        try {
            axios.get("http://167.172.183.142/api/user/getmanagerByID", {
                params: {
                    id
                }
            }).then(function (response) {
                thisComponent.setState({ ManagerName: response.data.fullname, ManagerPic: response.data.imgPath })
                console.log(response.data)
            }).catch(function (error) {
                console.log(error)
                // thisComponent.setState({ Processing: false })
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
            // thisComponent.setState({ Processing: false })
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

    getMembers(Paid) {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        const Qatta = thisComponent.props.navigation.getParam('Qatta')
        try {
            axios.get('http://167.172.183.142/api/user/getMembersByQatta', {
                params: {
                    qattaID: Qatta._id
                }
            }).then(function (response) {
                thisComponent.setState({ Members: response.data, Processing: false })
                setTimeout(() => {
                    Paid ?
                        thisComponent.props.User.isMember ?
                            alert(thisComponent.Language != "EN" ? "شكرا سوف يتم اشعار المدير بذلك" : "Thanks Manger will be notified")
                            : {}
                        : {}
                }, 100);
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

    memberPaid() {
        const thisComponent = this
        // const qattaMemberID = this.props.navigation.getParam("qattaMemberID")
        this.setState({ Processing: true, isVisible: false })
        try {
            axios.post('http://167.172.183.142/api/user/memberQattaPaid/', {
                mobile: thisComponent.props.User.mobile, qattaID: thisComponent.props.navigation.getParam('Qatta')._id
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.getMembers(true)
                //thisComponent.props.navigation.navigate('QattaMain')
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

    managerPaid() {
        this.memberPaid()
        // const thisComponent = this
        // const qattaId = this.props.navigation.getParam("Qatta")._id
        // this.setState({ Processing: true, isVisible: false })
        // try {
        //     axios.put('http://167.172.183.142/api/user/managerQatta/' + qattaId, {

        //     }).then(function (response) {
        //         console.log(response)
        //         thisComponent.setState({ Processing: false, isPaid: "2" })
        //         thisComponent.getMembers()
        //         //thisComponent.props.navigation.navigate('QattaMain')
        //     }).catch(function (error) {
        //         // console.log(error)
        //         thisComponent.setState({ Processing: false })
        //         if (error.response && error.response.data && error.response.data.message) {
        //             setTimeout(() => {
        //                 alert('Oops! ' + error.response.data.message);
        //             }, 100);
        //         } else {
        //             setTimeout(() => {
        //                 alert('Oops! ' + "Network error");
        //             }, 100);
        //         }
        //     })
        // } catch (error) {
        //     // console.log(error)
        //     thisComponent.setState({ Processing: false })
        //     setTimeout(() => {
        //         alert('Oops! ' + "Something went wrong");
        //     }, 100);
        // }
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
                            {this.Language != "EN" ? "دفع المبلغ" : "Pay the amount"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View style={[styles.row, { width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 38 }]}>
                        <Text>{this.Language != "EN" ? "هل انت متاكد انك دفعت المبلغ المستحق ؟" : "Are you sure you paid the amount ?"}</Text>
                    </View>

                    <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'space-evenly', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.setState({ isVisible: false })} style={[styles.shadow, { width: '40%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#017ED4", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "الغاء" : "Cancel"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.User.isMember ? this.memberPaid() : this.managerPaid()} style={[styles.shadow, { width: '40%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#017ED4", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "نعم" : "Yes"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    renderOverlayMember = () => {
        return (
            <Overlay
                isVisible={this.state.isVisibleMember}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width={width - 18 * 2}
                height={height - 18 * 2}
                // borderRadius={34}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisibleMember: false })}
            >
                <View
                    style={[styles.column, { backgroundColor: '#FFF', justifyContent: 'center' }]}
                >
                    <View style={{ width: '100%', height: height * 0.25, backgroundColor: '#8AD032', alignItems: 'center' }} >
                        <Text onPress={() => this.setState({ isVisibleMember: false })} style={{ color: '#000', fontSize: 22, fontWeight: 'bold', position: 'absolute', left: 10, top: 10 }}>
                            {"×"}
                        </Text>
                        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#017ED4', overflow: 'hidden', borderWidth: 2, borderColor: '#000', marginTop: height * 0.25 - 40 }} >
                            {
                                this.state.member ?
                                    <Image source={
                                        this.state.member.membersID.managerID ?
                                            this.state.member.membersID.managerID.imgPath ?
                                                { uri: this.state.member.membersID.managerID.imgPath }
                                                :
                                                require('./../../../../../Images/user.jpg')
                                            :
                                            this.state.member.membersID.imgPath ?
                                                { uri: this.state.member.membersID.imgPath }
                                                :
                                                require('./../../../../../Images/user.jpg')
                                    }
                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                    : null
                            }
                        </View>
                    </View>
                    <View style={{ width: '100%', height: height - (height * 0.25) - 80, marginTop: 60, backgroundColor: '#FFF', alignItems: 'center' }} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', width: '95%', height: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-evenly' }} >

                                <View style={{ width: '100%', marginBottom: height * 0.015 }} >
                                    <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginBottom: height * 0.01, justifyContent: 'center' }]} >
                                        <Text>{this.Language != "EN" ? "الأسم بالكامل" : "Full name"}</Text>
                                    </View>

                                    <View style={[styles.row, { width: '100%', paddingHorizontal: 10, justifyContent: 'center' }]} >
                                        <View style={[styles.row, { flex: 0.8, justifyContent: 'center', alignItems: 'center' }]} >
                                            <View style={[styles.shadow, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: height * 0.08, minHeight: 35, maxHeight: 60, elevation: 3, shadowOpacity: 0.2 }]}>
                                                <Item style={[{ width: '100%', height: '100%', borderBottomWidth: 0 }]}>
                                                    <Input
                                                        disabled
                                                        defaultValue={
                                                            this.state.member ?
                                                                this.state.member.membersID.managerID ?
                                                                    this.state.member.membersID.managerID.fullname
                                                                    :
                                                                    this.state.member.membersID.fullname
                                                                :
                                                                ""
                                                        }
                                                        //placeholder = {""}
                                                        style={{ color: '#000' }}
                                                        textAlign={'center'}
                                                        onChangeText={(text) => this.setState({ fullname: text })}
                                                    />
                                                </Item>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ width: '100%', marginBottom: height * 0.015 }} >

                                    <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginBottom: height * 0.01, justifyContent: 'center' }]} >
                                        <Text>{this.Language != "EN" ? "رقم الجوال" : "Mobile number"}</Text>
                                    </View>

                                    <View style={[styles.row, { width: '100%', paddingHorizontal: 10, justifyContent: 'center' }]} >
                                        <View style={[styles.row, { flex: 0.8, justifyContent: 'center', alignItems: 'center' }]} >
                                            <View style={[styles.shadow, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: height * 0.08, minHeight: 35, maxHeight: 60, shadowOpacity: 0.2, elevation: 3, }]}>
                                                <View style={[styles.row, { width: '35%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center', borderRightColor: '#d7d7d7', borderRightWidth: 1, borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}>
                                                    <View style={{ flex: 0, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Entypo name="chevron-down" style={{ color: '#000', fontSize: 18 }} />
                                                    </View>
                                                    <Text style={{ fontWeight: '500' }} >
                                                        {
                                                            this.state.member ?
                                                                this.state.member.membersID.managerID ?
                                                                    this.state.member.membersID.managerID.callingCode
                                                                    :
                                                                    this.state.member.membersID.callingCode
                                                                :
                                                                ""
                                                        }
                                                    </Text>
                                                    {/* <CountryPicker
                                                    countryCode={this.state.countryCode}
                                                    translation={'common'}
                                                    withAlphaFilter
                                                    withCallingCodeButton
                                                    withFlagButton={false}
                                                    withCallingCode
                                                    onSelect={(country) => this.setState({ callingCode: country.callingCode, countryCode: country.countryCode })}
                                                /> */}
                                                </View>
                                                <Item style={[{ width: '60%', height: '100%', borderBottomWidth: 0 }]}>
                                                    <Input
                                                        disabled
                                                        defaultValue={
                                                            this.state.member ?
                                                                this.state.member.membersID.managerID ?
                                                                    this.state.member.membersID.managerID.mobile
                                                                    :
                                                                    this.state.member.membersID.mobile
                                                                :
                                                                ""
                                                        }
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
                                </View>

                                <View style={[styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }]} >
                                    <TouchableOpacity onPress={() => this.setState({ isVisibleMember: false })} activeOpacity={1} style={[styles.shadow, { flex: 0.7, backgroundColor: '#E5F1D7', borderRadius: 12, paddingHorizontal: 9, borderWidth: 1, borderColor: '#6DB611', justifyContent: 'center', marginHorizontal: 18, alignItems: 'center', height: height * 0.06, minHeight: 35, maxHeight: 60 }]}>
                                        <Text style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }} >
                                            {this.Language != "EN" ? "اغلاق" : "close"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Overlay>
        )
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
                {this.renderOverlayMember()}
                <View style={[styles.column, { flex: 1, width }]} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 16, marginTop: 22 }]} >
                        <View style={{ borderBottomColor: '#707070', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#0C546A', fontWeight: 'bold' }} >
                            {this.props.navigation.getParam('Qatta').group}
                        </Text>
                        <View style={{ borderBottomColor: '#707070', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '100%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', padding: 10 }]} >
                                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', borderColor: "#017ED4", borderWidth: 3, overflow: 'hidden', marginHorizontal: 10 }} >
                                        <Image source={this.state.ManagerPic ? { uri: this.state.ManagerPic } : require('./../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                    </View>
                                    <View style={[styles.column, styles.column, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }, { flex: 1, justifyContent: 'space-evenly' }]} >
                                        <Text style={{ color: '#017ED4', fontSize: 18, fontWeight: 'bold' }} >{this.Language != "EN" ? "مدير المجموعة" : "Group Manager"}</Text>
                                        <Text style={{ color: '#707070', fontSize: 16 }} >{this.state.ManagerName}</Text>
                                    </View>
                                </View>

                                <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4 }]} >
                                    <Text style={{ color: '#707070', fontSize: 14, fontWeight: 'bold' }} >{this.state.Members.length} {this.Language != "EN" ? " أعضاء " : " Members "}</Text>
                                </View>

                                <View style={[styles.rowReverse, { flex: 1, marginVertical: 4, flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'flex-start' }]}>

                                    {
                                        this.state.Members.map((item, index) => {
                                            return (
                                                <TouchableOpacity onPress={() => this.setState({ member: item, isVisibleMember: true })} key={index.toString()} style={[styles.column, { width: "30%", aspectRatio: 0.7, backgroundColor: '#FFF', justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                                    {
                                                        item.isPaid == "2" ?
                                                            <Entypo name={"check"} style={{ color: '#017ED4', fontSize: 32, position: 'absolute', top: 10, right: width * 0.1 / 5, zIndex: 1 }} />
                                                            : null
                                                    }
                                                    <View style={{ width: width * 0.2, height: width * 0.2, backgroundColor: '#FFF', borderRadius: width * 0.1, borderWidth: 1, borderColor: "#000", overflow: 'hidden' }} >
                                                        <Image source={
                                                            item.membersID.managerID ?
                                                                item.membersID.managerID.imgPath ?
                                                                    { uri: item.membersID.managerID.imgPath }
                                                                    :
                                                                    require('./../../../../../Images/user.jpg')
                                                                :
                                                                item.membersID.imgPath ?
                                                                    { uri: item.membersID.imgPath }
                                                                    :
                                                                    require('./../../../../../Images/user.jpg')
                                                        }
                                                            style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                                    </View>
                                                    <View style={[styles.column, { alignItems: 'center' }]} >
                                                        <Text style={{ color: '#707070', fontWeight: 'bold' }} >{item.membersID.managerID ? item.membersID.managerID.fullname : item.membersID.fullname}</Text>
                                                        <Text style={{ color: '#017ED4', }} >{item.isPaid == 2 ? this.Language != "EN" ? "تم الدفع" : "Paid" : null}</Text>
                                                    </View>
                                                </TouchableOpacity>


                                            )
                                        })
                                    }


                                </View>

                            </ScrollView>
                        </View>
                    </View>

                </View>

                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width, justifyContent: 'space-evenly', paddingVertical: 12 }]} >
                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row]} >
                        <Text style={{ fontWeight: 'bold', color: '#017ED4' }} >{this.Language != "EN" ? "على العضو : " : "Each Member : "}</Text>
                        <Text style={{ marginHorizontal: 8 }} >{this.props.navigation.getParam('Qatta').perMember}{this.Language!="EN"? " رس " : " SR "}</Text>
                    </View>
                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row]} >
                        <Text style={{ fontWeight: 'bold', color: '#017ED4' }} >{this.Language != "EN" ? "الأجمالى : " : "Total : "}</Text>
                        <Text style={{ marginHorizontal: 8 }} >{this.props.navigation.getParam('Qatta').totalValue}{this.Language!="EN"? " رس " : " SR "}</Text>
                    </View>
                </View>

                <View style={{ width, height: 80, backgroundColor: '#017ED4', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    {
                        this.props.User.isMember || this.props.navigation.getParam('Qatta').createBy != this.props.User._id ?
                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "تم الدفع" : "Paid"}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "تم الدفع" : "Paid"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('QattaEdit', { Qatta: this.props.navigation.getParam('Qatta'), length: this.state.Members.length })} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "تعديل القطه" : "Edit Qatta"}</Text>
                                </TouchableOpacity>
                            </View>
                    }

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
export default connect(mapStateToProps, {})(QattaHome)

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