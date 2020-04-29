import React, { Component } from 'react';
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { SafeAreaView, ScrollView, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { connect } from 'react-redux' // redux

import Home from './Home/Home'
import Qatta from './Home/Qatta'
import Inbox from './Home/Inbox'
import Settings from './Home/Settings'
import About from './Home/About'
import Contact from './Home/Contact'
import Share from './Home/Share'
import Logout from './Home/Logout';

import GroupInfo from './Home/Groups/GroupInfo'
import EnterPrices from './Home/Groups/EnterPrices'
import Subscribe from './Home/Groups/Subscribe'
import Payment from './Home/Groups/Payment'
import SendMessage from './Home/Groups/SendMessage'
import Notifications from './Home/Notifications'

import QattaMain from './Home/HomeMain/QattaMain'
import DorayaMain from './Home/HomeMain/DorayaMain'
import GamayaMain from './Home/HomeMain/GamayaMain'
import OdwayaMain from './Home/HomeMain/OdwayaMain'

import GamayaHome from './Home/HomeMain/Gamaya/GamayaHome'
import GamayaHomeManager from './Home/HomeMain/Gamaya/GamayaHomeManager'
import GamayaEdit from './Home/HomeMain/Gamaya/GamayaEdit'
import GamayaAdd from './Home/HomeMain/Gamaya/GamayaAdd'
import GamayaMembers from './Home/HomeMain/Gamaya/GamayaMembers'
import GamayaEditMembers from './Home/HomeMain/Gamaya/GamayaEditMembers'
import GamayaHomeManagerEdit from './Home/HomeMain/Gamaya/GamayaHomeManagerEdit'

import OdwayaHome from './Home/HomeMain/Odwaya/OdwayaHome'
import OdwayaProfile from './Home/HomeMain/Odwaya/OdwayaProfile'

import QattaHome from './Home/HomeMain/Qatta/QattaHome'
import QattaEdit from './Home/HomeMain/Qatta/QattaEdit'
import QattaEditMembers from './Home/HomeMain/Qatta/QattaEditMembers'
import QattaAdd from './Home/HomeMain/Qatta/QattaAdd'
import QattaAddMembers from './Home/HomeMain/Qatta/QattaAddMembers'

import DorayaHome from './Home/HomeMain/Doraya/DorayaHome'
import DorayaMembers from './Home/HomeMain/Doraya/DorayaMembers'
import DorayaEdit from './Home/HomeMain/Doraya/DorayaEdit'
import DorayaEditMembers from './Home/HomeMain/Doraya/DorayaEditMembers'
import DorayaAdd from './Home/HomeMain/Doraya/DorayaAdd'
import DorayaAddMembers from './Home/HomeMain/Doraya/DorayaAddMembers'
import DorayaMembersAdd from './Home/HomeMain/Doraya/DorayaMembersAdd'

class HomeRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: 0
        };
    }

    AuthenticatedScreens = {
        Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
                header: null,
                //drawerLabel: this.state.Language != "EN" ? 'الرئيسيه' : "Home",
                drawerLabel: false ? // law mosh moshtarek
                    () => null
                    : this.props.Language ? this.props.Language == "AR" ? "الرئيسيه" : "Home" : "الرئيسيه",
                drawerIcon: false ? // law mosh moshtarek
                    () => null
                    : ({ tintColor }) => (
                        <FontAwesome5
                            name="home"
                            size={24}
                            color={'#8AD032'}
                        />
                    ),
            }),
        },
        Qatta: {
            screen: Qatta,
            navigationOptions: ({ navigation }) => ({
                header: null,
                //drawerLabel: this.state.Language != "EN" ? 'القطة' : 'Qatta',
                drawerLabel: false ? // law mosh moshtarek
                    () => null
                    : this.props.Language ? this.props.Language == "AR" ? "إدارة القطة" : "Manage Qatta" : "إدارة القطة",
                drawerIcon: false ? // law mosh moshtarek
                    () => null
                    : ({ tintColor }) => (
                        <Image source={require('./../../Images/5.png')} style={{ width: 24, height: 24 }} />
                    ),
            }),
        },
        Doraya: {
            screen: DorayaMain,
            navigationOptions: ({ navigation }) => ({
                header: null,
                //drawerLabel: this.state.Language != "EN" ? 'الدورية' : 'Doraya',
                drawerLabel: this.props.User.isMember ? // law mosh moshtarek
                    () => null
                    : this.props.Language ? this.props.Language == "AR" ? "إدارة الدورية" : "Manage Doraya" : "إدارة الدورية",
                drawerIcon: this.props.User.isMember ? // law mosh moshtarek
                    () => null
                    : ({ tintColor }) => (
                        <Image source={require('./../../Images/5.png')} style={{ width: 24, height: 24 }} />
                    ),
            }),
        },
        Gamaya: {
            screen: GamayaMain,
            navigationOptions: ({ navigation }) => ({
                header: null,
                //drawerLabel: this.state.Language != "EN" ? 'الجمعية' : 'Gamaya',
                drawerLabel: this.props.User.isMember ? // law mosh moshtarek
                    () => null
                    : this.props.Language ? this.props.Language == "AR" ? "إدارة الجمعية" : "Manage Gamaya" : "إدارة الجمعية",
                drawerIcon: this.props.User.isMember ? // law mosh moshtarek
                    () => null
                    : ({ tintColor }) => (
                        <Image source={require('./../../Images/5.png')} style={{ width: 24, height: 24 }} />
                    ),
            }),
        },
        Inbox: {
            screen: Inbox,
            navigationOptions: ({ navigation }) => ({
                header: null,
                // drawerLabel: this.state.Language != "EN" ? 'صندوق الرسائل' : 'Inbox',
                drawerLabel: this.props.User.membershipStatus == 2 ? // law mosh moshtarek
                    this.props.Language ? this.props.Language == "AR" ? "صندوق الرسائل" : "Inbox" : "صندوق الرسائل"

                    :
                    () => null,
                drawerIcon: this.props.User.membershipStatus == 2 ? // law mosh moshtarek
                    ({ tintColor }) => (
                        <Ionicons
                            name="ios-mail"
                            size={24}
                            color={'#8AD032'}
                        />
                    )
                    :
                    () => null

                ,
            }),
        },
        Subscribe: {
            screen: Subscribe,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: this.props.User.isMember ? this.props.Language ? this.props.Language == "AR" ? "الأشتراك" : "Subscribe" : "الأشتراك" : () => null,
                drawerIcon: this.props.User.isMember ? // law mosh moshtarek
                    ({ tintColor }) => (
                        <Image source={require('./../../Images/5.png')} style={{ width: 24, height: 24 }} />
                    ) : () => null,
                unmountInactiveRoutes: true
            }),
        },
        Settings: {
            screen: Settings,
            navigationOptions: ({ navigation }) => ({
                header: null,
                // drawerLabel: this.state.Language != "EN" ? 'أعدادات' : 'Settings',
                drawerLabel: this.props.Language ? this.props.Language == "AR" ? "أعدادات" : "Settings" : "أعدادات",
                drawerIcon: ({ tintColor }) => (
                    <MaterialIcons
                        name="settings"
                        size={24}
                        color={'#8AD032'}
                    />
                ),
            }),
        },
        About: {
            screen: About,
            navigationOptions: ({ navigation }) => ({
                header: null,
                //drawerLabel: this.state.Language != "EN" ? 'معلومات' : 'About us',
                drawerLabel: this.props.Language ? this.props.Language == "AR" ? "معلومات" : "About us" : "معلومات",
                drawerIcon: ({ tintColor }) => (
                    <Entypo
                        name="info-with-circle"
                        size={24}
                        color={'#8AD032'}
                    />
                ),
            }),
        },
        Contact: {
            screen: Contact,
            navigationOptions: ({ navigation }) => ({
                header: null,
                //drawerLabel: this.state.Language != "EN" ? 'تواصل معنا' : 'Contact us',
                drawerLabel: this.props.Language ? this.props.Language == "AR" ? "تواصل معنا" : "Contact us" : "تواصل معنا",
                drawerIcon: ({ tintColor }) => (
                    <MaterialIcons
                        name="message"
                        size={24}
                        color={'#8AD032'}
                    />
                ),
            }),
        },
        Share: {
            screen: Share,
            navigationOptions: ({ navigation }) => ({
                header: null,
                //drawerLabel: this.state.Language != "EN" ? 'تواصل معنا' : 'Contact us',
                drawerLabel: this.props.Language ? this.props.Language == "AR" ? "مشاركة" : "Share" : "مشاركة",
                drawerIcon: ({ tintColor }) => (
                    <FontAwesome5
                        name="share"
                        size={24}
                        color={'#8AD032'}
                    />
                ),
            }),
        },
        Logout: {
            screen: Logout,
            navigationOptions: ({ navigation }) => ({
                header: null,
                drawerLabel: this.props.Language ? this.props.Language == "AR" ? 'تسجيل الخروج' : 'Logout' : 'تسجيل الخروج',
                drawerIcon: ({ tintColor }) => (
                    <Image source={require('./../../Images/logout.png')} style={{ width: 24, height: 24 }} />
                ),
            }),
        },

        GroupInfo: {
            screen: GroupInfo,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        EnterPrices: {
            screen: EnterPrices,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        // Subscribe: {
        //     screen: Subscribe,
        //     navigationOptions: ({ navigation }) => ({
        //         drawerLabel: () => null,
        //         unmountInactiveRoutes: true
        //     }),
        // },
        Payment: {
            screen: Payment,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        SendMessage: {
            screen: SendMessage,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        Notifications: {
            screen: Notifications,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        QattaMain: {
            screen: QattaMain,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaMain: {
            screen: DorayaMain,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaMain: {
            screen: GamayaMain,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        OdwayaMain: {
            screen: OdwayaMain,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaHome: {
            screen: GamayaHome,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaHomeManager: {
            screen: GamayaHomeManager,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaEdit: {
            screen: GamayaEdit,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaAdd: {
            screen: GamayaAdd,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaMembers: {
            screen: GamayaMembers,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaEditMembers: {
            screen: GamayaEditMembers,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        GamayaHomeManagerEdit: {
            screen: GamayaHomeManagerEdit,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        OdwayaHome: {
            screen: OdwayaHome,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        OdwayaProfile: {
            screen: OdwayaProfile,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        QattaHome: {
            screen: QattaHome,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        QattaEdit: {
            screen: QattaEdit,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        QattaEditMembers: {
            screen: QattaEditMembers,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        QattaAdd: {
            screen: QattaAdd,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        QattaAddMembers: {
            screen: QattaAddMembers,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaHome: {
            screen: DorayaHome,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaMembers: {
            screen: DorayaMembers,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaEdit: {
            screen: DorayaEdit,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaEditMembers: {
            screen: DorayaEditMembers,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaAdd: {
            screen: DorayaAdd,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaAddMembers: {
            screen: DorayaAddMembers,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },
        DorayaMembersAdd: {
            screen: DorayaMembersAdd,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: () => null,
                unmountInactiveRoutes: true
            }),
        },

    }

    render() {
        const thisComponent = this

        CustomDrawerContentComponent = (props) => (
            <Drawer DrawerProps={props} otherProps={thisComponent.props} ></Drawer>
        );

        Routes = createDrawerNavigator(
            this.AuthenticatedScreens,
            {
                contentComponent: CustomDrawerContentComponent,
                initialRouteName: "Home",
                //drawerPosition: this.state.Language != "EN" ? 'right' : 'left',
                drawerPosition: this.props.Language ? this.props.Language == "AR" ? "right" : "left" : "right",
                unmountInactiveRoutes: true,
                contentOptions: {
                    activeTintColor: '#000',
                    itemStyle: {
                        //flexDirection: this.state.Language != "EN" ? 'row-reverse' : 'row'
                        flexDirection: this.props.Language ? this.props.Language == "AR" ? "row-reverse" : "row" : "row-reverse"
                    }
                }
            },
        );

        AppContainer = createAppContainer(Routes);
        return (
            <AppContainer />
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
export default connect(mapStateToProps, {})(HomeRoutes)

import firebase from 'react-native-firebase'
import axios from 'axios'
axios.defaults.timeout = 10000

class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: 0
        };
    }

    async createNotificationListeners() {
        const thisComponent = this
        firebase.notifications().onNotification(async notification => {
            thisComponent.setState({ notifications: thisComponent.state.notifications + 1 })
        });
    }

    onNotificationOpened(props) {
        this.setState({ notifications: 0 })
        props.navigation.navigate('Notifications')
    }

    UNSAFE_componentWillMount() {
        if (this.props.otherProps.User.isMember) {
            this.getNotificationMember()
        } else {
            this.getNotificationManager()
        }
    }

    getNotificationMember = () => {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getNotificationbyMemberSeen", {
                memberID: thisComponent.props.otherProps.User._id
            }).then(response => {
                console.log(response.data.data)
                thisComponent.setState({ notifications: parseInt(response.data.data), Processing: false })
                // thisComponent.setState({ Countries: response.data, Processing: false })
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

    getNotificationManager = () => {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getNotificationbyManagerSeen", {
                memberID: thisComponent.props.otherProps.User._id
            }).then(response => {
                console.log(response.data.data)
                thisComponent.setState({ notifications: parseInt(response.data.data), Processing: false })
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

    componentDidMount() {
        this.createNotificationListeners()
    }

    renderHeader(props) {
        return (  // this.props.Language ? this.props.Language == "AR" ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'} : {flexDirection: 'row'},
            <View style={[this.props.otherProps.Language ? this.props.otherProps.Language == "AR" ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' } : { flexDirection: 'row' }, { height: 150, backgroundColor: '#8AD032', paddingTop: 35, justifyContent: 'flex-end' }]}>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <View style={[this.props.otherProps.Language ? this.props.otherProps.Language == "AR" ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' } : { flexDirection: 'row' }, { justifyContent: 'flex-start', alignItems: 'center' }]}>
                        <TouchableOpacity onPress={() => this.onNotificationOpened(props)} style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 18 }}>
                            <Image source={require('./../../Images/notification.png')} style={{ width: 28, height: 26, resizeMode: 'contain' }} />
                            {
                                this.state.notifications == 0 ? null :
                                    <View style={{ width: 30, height: 30, backgroundColor: "#FFF", justifyContent: 'center', alignItems: 'center', borderRadius: 15, position: 'absolute', top: -20, right: 0 }} >
                                        <Text>{this.state.notifications.toString()}</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={[this.props.otherProps.Language ? this.props.otherProps.Language == "AR" ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' } : { flexDirection: 'row' }, { justifyContent: 'flex-end', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 16, color: '#FFF' }}>{this.props.otherProps.User.fullname}</Text>
                    </View>
                </View>
                <Image source={this.props.otherProps.User.imgPath ? { uri: this.props.otherProps.User.imgPath } : require('./../../Images/user.jpg')}
                    style={{ height: 80, width: 80, borderRadius: 40, borderWidth: 1, borderColor: '#000', marginHorizontal: 12 }}
                />
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                <StatusBar backgroundColor='#000' barStyle="light-content" />
                {this.renderHeader(this.props.DrawerProps)}
                <ScrollView>
                    <DrawerItems {...this.props.DrawerProps} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}