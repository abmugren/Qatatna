import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 1,
            SentMessages: [],
            RecievedMessages: [],
        };
    }

    UNSAFE_componentWillMount() {
        this.getMessages()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    getMessages() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        if (this.props.User.isMember) {
            try {
                axios.all([
                    axios.get('http://167.172.183.142/api/user/getMessagesByMember', {
                        params: {
                            memberID: thisComponent.props.User._id,
                            // mobile: thisComponent.props.User.mobile,
                            // page: thisComponent.state.page,
                            // limit: "4"
                        }
                    }),
                    axios.get('http://167.172.183.142/api/user/getIncomeMassages', {
                        params: {
                            membersID: thisComponent.props.User._id,
                            // mobile: thisComponent.props.User.mobile,
                            // page: thisComponent.state.page,
                            // limit: "4"
                        }
                    })
                ]).then(axios.spread((SentMessages, Recieved) => {
                    thisComponent.setState({ Processing: false })
                    thisComponent.setState({ SentMessages: SentMessages.data, RecievedMessages: Recieved.data })
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
        } else {
            try {
                axios.all([
                    axios.get('http://167.172.183.142/api/user/getMessagesByManager', {
                        params: {
                            managerID: thisComponent.props.User._id,
                            // mobile: thisComponent.props.User.mobile,
                            // page: thisComponent.state.page,
                            // limit: "4"
                        }
                    }),
                    axios.get('http://167.172.183.142/api/user/getIncomeMember', {
                        params: {
                            managerID: thisComponent.props.User._id,
                            // mobile: thisComponent.props.User.mobile,
                            // page: thisComponent.state.page,
                            // limit: "4"
                        }
                    })
                ]).then(axios.spread((SentMessages, Recieved) => {
                    console.log(Recieved)
                    thisComponent.setState({ Processing: false })
                    thisComponent.setState({ SentMessages: SentMessages.data, RecievedMessages: Recieved.data })
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

    Language = this.props.Language ? this.props.Language : "AR"

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "صندوق الرسائل" : "Inbox"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    renderTabs() {
        return (
            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width, height: 65, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18 }]} >
                <View style={[styles.row, { flex: 1, height: '100%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity
                        onPress={() => this.setState({ selectedTab: 1 })}
                        style={[
                            styles.row,
                            this.state.selectedTab == 1 ?
                                { backgroundColor: '#81C32E' }
                                :
                                { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CCC' },
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '85%', height: '40%',
                                borderRadius: 12,
                            }
                        ]}
                    >
                        <Text
                            style={[this.state.selectedTab == 1 ? { color: '#FFF' } : { color: '#000' }, { fontSize: 12, fontWeight: 'bold' }]}
                        >
                            {this.Language != "EN" ? "الوارد" : "Recieved"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.row, { flex: 1, height: '100%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity
                        onPress={() => this.setState({ selectedTab: 2 })}
                        style={[
                            styles.row,
                            this.state.selectedTab == 2 ?
                                { backgroundColor: '#81C32E' }
                                :
                                { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CCC' },
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '85%', height: '40%',
                                borderRadius: 12,
                            }
                        ]}
                    >
                        <Text
                            style={[this.state.selectedTab == 2 ? { color: '#FFF' } : { color: '#000' }, { fontSize: 12, fontWeight: 'bold' }]}
                        >
                            {this.Language != "EN" ? "المرسل" : 'Sent'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderTab1() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }} >

                {/* item */}

                {
                    this.state.RecievedMessages.map((item, index) => {
                        return (
                            <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }]} >
                                <TouchableOpacity style={[this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width: '90%', paddingVertical: 4, backgroundColor: '#FFF', borderRadius: 12, shadowOpacity: 0.1, shadowRadius: 5, marginTop: 4 }]}>

                                    <View style={[styles.column, { flex: 1, padding: 10 }]} >
                                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'flex-start', alignItems: 'center', marginBottom: 4 }]} >
                                            <Image source={item.type == 1 ? require('./../../../Images/C.png') : item.type == 2 ? require('./../../../Images/B.png') : require('./../../../Images/A.png')} style={{ width: 25, height: 25, marginRight: 4 }} />
                                            <Text style={{ fontSize: 16, textAlign: 'left', marginHorizontal: 8 }} >{item.groupName}</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }} >
                                            <Text style={{ fontSize: 16, textAlign: 'center', marginLeft: 12 }} numberOfLines={4} >{item.description}</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.column, { justifyContent: 'flex-start', alignItems: 'center', padding: 4, paddingHorizontal: 12 }]} >
                                        <Text>
                                            {
                                                new Date(item.createdAt).getDate()
                                                + '-' +
                                                new Date(item.createdAt).getMonth()
                                                + '-' +
                                                new Date(item.createdAt).getFullYear()
                                            }
                                        </Text>
                                        <Image source={item.createBy.imgPath ? { uri: item.createBy.imgPath } : require('./../../../Images/user.jpg')} style={{ width: 80, height: 80, borderRadius: 40, marginVertical: 4 }} />
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', }} >{item.createBy.fullname}</Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        )
                    })
                }


            </ScrollView>
        )
    }

    renderTab2() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }} >

                {/* item */}

                {
                    this.state.SentMessages.map((item, index) => {
                        return (
                            <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }]} >
                                <TouchableOpacity style={[this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width: '90%', paddingVertical: 4, backgroundColor: '#FFF', borderRadius: 12, shadowOpacity: 0.1, shadowRadius: 5, marginTop: 4 }]}>

                                    <View style={[styles.column, { flex: 1, padding: 10 }]} >
                                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'flex-start', alignItems: 'center', marginBottom: 4 }]} >
                                            <Image source={item.type == 1 ? require('./../../../Images/C.png') : item.type == 2 ? require('./../../../Images/B.png') : require('./../../../Images/A.png')} style={{ width: 25, height: 25, marginRight: 4 }} />
                                            <Text style={{ fontSize: 16, textAlign: 'left', marginHorizontal: 8 }} >{item.groupName}</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }} >
                                            <Text style={{ fontSize: 16, textAlign: 'center', marginLeft: 12 }} numberOfLines={4} >{item.description}</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.column, { justifyContent: 'flex-start', alignItems: 'center', padding: 4, paddingHorizontal: 12 }]} >
                                        <Text>
                                            {
                                                new Date(item.createdAt).getDate()
                                                + '-' +
                                                new Date(item.createdAt).getMonth()
                                                + '-' +
                                                new Date(item.createdAt).getFullYear()
                                            }
                                        </Text>
                                        <Image source={item.imgPath ? { uri: item.imgPath } : require('./../../../Images/user.jpg')} style={{ width: 80, height: 80, borderRadius: 40, marginVertical: 4 }} />
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', }} >{item.memberName}</Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        )
                    })
                }

            </ScrollView>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <View style={{ flex: 1, width }} >
                    <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                    {this.renderHeader()}
                    {this.renderTabs()}
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    {
                        this.state.selectedTab == 1 ?
                            this.renderTab1()
                            :
                            this.renderTab2()

                    }

                    <View style={{ position: 'absolute', bottom: 0, left: 0, width, height: 80, backgroundColor: '#81C32E', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                        <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SendMessage')} style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: width * 0.5, justifyContent: 'space-between', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 1, paddingHorizontal: 12 }]}>
                                <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{" "}</Text>
                                <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >
                                    {
                                        this.props.User.isMember ?
                                            this.Language != "EN" ? "أرسال بلاغ" : "Send Report"
                                            :
                                            this.Language != "EN" ? "أرسال تنبيه" : "Send notification"
                                    }
                                </Text>
                                <Text style={{ color: '#81C32E', textAlign: 'center', fontSize: 12 }} >{"+"}</Text>
                            </TouchableOpacity>
                        </View>

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
export default connect(mapStateToProps, {})(Inbox)

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
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
})