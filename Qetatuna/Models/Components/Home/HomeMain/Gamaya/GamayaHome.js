import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import { Overlay } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
axios.defaults.timeout = 10000

class GamayaHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nextMemberID: this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.nextMemberID : this.props.navigation.getParam('Gamaya').data.nextMemberID,
            nextMemberData: {},
            ThirdTable: {},
            Processing: false,
            overlayHeight1: height - 180,
            isVisible: false
        };
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

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        console.log(this.props.navigation.getParam('Gamaya').membersNumber)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('GamayaMain');
        return true;
    }

    componentDidMount() {
        let nextMemberID = this.props.navigation.getParam('Gamaya').membersNumber.find(usr => usr._id == this.state.nextMemberID._id);
        console.log( nextMemberID)
        this.setState({ nextMemberData: nextMemberID })
        this.getThirdTableData()
    }

    getThirdTableData() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        // console.log( this.state.nextMemberID )
        try {
            axios.get("http://167.172.183.142/api/user/getmemberIsPaid", {
                params: {
                    id: thisComponent.state.nextMemberID._id

                }
            }).then(response => {
                thisComponent.setState({ Processing: false, ThirdTable: response.data[0] })
                console.log(thisComponent.state.ThirdTable)
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
        //console.log( nextMemberID )
    }

    memberPaid() {
        const thisComponent = this
        const thirdTableId = this.state.ThirdTable._id
        // console.log(this.state.ThirdTable)
        // console.log(thisComponent.props.User._id)
        this.setState({ Processing: true, isVisible: false })
        try {
            axios.post('http://167.172.183.142/api/user/memberJameiaPaid/', {
                mobile: thisComponent.props.User.mobile,
                aljameiaID: thisComponent.state.ThirdTable.aljameiaID,
                id: thirdTableId
                // params: {
                // memberID: thisComponent.props.User._id
                // }
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.getThirdTableData()
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
                        <Text style={{ color: '#E1D115', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
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
                        <TouchableOpacity onPress={() => this.setState({ isVisible: false })} style={[styles.shadow, { width: '40%', backgroundColor: "#fff", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#E1D115", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "الغاء" : "Cancel"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.User.isMember ? this.memberPaid() : this.memberPaid()} style={[styles.shadow, { width: '40%', backgroundColor: "#fff", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#E1D115", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "نعم" : "Yes"}
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
                <Text style={{ color: '#000', fontSize: 16 }}>{this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.group : this.props.navigation.getParam('Gamaya').data.group}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

    renderMenu() {
        if (this.props.navigation.getParam('Gamaya').membersNumber.length < 5) { // this.state.list.length
            return this.renderLessThan5Items()
        } else if (this.props.navigation.getParam('Gamaya').membersNumber.length == 5) {
            return this.render5Items()
        } else if (this.props.navigation.getParam('Gamaya').membersNumber.length == 6) {
            return this.render6Items()
        } else if (this.props.navigation.getParam('Gamaya').membersNumber.length == 7) {
            return this.render7Items()
        } else if (this.props.navigation.getParam('Gamaya').membersNumber.length == 8) {
            return this.render8Items()
        } else if (this.props.navigation.getParam('Gamaya').membersNumber.length == 9) {
            return this.render9Items()
        } else if (this.props.navigation.getParam('Gamaya').membersNumber.length == 10) {
            return this.render10Items()
        } else {
            return this.render12Items()
        }
    }

    renderLessThan5Items() {
        return (
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
                                this.props.navigation.getParam('Gamaya').membersNumber.length > 1 ?  // second
                                    (
                                        <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                            width: width / 6,
                                            height: width / 6,
                                            borderRadius: width / 3,
                                            backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }]} >
                                            {
                                                this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[1]._id) ?
                                                    <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                                    : null
                                            }
                                            {
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                                    <View
                                                        style={[
                                                            this.props.navigation.getParam('Gamaya').membersNumber[1]._id == this.state.nextMemberID ?
                                                                { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                                :
                                                                { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                                        ]}
                                                    >
                                                        <Image
                                                            source={
                                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                                    :
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                            }
                                                            style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                        />
                                                    </View>
                                                    :
                                                    <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                            }
                                            <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                                        this.Language != "EN" ?
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonAr
                                                            :
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonEn
                                                        :
                                                        ""
                                                }
                                            </Text>
                                            <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.fullname :
                                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname : ''
                                                }
                                            </Text>

                                        </View>
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
                                this.props.navigation.getParam('Gamaya').membersNumber.length > 0 ? // first
                                    (
                                        <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                            width: width / 6,
                                            height: width / 6,
                                            borderRadius: width / 3,
                                            backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }]} >
                                            {
                                                this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[0]._id) ?
                                                    <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                                    : null
                                            }
                                            {
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                                    <View
                                                        style={[
                                                            this.props.navigation.getParam('Gamaya').membersNumber[0]._id == this.state.nextMemberID ?
                                                                { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                                :
                                                                { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                                        ]}
                                                    >
                                                        <Image
                                                            source={
                                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                                    :
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                            }
                                                            style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                        />
                                                    </View>
                                                    :
                                                    <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                            }
                                            <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                                        this.Language != "EN" ?
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonAr
                                                            :
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonEn
                                                        :
                                                        ""
                                                }
                                            </Text>
                                            <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.fullname :
                                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname : ''
                                                }
                                            </Text>

                                        </View>
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
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                                    {this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}
                                </Text>
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
                                this.props.navigation.getParam('Gamaya').membersNumber.length > 2 ? // third
                                    (
                                        <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                            width: width / 6,
                                            height: width / 6,
                                            borderRadius: width / 3,
                                            backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }]} >
                                            {
                                                this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[2]._id) ?
                                                    <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                                    : null
                                            }
                                            {
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                                    <View
                                                        style={[
                                                            this.props.navigation.getParam('Gamaya').membersNumber[2]._id == this.state.nextMemberID ?
                                                                { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                                :
                                                                { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                                        ]}
                                                    >
                                                        <Image
                                                            source={
                                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                                    :
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                            }
                                                            style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                        />
                                                    </View>
                                                    :
                                                    <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                            }
                                            <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                                        this.Language != "EN" ?
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonAr
                                                            :
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonEn

                                                        :
                                                        ""
                                                }
                                            </Text>
                                            <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.fullname :
                                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname : ''
                                                }
                                            </Text>

                                        </View>
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
                                this.props.navigation.getParam('Gamaya').membersNumber.length > 3 ? // forth
                                    (
                                        <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                            width: width / 6,
                                            height: width / 6,
                                            borderRadius: width / 3,
                                            backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }]} >
                                            {
                                                this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[3]._id) ?
                                                    <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                                    : null
                                            }
                                            {
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                                    <View
                                                        style={[
                                                            this.props.navigation.getParam('Gamaya').membersNumber[3]._id == this.state.nextMemberID ?
                                                                { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                                :
                                                                { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                                        ]}
                                                    >
                                                        <Image
                                                            source={
                                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                                    :
                                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath ?
                                                                        { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath }
                                                                        :
                                                                        require('../../../../../Images/user.jpg')
                                                            }
                                                            style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                        />
                                                    </View>
                                                    :
                                                    <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                            }
                                            <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                                        this.Language != "EN" ?
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonAr
                                                            :
                                                            new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                            + " " +
                                                            this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonEn
                                                        :
                                                        ""
                                                }
                                            </Text>
                                            <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                                {
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.fullname :
                                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname : ''
                                                }
                                            </Text>

                                        </View>
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
        )
    }

    render5Items() {
        return (
            <View>
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

                            {/* first */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[0]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[0]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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

                            {/* fifth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[4]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[4]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname : ''
                                    }
                                </Text>
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
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                                    {this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}
                                </Text>
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

                            {/* second */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[1]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[1]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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

                            {/* forth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[3]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[3]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname : ''
                                    }
                                </Text>
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

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* third */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[2]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[2]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </View>
        )
    }

    render6Items() {
        return (
            <View>
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

                            {/* sixth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[5]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[5]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname : ''
                                    }
                                </Text>
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

                            {/* first */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[0]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[0]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[1]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[1]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                                    {this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}
                                </Text>
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

                            {/* fifth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[4]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[4]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname : ''
                                    }
                                </Text>
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

                            {/* forth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[3]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[3]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* third */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[2]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[2]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </View>
        )
    }

    render7Items() {
        return (
            <View>
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

                            {/* Seventh */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[6]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[6]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname : ''
                                    }
                                </Text>

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

                            {/* first */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[0]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[0]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[1]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[1]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                                    {this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}
                                </Text>
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

                            {/* sixth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[5]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[5]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* fifth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: - width / 15,
                                marginBottom: - width / 15,
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[4]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[4]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                            {/* forth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: - width / 15,
                                marginBottom: - width / 15,
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[3]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[3]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* third */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: - width / 12
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[2]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[2]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </View>
        )
    }

    render8Items() {

        return (
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

                            {/* eighth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[7]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[7]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname : ''
                                    }
                                </Text>
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

                            {/* first */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[0]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[0]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[1]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[1]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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

                            {/* seventh */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[6]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[6]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname : ''
                                    }
                                </Text>
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
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                                    {this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}
                                </Text>
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

                            {/* third */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[2]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[2]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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

                            {/* sixth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[5]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[5]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname : ''
                                    }
                                </Text>
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

                            {/* fifth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[4]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[4]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* forth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 6,
                                height: width / 6,
                                borderRadius: width / 3,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[3]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[3]._id == this.state.nextMemberID ?
                                                    { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </View>
        )
    }

    render9Items() {

        return (
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
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[8]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[8]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* first */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginBottom: width / 16,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[0]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[0]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginLeft: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[1]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[1]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 22,
                                marginTop: width / 32,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[7]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[7]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname : ''
                                    }
                                </Text>
                            </View>
                            {/* seventh */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 12,
                                marginBottom: - width / 32,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[6]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[6]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 8, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname : ''
                                    }
                                </Text>
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
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                                    {this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}
                                </Text>
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

                            {/* third */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 8,
                                marginLeft: - width / 22,
                                marginTop: width / 32,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[2]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[2]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname : ''
                                    }
                                </Text>
                            </View>
                            {/* forth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginLeft: - width / 12,
                                marginBottom: - width / 32,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[3]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[3]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 8, height: width / 8 - 8, borderRadius: width / 4 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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

                            {/* sexth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 8,
                                marginTop: width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[5]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[5]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
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

                            {/* fifth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginLeft: - width / 8,
                                marginTop: width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[4]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[4]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </View>
        )
    }

    render10Items() {

        return (
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
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[9]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[9]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[9].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[9].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[9].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[9].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[9].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* first */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginBottom: width / 16,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[0]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[0]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[0].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[0].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* second */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginLeft: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[1]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[1]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[1].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[1].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[8]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[8]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[8].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[8].membersID.fullname : ''
                                    }
                                </Text>
                            </View>
                            {/* eighth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[7]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[7]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 8, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[7].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[7].membersID.fullname : ''
                                    }
                                </Text>
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
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                                    {this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}
                                </Text>
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

                            {/* third */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 8,
                                marginLeft: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[2]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[2]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[2].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[2].membersID.fullname : ''
                                    }
                                </Text>
                            </View>
                            {/* forth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginLeft: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[3]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[3]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 8, height: width / 8 - 8, borderRadius: width / 4 - 8, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[3].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[3].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

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

                            {/* seventh */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginRight: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[6]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[6]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[6].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[6].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* sexth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginTop: width / 16,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[5]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[5]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[5].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[5].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                width: width / 3,
                                height: '100%',
                            }}>

                            {/* fifth */}
                            <View style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                width: width / 8,
                                height: width / 8,
                                borderRadius: width / 4,
                                marginLeft: - width / 22,
                                backgroundColor: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} >
                                {
                                    this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(this.props.navigation.getParam('Gamaya').membersNumber[4]._id) ?
                                        <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                        : null
                                }
                                {
                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                        <View
                                            style={[
                                                this.props.navigation.getParam('Gamaya').membersNumber[4]._id == this.state.nextMemberID ?
                                                    { width: width / 8 - 4, height: width / 8 - 4, borderRadius: width / 4 - 4, overflow: 'hidden' }
                                                    :
                                                    { width: width / 8, height: width / 8, borderRadius: width / 4, overflow: 'hidden' }
                                            ]}
                                        >
                                            <Image
                                                source={
                                                    this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                        :
                                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath ?
                                                            { uri: this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.imgPath }
                                                            :
                                                            require('../../../../../Images/user.jpg')
                                                }
                                                style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                            />
                                        </View>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                }
                                <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.Language != "EN" ?
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonAr
                                                :
                                                new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getDate()
                                                + " " +
                                                this.Monthes[new Date(this.props.navigation.getParam('Gamaya').membersNumber[4].turnDate).getMonth()].MonEn
                                            :
                                            ""
                                    }
                                </Text>
                                <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                    {
                                        this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname != "0" ?
                                            this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID ?
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.managerID.fullname :
                                                this.props.navigation.getParam('Gamaya').membersNumber[4].membersID.fullname : ''
                                    }
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

                {/* ------------------------------------ Grid End ------------------------------------ */}
            </View>
        )
    }

    render12Items() {
        return (
            <View style={[styles.column, { width, alignItems: 'center' }]} >

                <View style={[styles.column, { width: '90%', backgroundColor: '#FFF', borderRadius: 18, paddingVertical: 8, marginTop: 16, justifyContent: 'space-evenly' }]} >

                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 }]}>
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >
                            {
                                this.state.nextMemberData.turnDate ?
                                    this.Language != "EN" ?
                                        this.Monthes[new Date(this.state.nextMemberData.turnDate).getMonth()].MonAr
                                        :
                                        this.Monthes[new Date(this.state.nextMemberData.turnDate).getMonth()].MonEn
                                    :
                                    ""
                            }
                        </Text>
                        <View style={[styles.column, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 12 }]}>
                            <Text style={{ color: '#E1D115' }} >{this.Language != "EN" ? "قيمة الجمعية" : "Gamaya Price"}</Text>
                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }} >{this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}</Text>
                            <Text style={{ color: '#000' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }} >
                            <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#3E9545', justifyContent: 'center', alignItems: 'center' }]} >
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{"0"}</Text>
                            </View>
                            <Text style={{ color: '#000' }} >{this.Language != "EN" ? "لم يدفع" : "Not Paid"}</Text>
                        </View>
                    </View>

                </View>

                <View
                    style={[styles.row, {
                        width: width,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        marginTop: 10
                    }]}>
                    {
                        this.props.navigation.getParam('Gamaya').membersNumber.map((item, index) => {
                            return (
                                <View key={index.toString()} style={[styles.shadow, { shadowOpacity: 0.3 }, {
                                    width: width / 6,
                                    height: width / 6,
                                    borderRadius: width / 3,
                                    backgroundColor: item.membersID.fullname == "0" ? "#FFF" : '#3E9545',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 6,
                                    marginVertical: 22
                                }]} >
                                    {
                                        this.state.ThirdTable.membersPaid && this.state.ThirdTable.membersPaid.includes(item._id) ?
                                            <Entypo name={"check"} style={{ color: '#FFF', fontSize: 22, position: 'absolute', top: 0, right: -10, zIndex: 1 }} />
                                            : null
                                    }
                                    {
                                        item.membersID.fullname != "0" ?
                                            <View
                                                style={[
                                                    item._id == this.state.nextMemberID ?
                                                        { width: width / 6 - 8, height: width / 6 - 8, borderRadius: width / 3 - 8, overflow: 'hidden' }
                                                        :
                                                        { width: width / 6, height: width / 6, borderRadius: width / 3, overflow: 'hidden' }
                                                ]}
                                            >
                                                <Image
                                                    source={
                                                        item.membersID.managerID ?
                                                            item.membersID.managerID.imgPath ?
                                                                { uri: item.membersID.managerID.imgPath }
                                                                :
                                                                require('../../../../../Images/user.jpg')
                                                            :
                                                            item.membersID.imgPath ?
                                                                { uri: item.membersID.imgPath }
                                                                :
                                                                require('../../../../../Images/user.jpg')
                                                    }
                                                    style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                />
                                            </View>
                                            :
                                            <Text style={{ fontWeight: 'bold', fontSize: 24 }} >+</Text>
                                    }
                                    <Text numberOfLines={1} style={{ position: 'absolute', top: -16, fontSize: 12, color: '#FFF', fontWeight: 'bold' }} >
                                        {
                                            item.membersID.fullname != "0" ?
                                                this.Language != "EN" ?
                                                    new Date(item.turnDate).getDate()
                                                    + " " +
                                                    this.Monthes[new Date(item.turnDate).getMonth()].MonAr
                                                    :
                                                    new Date(item.turnDate).getDate()
                                                    + " " +
                                                    this.Monthes[new Date(item.turnDate).getMonth()].MonEn
                                                :
                                                ""
                                        }
                                    </Text>
                                    <Text numberOfLines={1} style={{ position: 'absolute', bottom: -16, fontSize: 12 }} >
                                        {
                                            item.membersID.fullname != "0" ?
                                                item.membersID.managerID ?
                                                    item.membersID.managerID.fullname :
                                                    item.membersID.fullname : ''
                                        }
                                    </Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <View style={{ flex: 1, width, backgroundColor: '#E1D115' }} >
                    <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    {this.renderHeader()}
                    {this.renderOverlay()}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} >

                        {
                            this.props.navigation.getParam('Gamaya').membersNumber.length < 11 ?
                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width, alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 18, marginTop: 14 }]}>
                                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }} >
                                        {
                                            this.state.nextMemberData.turnDate ?
                                                this.Language != "EN" ?
                                                    this.Monthes[new Date(this.state.nextMemberData.turnDate).getMonth()].MonAr
                                                    :
                                                    this.Monthes[new Date(this.state.nextMemberData.turnDate).getMonth()].MonEn
                                                :
                                                ""
                                        }
                                    </Text>
                                    <View style={{ alignItems: 'center' }} >
                                        <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#3E9545', justifyContent: 'center', alignItems: 'center' }]} >
                                            <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{this.state.ThirdTable.membersPaid ? this.state.ThirdTable.membersPaid.length : "0"}</Text>
                                        </View>
                                        <Text style={{ color: '#FFF' }} >{this.Language != "EN" ? "دفع" : "Paid"}</Text>
                                    </View>
                                </View> : null
                        }


                        {
                            this.renderMenu()
                        }

                    </ScrollView>

                    <View style={[styles.column, { justifyContent: 'center', width, height: 110, backgroundColor: '#FFF', borderTopLeftRadius: 38, borderTopRightRadius: 38 }]} >
                        <View style={[styles.rowReverse, { marginHorizontal: 46, alignItems: 'center', paddingVertical: 8, justifyContent: 'center' }]} >
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }} >{this.props.User.isMember ? this.props.navigation.getParam('Gamaya').data.aljameiaID.aljameiaAmount : this.props.navigation.getParam('Gamaya').data.aljameiaAmount}</Text>
                            <Text style={{ fontSize: 14 }} >{this.Language != "EN" ? " ريال سعودى " : " SAR "}</Text>
                        </View>
                        {
                            this.props.User.isMember || this.props.navigation.getParam('Gamaya').data.createBy._id != this.props.User._id ?
                                <View style={[styles.row, { flex: 0.5, justifyContent: 'center', alignItems: 'center' }]} >
                                    <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#E1D115', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "تم دفع قيمة الجمعية" : "Paid"}</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 0.5, justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                    <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#E1D115', paddingVertical: 8, borderRadius: 16, borderColor: '#CBBE21', borderWidth: 1, paddingHorizontal: 12 }]}>
                                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "تم دفع قيمة الجمعية" : "Paid"}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('GamayaEdit', { Gamaya: this.props.navigation.getParam('Gamaya') })} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#E1D115', paddingVertical: 8, borderRadius: 16, borderColor: '#CBBE21', borderWidth: 1, paddingHorizontal: 12 }]}>
                                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "تعديل الجمعية" : "Edit Gamaya"}</Text>
                                    </TouchableOpacity>
                                </View>
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
        User: state.AuthReducer.User,
    }
}
// redux
export default connect(mapStateToProps, {})(GamayaHome)

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
    },
})