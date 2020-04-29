import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase'

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Processing: false,
            notifications: []
        };
    }

    UNSAFE_componentWillMount() {
        firebase.notifications().setBadge(0)
        if (this.props.User.isMember) {
            this.getNotificationsByMember()
        } else {
            this.getNotifications()
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('Home');
        return true;
    }

    acceptPaymentQatta(mobile, qattaID, id) {
        const thisComponent = this
        // console.log(mobile)
        thisComponent.setState({ Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/memberQattaPaidAccept', {
                mobile, qattaID, id
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.getNotifications()
                // thisComponent.props.navigation.navigate('QattaMain')
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

    getNotifications() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getNotificationbyManager", {
                params: {
                    managerID: thisComponent.props.User._id
                }
            }).then(function (response) {
                thisComponent.setState({ notifications: response.data, Processing: false })
                console.log(response.data)
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

    getNotificationsByMember() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getNotificationbyMember", {
                params: {
                    memberID: thisComponent.props.User._id
                }
            }).then(function (response) {
                thisComponent.setState({ notifications: response.data, Processing: false })
                console.log(response.data)
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

    deleteNotification() {
        if (this.props.User.isMember) {
            this.deleteNotificationsMember()
        } else {
            this.deleteNotificationsManager()
        }
    }

    deleteNotificationsMember() {

        Alert.alert(
            this.props.Language != "EN" ? "مسح الاشعارات" : "Delete Notifications",
            this.props.Language != "EN" ? "هل تريد حقا مسح الاشعارات" : "You are about to delete Notifications",
            [
                {
                    text: this.props.Language != "EN" ? "الغاء" : 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: this.props.Language != "EN" ? "نعم" : 'OK', onPress: () => {

                        const thisComponent = this

                        thisComponent.setState({ Processing: true })
                        try {
                            axios.get('http://167.172.183.142/api/user/deleteMemberNotify', {
                                params: {
                                    memberID: thisComponent.props.User._id
                                }
                            }).then(function (response) {
                                console.log(response)
                                thisComponent.setState({ Processing: false })
                                thisComponent.props.navigation.navigate('Home')
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
                },
            ],
            { cancelable: false },
        );
    }

    deleteNotificationsManager() {

        Alert.alert(
            this.props.Language != "EN" ? "مسح الاشعارات" : "Delete Notifications",
            this.props.Language != "EN" ? "هل تريد حقا مسح الاشعارات" : "You are about to delete Notifications",
            [
                {
                    text: this.props.Language != "EN" ? "الغاء" : 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: this.props.Language != "EN" ? "نعم" : 'OK', onPress: () => {

                        const thisComponent = this

                        thisComponent.setState({ Processing: true })
                        try {
                            axios.get('http://167.172.183.142/api/user/deleteManagerNotify', {
                                params: {
                                    managerID: thisComponent.props.User._id
                                }
                            }).then(function (response) {
                                console.log(response)
                                thisComponent.setState({ Processing: false })
                                thisComponent.props.navigation.navigate('Home')
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
                },
            ],
            { cancelable: false },
        );
    }

    Language = this.props.Language ? this.props.Language : "AR"

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "الأشعارات" : "Notifications"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    notifyType1(item, index) {
        return (
            <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 10 }]} >
                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, styles.shadow, { width: '95%', padding: 8, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', elevation: 3 }]} >

                    <View style={[styles.column, { height: '100%', padding: 4, backgroundColor: '#FFF', alignItems: 'center' }]} >
                        <Image source={require('./../../../Images/B.png')} style={{ width: 60, height: 80, resizeMode: 'stretch' }} />
                        <Text style={{ color: '#017ED4', fontSize: 24, textAlign: 'right', marginTop: 4 }} >{this.Language != "EN" ? "القطة" : "Qatta"}</Text>
                    </View>

                    <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'space-between' }]} >

                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', backgroundColor: '#FFF', justifyContent: 'flex-start' }]} >
                            <Text>{
                                new Date(item.createdAt).getDate()
                                + '-' +
                                (new Date(item.createdAt).getMonth() + 1)
                                + '-' +
                                new Date(item.createdAt).getFullYear()
                            }</Text>
                        </View>

                        <View style={{ width: '100%' }} >
                            <View style={[styles.row, { width: '100%', backgroundColor: '#FFF', justifyContent: 'center', marginBottom: 6 }]} >
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }} >{item.title}</Text>
                            </View>

                            <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', backgroundColor: '#FFF', justifyContent: 'flex-end', paddingHorizontal: 12 }]} >
                                <Text style={[this.Language != "EN" ? { textAlign: 'right' } : { textAlign: 'left' }, { fontSize: 14 }]} >{this.Language != "EN" ? item.msgAR : item.msg}</Text>
                            </View>
                        </View>

                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', backgroundColor: '#FFF', justifyContent: 'flex-start' }]} >
                            <TouchableOpacity style={{ paddingVertical: 4, paddingHorizontal: 24, borderRadius: 16, borderWidth: 3, borderColor: "#0069B1", marginHorizontal: 4 }} >
                                <Text>{this.Language != "EN" ? "لا" : "No"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.acceptPaymentQatta(item.memberID.mobile, item.modelID, item._id)} style={{ paddingVertical: 4, paddingHorizontal: 24, borderRadius: 16, borderWidth: 3, borderColor: "#0069B1", marginHorizontal: 4 }} >
                                <Text>{this.Language != "EN" ? "نعم" : "Yes"}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </View>
        )
    }

    notifyType3(item, index) {
        return (
            <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 10 }]} >
                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, styles.shadow, { width: '95%', padding: 8, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', elevation: 3 }]} >

                    <View style={[styles.column, { height: '100%', padding: 4, backgroundColor: '#FFF', alignItems: 'center' }]} >
                        <Image source={require('./../../../Images/C.png')} style={{ width: 60, height: 80, resizeMode: 'stretch' }} />
                        <Text style={{ color: '#00C4CA', fontSize: 24, textAlign: 'right', marginTop: 4 }} >{this.Language != "EN" ? "الدورية" : "Doraya"}</Text>
                    </View>

                    <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'flex-start' }]} >

                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', backgroundColor: '#FFF', justifyContent: 'flex-start' }]} >
                            <Text>{
                                new Date(item.createdAt).getDate()
                                + '-' +
                                (new Date(item.createdAt).getMonth() + 1)
                                + '-' +
                                new Date(item.createdAt).getFullYear()
                            }</Text>
                        </View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', marginTop: 8 }]} >

                            <View style={{ flex: 1 }} >
                                <View style={[styles.row, { width: '100%', backgroundColor: '#FFF', justifyContent: 'center', marginBottom: 6 }]} >
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }} >{item.title}</Text>
                                </View>

                                <View style={[styles.row, { width: '100%', backgroundColor: '#FFF', justifyContent: 'flex-end' }]} >
                                    <Text style={{ fontSize: 14, textAlign: 'center' }} >{this.Language != "EN" ? item.msgAR : item.msg}</Text>
                                </View>
                            </View>

                            {/* <View style={{ marginRight: 4 }}>
                                <View style={{ width: 50, height: 50, borderRadius: 25, borderColor: '#000', borderWidth: 1, overflow: 'hidden' }} >
                                    <Image source={require('./../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                </View>
                                <Text style={{ color: '#0C546A', fontWeight: 'bold' }} >{"عمار أحمد"}</Text>
                            </View> */}


                        </View>

                    </View>

                </View>
            </View>
        )
    }

    notifyType5(item, index) {
        return (
            <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 10 }]} >
                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, styles.shadow, { width: '95%', padding: 8, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', elevation: 3 }]} >

                    <View style={[styles.column, { height: '100%', padding: 4, backgroundColor: '#FFF', alignItems: 'center' }]} >
                        <Image source={require('./../../../Images/B.png')} style={{ width: 60, height: 80, resizeMode: 'stretch' }} />
                        <Text style={{ color: '#017ED4', fontSize: 24, textAlign: 'right', marginTop: 4 }} >{this.Language != "EN" ? "القطة" : "َQatta"}</Text>
                    </View>

                    <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'flex-start' }]} >

                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', backgroundColor: '#FFF', justifyContent: 'flex-start' }]} >
                            <Text>{
                                new Date(item.createdAt).getDate()
                                + '-' +
                                (new Date(item.createdAt).getMonth() + 1)
                                + '-' +
                                new Date(item.createdAt).getFullYear()
                            }</Text>
                        </View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', marginTop: 8 }]} >

                            <View style={{ flex: 1 }} >
                                <View style={[styles.row, { width: '100%', backgroundColor: '#FFF', justifyContent: 'center', marginBottom: 6 }]} >
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }} >{item.title}</Text>
                                </View>

                                <View style={[styles.row, { width: '100%', backgroundColor: '#FFF', justifyContent: 'flex-end' }]} >
                                    <Text style={{ fontSize: 14, textAlign: 'center' }} >{this.Language != "EN" ? item.msgAR : item.msg}</Text>
                                </View>
                            </View>

                            {/* <View style={{ marginRight: 4 }}>
                                <View style={{ width: 50, height: 50, borderRadius: 25, borderColor: '#000', borderWidth: 1, overflow: 'hidden' }} >
                                    <Image source={require('./../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                </View>
                                <Text style={{ color: '#0C546A', fontWeight: 'bold' }} >{"عمار أحمد"}</Text>
                            </View> */}


                        </View>

                    </View>

                </View>
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 12, alignItems: 'center' }} >
                    {
                        this.state.notifications.map((item, index) => {
                            {
                                if (item.notifyType && item.notifyType == 1) {
                                    return (this.notifyType1(item, index))
                                } else if (item.notifyType && item.notifyType == 3) {
                                    return (this.notifyType3(item, index))
                                } else if (item.notifyType && item.notifyType == 5) {
                                    return (this.notifyType5(item, index))
                                }
                            }
                        })
                    }

                    <Text onPress={() => { this.deleteNotification() }} style={{ fontSize: 18, marginTop: 12, textDecorationLine: 'underline', }} >{this.Language != "EN" ? "مسح الاشعارات" : "Delete Notifications"}</Text>

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
export default connect(mapStateToProps, {})(Notifications)

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