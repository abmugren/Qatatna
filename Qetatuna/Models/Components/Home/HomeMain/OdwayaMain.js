import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import ResposiveText from "./../../../ResponsiveText"
import { BoxShadow } from 'react-native-shadow'

class OdwayaMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Models: [],
            ModelsPaginated: [],
            pageCounter: 6,
            page: 0,
            Processing: false,
            itemHeight: 125,
            itemHeight2: 125,
            itemHeight3: 125,
        };
    }

    UNSAFE_componentWillMount() {
        this.getData()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('Home');
        return true;
    }

    getData() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        if (this.props.User.isMember) {
            try {
                // alert('0')
                axios.all([
                    axios.get('http://167.172.183.142/api/user/getQattaByMember', {
                        params: {
                            membersID: thisComponent.props.User._id,
                            // page: thisComponent.state.page,
                            // limit: "1"
                        }
                    }),
                    axios.get('http://167.172.183.142/api/user/getAljameiaByMember', {
                        params: {
                            membersID: thisComponent.props.User._id,
                            // page: thisComponent.state.page,
                            // limit: "1"
                        }
                    }),
                    axios.get('http://167.172.183.142/api/user/getAlDorayaByMember', {
                        params: {
                            membersID: thisComponent.props.User._id,
                            // page: thisComponent.state.page,
                            // limit: "1"
                        }
                    })
                ]).then(axios.spread((Qattas, Gamayas, Dorayas) => {
                    thisComponent.setState({ Processing: false })
                    if (Qattas.data.length == 0 && Gamayas.data.length == 0 && Dorayas.data.length == 0) {
                        thisComponent.state.Models.length == 0 ?
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "ليس لديك عضويات" : "There is no Odwayas")
                            }, 100)
                            :
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "لا يوجد مزيد" : "End of results")
                            }, 100)
                    } else {
                        var arr = [...Qattas.data, ...Gamayas.data, ...Dorayas.data]
                        arr.sort((a, b) => (a.data.createdAt > b.data.createdAt) ? 1 : -1).reverse()
                        thisComponent.setState({ ModelsPaginated: [...arr.slice(0, thisComponent.state.pageCounter)], Models: [...arr] })
                        // thisComponent.setState({ Models: [...thisComponent.state.Models, ...arr], page: thisComponent.state.page + 1 })
                    }
                    console.log(thisComponent.state.Models)
                    console.log(Qattas)
                    console.log(Gamayas)
                    console.log(Dorayas)
                    //alert('1')
                    // do something with both responses
                })).catch(function (error) {
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
        } else {
            try {
                // alert('0')
                axios.all([
                    axios.get('http://167.172.183.142/api/user/getQattaByManager', {
                        params: {
                            managerID: thisComponent.props.User._id,
                            mobile: thisComponent.props.User.mobile,
                            // page: thisComponent.state.page,
                            // limit: "1"
                        }
                    }),
                    axios.get('http://167.172.183.142/api/user/getAljameiaByManager', {
                        params: {
                            managerID: thisComponent.props.User._id,
                            mobile: thisComponent.props.User.mobile,
                            // page: thisComponent.state.page,
                            // limit: "1"
                        }
                    }),
                    axios.get('http://167.172.183.142/api/user/getDorayaByManager', {
                        params: {
                            managerID: thisComponent.props.User._id,
                            mobile: thisComponent.props.User.mobile,
                            // page: thisComponent.state.page,
                            // limit: "1"
                        }
                    })
                ]).then(axios.spread((Qattas, Gamayas, Dorayas) => {
                    thisComponent.setState({ Processing: false })
                    if (Qattas.data.length == 0 && Gamayas.data.length == 0 && Dorayas.data.length == 0) {
                        thisComponent.state.Models.length == 0 ?
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "ليس لديك عضويات" : "There is no Odwayas")
                            }, 100)
                            :
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "لا يوجد مزيد" : "End of results")
                            }, 100)
                    } else {
                        var arr = [...Qattas.data, ...Gamayas.data, ...Dorayas.data]
                        arr.sort((a, b) => (a.data.createdAt > b.data.createdAt) ? 1 : -1).reverse()
                        thisComponent.setState({ ModelsPaginated: [...arr.slice(0, thisComponent.state.pageCounter)], Models: [...arr] })
                        // thisComponent.setState({ Models: [...thisComponent.state.Models, ...arr], page: thisComponent.state.page + 1 })
                    }
                    console.log(thisComponent.state.ModelsPaginated)
                    // console.log(Qattas)
                    // console.log(Gamayas)
                    // console.log(Dorayas)
                    //alert('1')
                    // do something with both responses
                })).catch(function (error) {
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

    loadMore() {
        let arr = this.state.Models.slice(this.state.pageCounter, this.state.pageCounter + 6)
        this.setState({ ModelsPaginated: [...this.state.ModelsPaginated, ...arr] })
        this.setState({ pageCounter: this.state.pageCounter + 6 })
        console.log(this.state.ModelsPaginated)
    }

    Language = this.props.Language ? this.props.Language : "AR"

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "العضوية" : "Groups"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    renderQatta(item, index) {
        const shadowOpt = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 1, // width of shadow
            opacity: 0.2,
            x: 2,
            y: 2,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt2 = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 2, // width of shadow
            opacity: 0.2,
            x: 3,
            y: 3,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt3 = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 3, // width of shadow
            opacity: 0.1,
            x: 4,
            y: 4,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt4 = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 5, // width of shadow
            opacity: 0.1,
            x: 5,
            y: 5,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        return (
            item.data ?
                <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.navigation.navigate('OdwayaHome', { Id: this.props.User.isMember ? item.data.qattaID : item.data, Type: 1 })}
                        // style={[this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width: '90%', backgroundColor: '#81C32E', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 22, shadowOffset: { height: 4, width: 4 }, shadowOpacity: 0.7, shadowRadius: 5, elevation: 5 }]}>
                        style={[styles.shadow, { elevation: 10, backgroundColor: '#FFF', borderRadius: 26 }]} >

                        <BoxShadow setting={shadowOpt}>
                            <BoxShadow setting={shadowOpt2}>
                                <BoxShadow setting={shadowOpt3}>
                                    <BoxShadow setting={shadowOpt4}>
                                        <View
                                            style={[this.Language != "EN" ? styles.row : styles.rowReverse, {
                                                position: "relative",
                                                width: width * 0.9, minHeight: 125,
                                                backgroundColor: '#017ED4', borderRadius: 26,
                                                paddingHorizontal: 12
                                            }]}
                                            onLayout={(event) => {
                                                var { x, y, width, height } = event.nativeEvent.layout;
                                                height > this.state.itemHeight ?
                                                    this.setState({ itemHeight: height }) : {}
                                            }}
                                        >

                                            <View style={[styles.column, { flex: 2, justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8 }]}>

                                                <View style={[styles.column, { width: '100%', justifyContent: 'center' }, this.Language != "EN" ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]} >
                                                    <Text style={{ color: '#FFF', textAlign: 'left', fontSize: 10 }} >{item.membersNumber.length}{this.Language != "EN" ? " اعضاء " : " Members "}</Text>
                                                </View>

                                                <View style={[styles.column, this.Language != "EN" ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }, { justifyContent: 'center', alignItems: 'center', width: '50%', }]} >
                                                    {/* <View style={[styles.row, { width: '100%', justifyContent: (this.Language != "EN" ? 'flex-end' : "flex-start"), alignItems: 'center' }]} > */}
                                                    <Text numberOfLines={2} style={{ color: '#FFF', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }} >{this.props.User.isMember ? item.data.qattaID.group : item.data.group}</Text>
                                                    {/* </View> */}
                                                </View>

                                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', justifyContent: 'space-between', alignItems: 'center' }]} >

                                                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }]} >

                                                        {
                                                            item.membersNumber[0] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -5, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[0].membersID.managerID ?
                                                                                item.membersNumber[0].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[0].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[0].membersID && item.membersNumber[0].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[0].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber[1] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[1].membersID.managerID ?
                                                                                item.membersNumber[1].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[1].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[1].membersID && item.membersNumber[1].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[1].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber[2] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[2].membersID.managerID ?
                                                                                item.membersNumber[2].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[2].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[2].membersID && item.membersNumber[2].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[2].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber.find(o => o.membersID.fullname === '0') ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', borderColor: '#FFF', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5, justifyContent: 'center', alignItems: 'center' }]} >
                                                                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 12 }} >{"+"}</Text>
                                                                </View>
                                                                :
                                                                item.membersNumber.length > 3 ?
                                                                    <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', borderColor: '#FFF', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5, justifyContent: 'center', alignItems: 'center' }]} >
                                                                        <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 12 }} >{"+" + (item.membersNumber.length - 3)}</Text>
                                                                    </View>
                                                                    :
                                                                    null

                                                        }

                                                    </View>

                                                </View>

                                            </View>



                                            <View style={[styles.column, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }, { flex: 1, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 8 }]} >
                                                <Image source={require('./../../../../Images/55.png')} style={{ resizeMode: 'stretch', height: 80, aspectRatio: 0.8 }} />
                                                {/* <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 26, fontWeight: 'bold' }} >{this.Language != "EN" ? "القطة" : "Qatta"}</Text> */}
                                                <ResposiveText text={this.Language != "EN" ? "القطة" : "Qatta"} fontSize={26} color={'#FFF'} fontWeight="bold" textAlign={this.Language != "EN" ? "right" : 'left'} />
                                            </View>

                                        </View>
                                    </BoxShadow>
                                </BoxShadow>
                            </BoxShadow>
                        </BoxShadow>

                    </TouchableOpacity>
                </View> : null
        )

    }

    renderGamaya(item, index) {
        const shadowOpt = {
            width: width * 0.9, height: this.state.itemHeight2, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 1, // width of shadow
            opacity: 0.2,
            x: 2,
            y: 2,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt2 = {
            width: width * 0.9, height: this.state.itemHeight2, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 2, // width of shadow
            opacity: 0.2,
            x: 3,
            y: 3,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt3 = {
            width: width * 0.9, height: this.state.itemHeight2, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 3, // width of shadow
            opacity: 0.1,
            x: 4,
            y: 4,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt4 = {
            width: width * 0.9, height: this.state.itemHeight2, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 5, // width of shadow
            opacity: 0.1,
            x: 5,
            y: 5,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        let count = 0
        if (item.data) {
            item.membersNumber.map((item, index) => {
                item.membersID && item.membersID.fullname != "0" && item.status != 2 ?
                    count++ : {}
            })
        } else {  }
        return (
            item.data ?
                <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.navigation.navigate('OdwayaHome', { Id: this.props.User.isMember ? item.data.aljameiaID : item.data, Type: 2 })}
                        // style={[this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width: '90%', backgroundColor: '#81C32E', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 22, shadowOffset: { height: 4, width: 4 }, shadowOpacity: 0.7, shadowRadius: 5, elevation: 5 }]}>
                        style={[styles.shadow, { elevation: 10, backgroundColor: '#FFF', borderRadius: 26 }]} >

                        <BoxShadow setting={shadowOpt}>
                            <BoxShadow setting={shadowOpt2}>
                                <BoxShadow setting={shadowOpt3}>
                                    <BoxShadow setting={shadowOpt4}>
                                        <View
                                            style={[this.Language != "EN" ? styles.row : styles.rowReverse, {
                                                position: "relative",
                                                width: width * 0.9, minHeight: 125,
                                                backgroundColor: '#E1D115', borderRadius: 26,
                                                paddingHorizontal: 12
                                            }]}
                                            onLayout={(event) => {
                                                var { x, y, width, height } = event.nativeEvent.layout;
                                                height > this.state.itemHeight2 ?
                                                    this.setState({ itemHeight2: height }) : {}
                                            }}
                                        >

                                            <View style={[styles.column, { flex: 2, justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8 }]}>

                                                <View style={[styles.column, { width: '100%', justifyContent: 'center' }, this.Language != "EN" ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]} >
                                                    <Text style={{ color: '#FFF', textAlign: 'left', fontSize: 10 }} >{count ? count : item.membersNumber.length}{this.Language != "EN" ? " اعضاء " : " Members "}</Text>
                                                </View>

                                                <View style={[styles.column, this.Language != "EN" ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }, { justifyContent: 'center', alignItems: 'center', width: '50%', }]} >
                                                    {/* <View style={[styles.row, { width: '100%', justifyContent: (this.Language != "EN" ? 'flex-end' : "flex-start"), alignItems: 'center' }]} > */}
                                                    <Text numberOfLines={2} style={{ color: '#FFF', textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginVertical: 12 }} >{this.props.User.isMember ? item.data.aljameiaID.group : item.data.group}</Text>
                                                    {/* </View> */}
                                                </View>

                                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', justifyContent: 'space-between', alignItems: 'center' }]} >

                                                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }]} >

                                                        {
                                                            item.membersNumber[0] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -5, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[0].membersID.managerID ?
                                                                                item.membersNumber[0].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[0].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[0].membersID && item.membersNumber[0].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[0].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber[1] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[1].membersID.managerID ?
                                                                                item.membersNumber[1].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[1].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[1].membersID && item.membersNumber[1].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[1].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber[2] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[2].membersID.managerID ?
                                                                                item.membersNumber[2].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[2].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[2].membersID && item.membersNumber[2].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[2].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber.find(o => o.membersID.fullname === '0') ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', borderColor: '#FFF', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5, justifyContent: 'center', alignItems: 'center' }]} >
                                                                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 12 }} >{"+"}</Text>
                                                                </View>
                                                                :
                                                                item.membersNumber.length > 3 ?
                                                                    <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', borderColor: '#FFF', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5, justifyContent: 'center', alignItems: 'center' }]} >
                                                                        <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 12 }} >{"+" + (item.membersNumber.length - 3)}</Text>
                                                                    </View>
                                                                    :
                                                                    null

                                                        }

                                                    </View>

                                                </View>

                                            </View>

                                            <View style={[styles.column, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }, { flex: 1, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 0 }]} >
                                                <Image source={require('./../../../../Images/55.png')} style={{ resizeMode: 'stretch', height: 80, aspectRatio: 0.8 }} />
                                                {/* <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 26, fontWeight: 'bold' }} >{this.Language != "EN" ? "الجمعية" : "Gamaya"}</Text> */}
                                                <ResposiveText text={this.Language != "EN" ? "الجمعية" : "Gamaya"} fontSize={26} color={'#FFF'} fontWeight="bold" textAlign={this.Language != "EN" ? "right" : 'left'} />
                                            </View>

                                        </View>
                                    </BoxShadow>
                                </BoxShadow>
                            </BoxShadow>
                        </BoxShadow>

                    </TouchableOpacity>
                </View>
                : null
        )
    }

    renderDoraya(item, index) {
        const shadowOpt = {
            width: width * 0.9, height: this.state.itemHeight3, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 1, // width of shadow
            opacity: 0.2,
            x: 2,
            y: 2,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt2 = {
            width: width * 0.9, height: this.state.itemHeight3, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 2, // width of shadow
            opacity: 0.2,
            x: 3,
            y: 3,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt3 = {
            width: width * 0.9, height: this.state.itemHeight3, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 3, // width of shadow
            opacity: 0.1,
            x: 4,
            y: 4,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt4 = {
            width: width * 0.9, height: this.state.itemHeight3, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 5, // width of shadow
            opacity: 0.1,
            x: 5,
            y: 5,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        let count = 0
        if (item.data) {
            item.membersNumber.map((item, index) => {
                item.membersID && item.membersID.fullname != "0" && item.status != 2 ?
                    count++ : {}
            })
        } else {  }
        return (
            item.data ?
                <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.navigation.navigate('OdwayaHome', { Id: this.props.User.isMember ? item.data.dorayaID : item.data, Type: 3 })}
                        // style={[this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width: '90%', backgroundColor: '#81C32E', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 22, shadowOffset: { height: 4, width: 4 }, shadowOpacity: 0.7, shadowRadius: 5, elevation: 5 }]}>
                        style={[styles.shadow, { elevation: 10, backgroundColor: '#FFF', borderRadius: 26 }]} >

                        <BoxShadow setting={shadowOpt}>
                            <BoxShadow setting={shadowOpt2}>
                                <BoxShadow setting={shadowOpt3}>
                                    <BoxShadow setting={shadowOpt4}>
                                        <View
                                            style={[this.Language != "EN" ? styles.row : styles.rowReverse, {
                                                position: "relative",
                                                width: width * 0.9, minHeight: 125,
                                                backgroundColor: '#00C4CA', borderRadius: 26,
                                                paddingHorizontal: 12
                                            }]}
                                            onLayout={(event) => {
                                                var { x, y, width, height } = event.nativeEvent.layout;
                                                height > this.state.itemHeight3 ?
                                                    this.setState({ itemHeight3: height }) : {}
                                            }}
                                        >

                                            <View style={[styles.column, { flex: 2, justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8 }]}>

                                                <View style={[styles.column, { width: '100%', justifyContent: 'center' }, this.Language != "EN" ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]} >
                                                    <Text style={{ color: '#FFF', textAlign: 'left', fontSize: 10 }} >{count ? count : item.membersNumber.length}{this.Language != "EN" ? " اعضاء " : " Members "}</Text>
                                                </View>

                                                <View style={[styles.column, this.Language != "EN" ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }, { justifyContent: 'center', alignItems: 'center', width: '50%', }]} >
                                                    {/* <View style={[styles.row, { width: '100%', justifyContent: (this.Language != "EN" ? 'flex-end' : "flex-start"), alignItems: 'center' }]} > */}
                                                    <Text numberOfLines={2} style={{ color: '#FFF', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }} >{this.props.User.isMember ? item.data.dorayaID.group : item.data.group}</Text>
                                                    {/* </View> */}
                                                </View>

                                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', justifyContent: 'space-between', alignItems: 'center' }]} >

                                                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }]} >

                                                        {
                                                            item.membersNumber[0] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -5, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[0].membersID.managerID ?
                                                                                item.membersNumber[0].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[0].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[0].membersID && item.membersNumber[0].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[0].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber[1] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[1].membersID.managerID ?
                                                                                item.membersNumber[1].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[1].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[1].membersID && item.membersNumber[1].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[1].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber[2] ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CCC', borderColor: '#707070', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5 }]} >
                                                                    <Image
                                                                        source={
                                                                            item.membersNumber[2].membersID.managerID ?
                                                                                item.membersNumber[2].membersID.managerID.imgPath ?
                                                                                    { uri: item.membersNumber[2].membersID.managerID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                                :
                                                                                item.membersNumber[2].membersID && item.membersNumber[2].membersID.imgPath ?
                                                                                    { uri: item.membersNumber[2].membersID.imgPath }
                                                                                    :
                                                                                    require('./../../../../Images/user.jpg')
                                                                        }
                                                                        resizeMethod="resize"
                                                                        style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                                    />
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            item.membersNumber.find(o => o.membersID.fullname === '0') ?
                                                                <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', borderColor: '#FFF', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5, justifyContent: 'center', alignItems: 'center' }]} >
                                                                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 12 }} >{"+"}</Text>
                                                                </View>
                                                                :
                                                                item.membersNumber.length > 3 ?
                                                                    <View style={[styles.shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', borderColor: '#FFF', borderWidth: 1, marginLeft: -10, overflow: 'hidden', elevation: 5, justifyContent: 'center', alignItems: 'center' }]} >
                                                                        <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 12 }} >{"+" + (item.membersNumber.length - 3)}</Text>
                                                                    </View>
                                                                    :
                                                                    null

                                                        }

                                                    </View>

                                                </View>

                                            </View>



                                            <View style={[styles.column, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }, { flex: 1, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 0 }]} >
                                                <Image source={require('./../../../../Images/55.png')} style={{ resizeMode: 'stretch', height: 80, aspectRatio: 0.8 }} />
                                                {/* <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 26, fontWeight: 'bold' }} >{this.Language != "EN" ? "الدورية" : "Doraya"}</Text> */}
                                                <ResposiveText text={this.Language != "EN" ? "الدورية" : "Doraya"} fontSize={26} color={'#FFF'} fontWeight="bold" textAlign={this.Language != "EN" ? "right" : 'left'} />
                                            </View>

                                        </View>
                                    </BoxShadow>
                                </BoxShadow>
                            </BoxShadow>
                        </BoxShadow>

                    </TouchableOpacity>
                </View>
                : null
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 70, paddingTop: 12 }} >




                    {

                        this.props.User.isMember ?

                            this.state.Models.map((item, index) => {
                                return (
                                    item.data ?
                                        item.data.qattaID != undefined || item.data.qattaID != null ?
                                            this.renderQatta(item, index)
                                            :
                                            item.data.aljameiaID != undefined || item.data.aljameiaID != null ?
                                                this.renderGamaya(item, index)
                                                :
                                                this.renderDoraya(item, index)
                                        : null
                                )
                            })

                            :

                            this.state.ModelsPaginated.map((item, index) => {
                                return (
                                    item.data ?
                                        item.data.worth != undefined || item.data.worth != null ?
                                            this.renderQatta(item, index)
                                            :
                                            item.data.aljameiaAmount != undefined || item.data.aljameiaAmount != null ?
                                                this.renderGamaya(item, index)
                                                :
                                                this.renderDoraya(item, index)
                                        : null
                                )
                            })
                    }

                    {
                        // !this.props.Processing ?
                        this.state.pageCounter < this.state.Models.length ?
                            <TouchableOpacity
                                style={[styles.flex, { padding: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: '#81C32E', marginHorizontal: 18, marginTop: 20, marginBottom: 14 }]}
                                onPress={() => this.loadMore()}
                            >
                                <Text style={{ color: '#FFF' }}>
                                    {this.Language != "EN" ? "عرض المزيد" : "Load More"}
                                </Text>
                            </TouchableOpacity>
                            :
                            <View></View>
                        // :
                        // <View></View>
                    }

                </ScrollView>

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
export default connect(mapStateToProps, {})(OdwayaMain)

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


