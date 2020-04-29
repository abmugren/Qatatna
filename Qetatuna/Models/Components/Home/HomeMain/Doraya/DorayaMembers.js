import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import Foundation from 'react-native-vector-icons/Foundation'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay';

class DorayaMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Processing: false,
            Doraya: this.props.navigation.getParam("Doraya"),
            members: this.props.navigation.getParam("Doraya").membersNumber
        };
    }

    UNSAFE_componentWillMount() {
        console.log(this.state.members)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const Doraya = this.props.navigation.getParam("Doraya")
        const DorayaMember = this.props.navigation.getParam("DorayaMember")
        this.props.navigation.navigate('DorayaHome', { Doraya: Doraya, DorayaMember });
        return true;
    }

    Language = this.props.Language ? this.props.Language : "AR"

    acceptApologize() {
        const thisComponent = this
        const dorayaID = this.props.User.isMember ? this.state.Doraya.data.dorayaID._id : this.state.Doraya.data._id
        // console.log(thisComponent.props.navigation.getParam("Doraya"))
        thisComponent.setState({ isVisible: false, Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/acceptApologise/', {
                dorayaID, mobile:thisComponent.props.User.mobile
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.props.navigation.navigate('DorayaMain');
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
            console.log(error)
            thisComponent.setState({ Processing: false })
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

    rejectApologize(item) {
        const thisComponent = this
        const dorayaID = this.props.User.isMember ? this.state.Doraya.data.dorayaID._id : this.state.Doraya.data._id
        // console.log( item.order )
        thisComponent.setState({ isVisible: false, Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/rejectApologise/', {
                dorayaID, mobile:thisComponent.props.User.mobile
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.props.navigation.navigate('DorayaMain');
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
            console.log(error)
            thisComponent.setState({ Processing: false })
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "الدورية" : "Doraya"}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

    render() {
        const DorayaMember = this.props.navigation.getParam("DorayaMember")
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                {this.renderHeader()}
                <View style={[styles.column, { flex: 1, width }]} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 26 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }} >
                            {this.Language != "EN" ? 'قائمه الادوار' : "Turn list"}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '100%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 26 }} >

                                {
                                    this.state.members.map((item, index) => {
                                        return (
                                            <View key={index.toString()} style={[styles.column, { width: '100%', backgroundColor: 'transparent', alignItems: 'center', marginBottom: 12, paddingHorizontal: 18, justifyContent: 'center' }]}>
                                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', height: 40, alignItems: 'center' }]} >
                                                    <View style={[item._id == DorayaMember._id ? { backgroundColor: '#DBF4FA' } : { backgroundColor: '#FFF' }, { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: "#E9E9E9", justifyContent: 'center', alignItems: 'center' }]} >
                                                        <Text style={{ fontWeight: 'bold', color: '#0C546A' }} >{(index + 1).toString()}</Text>
                                                    </View>

                                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, item._id == DorayaMember._id ? { backgroundColor: '#DBF4FA' } : { backgroundColor: '#FFF' }, { height: 40, flex: 2, borderWidth: 1, borderColor: '#E9E9E9', marginHorizontal: 8, borderRadius: 8, alignItems: 'center' }]} >
                                                        <View style={{ height: 30, width: 30, backgroundColor: '#CCC', borderRadius: 15, marginHorizontal: 8, overflow: 'hidden' }} >
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
                                                                style={{ width: null, height: null, flex: 1, resizeMode: 'stretch' }} />
                                                        </View>
                                                        <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', color: '#0C546A' }} >{item.membersID.managerID ? item.membersID.managerID.fullname : item.membersID.fullname}</Text>
                                                    </View>

                                                    <View style={{ flex: 1, height: 40, justifyContent: 'center', alignItems: 'center' }} >
                                                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#0C546A' }} >
                                                            {
                                                                item.turnDate != undefined || item.turnDate != null ?
                                                                    new Date(item.turnDate).getDate()
                                                                    + '-' +
                                                                    parseInt(new Date(item.turnDate).getMonth() + 1)
                                                                    + '-' +
                                                                    new Date(item.turnDate).getFullYear()
                                                                    :
                                                                    "--"
                                                            }
                                                        </Text>
                                                    </View>

                                                </View>
                                                {
                                                    item.aplogise == 2 ?
                                                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', paddingHorizontal: 40, alignItems: 'center' }]} >
                                                            <Foundation name="alert" style={{ fontSize: 22, color: '#8AD032' }} />
                                                            <Text style={{ fontSize: 14, color: '#8AD032', marginHorizontal: 8 }} >{this.Language != "EN" ? "تم الأعتذار" : "Has apologized"}</Text>
                                                        </View>
                                                        : null
                                                }
                                                {
                                                    item.aplogise == 3 ?
                                                        item.membersID.managerID && item.membersID.managerID._id == this.props.User._id ?
                                                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', paddingHorizontal: 40, alignItems: 'center', marginTop: 8 }]} >
                                                                <Text style={{ color: "#707070" }} >{this.Language != "EN" ? "هل تقبل أخد الدور؟" : "Take his Turn?"}</Text>
                                                                <TouchableOpacity onPress={() => this.acceptApologize()} style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#DBEDFA', borderColor: '#00C4CA', borderWidth: 1, borderRadius: 8, marginHorizontal: 8, alignItems: 'center' }} >
                                                                    <Text>{this.Language != "EN" ? "نعم " : "Yes"}</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => this.rejectApologize(item)} style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#DBEDFA', borderColor: '#00C4CA', borderWidth: 1, borderRadius: 8, alignItems: 'center' }} >
                                                                    <Text>{this.Language != "EN" ? "لا " : "No"}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            :
                                                            item.membersID._id == this.props.User._id ?
                                                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', paddingHorizontal: 40, alignItems: 'center', marginTop: 8 }]} >
                                                                <Text style={{ color: "#707070" }} >{this.Language != "EN" ? "هل تقبل أخد الدور؟" : "Take his Turn?"}</Text>
                                                                <TouchableOpacity onPress={() => this.acceptApologize()} style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#DBEDFA', borderColor: '#00C4CA', borderWidth: 1, borderRadius: 8, marginHorizontal: 8, alignItems: 'center' }} >
                                                                    <Text>{this.Language != "EN" ? "نعم " : "Yes"}</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => this.rejectApologize(item)} style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#DBEDFA', borderColor: '#00C4CA', borderWidth: 1, borderRadius: 8, alignItems: 'center' }} >
                                                                    <Text>{this.Language != "EN" ? "لا " : "No"}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            :
                                                            null
                                                        :
                                                    null
                                                }
                                            </View>
                                        )
                                    })
                                }


                                {/* 
                                <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: 12, paddingHorizontal: 18, justifyContent: 'center' }]}>
                                    <View style={[styles.rowReverse, { width: '100%', height: 40, alignItems: 'center' }]} >
                                        <View style={{ width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: "#E9E9E9", justifyContent: 'center', alignItems: 'center', backgroundColor: '#DBF4FA' }} >
                                            <Text style={{ fontWeight: 'bold', color: '#0C546A' }} >3</Text>
                                        </View>

                                        <View style={[styles.rowReverse, { height: 40, flex: 2, borderWidth: 1, borderColor: '#E9E9E9', marginHorizontal: 8, borderRadius: 8, alignItems: 'center', backgroundColor: '#DBF4FA' }]} >
                                            <View style={{ height: 30, width: 30, backgroundColor: '#CCC', borderRadius: 15, marginHorizontal: 8, overflow: 'hidden' }} >
                                                <Image source={require('./../../../../../Images/user.jpg')} style={{ width: null, height: null, flex: 1, resizeMode: 'stretch' }} />
                                            </View>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0C546A' }} >{"عمار احمد"}</Text>
                                        </View>

                                        <View style={{ flex: 1, height: 40, justifyContent: 'center', alignItems: 'center' }} >
                                            <Text style={{ fontSize: 12, color: '#0C546A' }} >{"12/11/1029"}</Text>

                                        </View>

                                    </View>
                                </View> */}

                            </ScrollView>
                        </View>
                    </View>

                </View>

                <View style={{ width, height: 80 }} >

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
export default connect(mapStateToProps, {})(DorayaMembers)

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