import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

class OdwayaHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Members: [],
            Processing: false,
            count: 1
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
        this.props.navigation.navigate('OdwayaMain');
        return true;
    }

    getManagerName() {
        const thisComponent = this
        // thisComponent.setState({ Processing: true })
        const id = thisComponent.props.navigation.getParam('Id').createBy
        try {
            axios.get("http://167.172.183.142/api/user/getmanagerByID", {
                params: {
                    id
                }
            }).then(function (response) {
                thisComponent.setState({ ManagerName: response.data.fullname, ManagerPic: response.data.imgPath, ManagerMobile: response.data.mobile })
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

    getUrl(type) {
        if (type == 1) {
            return 'http://167.172.183.142/api/user/getMembershipQatta'
        } else if (type == 2) {
            return 'http://167.172.183.142/api/user/getMembershipAljameia'
        } else {
            return 'http://167.172.183.142/api/user/getMembershipDorraya'
        }

    }

    goProfile(thirdTableId) {
        const Id = this.props.navigation.getParam('Id')
        const Type = this.props.navigation.getParam('Type')
        this.props.navigation.navigate('OdwayaProfile', { Id, Type, thirdTableId })
    }

    componentDidMount() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        const id = thisComponent.props.navigation.getParam('Id')._id
        const type = thisComponent.props.navigation.getParam('Type')
        const URL = this.getUrl(type)
        console.log(type + " --- " + id)
        try {
            axios.get(URL, {
                params: {
                    id
                }
            }).then(function (response) {
                thisComponent.setState({ Members: response.data, Processing: false })
                thisComponent.getCount()
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

    getCount = async () => {
        let count = 1
        await this.state.Members.map((item, index) => {
            item.membersID && item.membersID.fullname != "0" && item.status != 2 && item.membersID.mobile != this.state.ManagerMobile ?
                count++ : {}
        })
        this.setState({ count })
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
                <View style={[styles.column, { flex: 1, width }]} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#81C32E', fontWeight: 'bold' }} >
                            {this.props.navigation.getParam('Id').group}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center', }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '90%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { height: 80, width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', padding: 10 }]} >
                                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', borderColor: "#81C32E", borderWidth: 3, overflow: 'hidden', marginHorizontal: 10 }} >
                                        <Image source={this.state.ManagerPic ? { uri: this.state.ManagerPic } : require('./../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                    </View>
                                    <View style={[styles.column, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }, { flex: 1, justifyContent: 'space-evenly' }]} >
                                        <Text style={{ color: '#81C32E', fontSize: 18, fontWeight: 'bold' }} >{this.Language != "EN" ? "مدير المجموعة" : "Group Manager"}</Text>
                                        <Text style={{ color: '#707070', fontSize: 16 }} >{this.state.ManagerName}</Text>
                                    </View>

                                </View>

                                <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginVertical: 4 }]} >
                                    <Text style={{ color: '#707070', fontSize: 14, fontWeight: 'bold' }} > {this.state.count} {this.Language != "EN" ? " أعضاء " : " Members "}</Text>
                                </View>

                                <View style={[styles.rowReverse, { flex: 1, marginVertical: 4, flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'flex-start' }]}>

                                    {
                                        this.state.Members.map((item, index) => {
                                            return (
                                                item.membersID && item.membersID.fullname != "0" && item.status != 2 && item.membersID.mobile != this.state.ManagerMobile ?
                                                    <TouchableOpacity key={index.toString()} onPress={() => !this.props.User.isMember && this.props.navigation.getParam('Id').createBy == this.props.User._id ? this.goProfile(item) : {}} style={[styles.column, { width: "30%", aspectRatio: 0.7, backgroundColor: '#FFF', justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                                        {
                                                            item.isPaid == "2" ?
                                                                <Entypo name={"check"} style={{ color: '#81C32E', fontSize: 32, position: 'absolute', top: 10, right: width * 0.1 / 5, zIndex: 1 }} />
                                                                : null
                                                        }
                                                        <View style={{ width: width * 0.2, height: width * 0.2, backgroundColor: '#FFF', borderRadius: width * 0.1, borderWidth: 1, borderColor: "#000", overflow: 'hidden' }} >
                                                            <Image
                                                                source={
                                                                    item.membersID.imgPath ?
                                                                        { uri: item.membersID.imgPath }
                                                                        :
                                                                        require('./../../../../../Images/user.jpg')
                                                                } style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }}
                                                            />
                                                        </View>
                                                        <View style={[styles.column, { alignItems: 'center' }]} >
                                                            <Text style={{ color: '#707070', fontWeight: 'bold' }} >{item.membersID.fullname}</Text>
                                                            <Text style={{ color: '#81C32E', }} >
                                                                {
                                                                    // "تم الدفع"
                                                                    item.isPaid ?
                                                                        item.isPaid == 2 ?
                                                                            this.Language != "EN" ? "تم الدفع" : "Paid"
                                                                            :
                                                                            ""
                                                                        :
                                                                        ""
                                                                }
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity> : null
                                            )

                                        })
                                    }

                                </View>

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
export default connect(mapStateToProps, {})(OdwayaHome)

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