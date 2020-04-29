import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleAr: null,
            titleEN: null,
            Processing: false
        };
    }

    componentDidMount() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getTerms").then(response => {
                this.setState({
                    titleAr: response.data[0].titleAr,
                    titleEN: response.data[0].titleEN,
                    Processing: false
                })
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

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "معلومات" : "About us"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    renderText() {
        if (this.Language != "EN") {
            return (
                <Text style={{ color: '#000', fontSize: 16, textAlign: 'right' }} >{this.state.titleAr}</Text>
            )
        } else {
            return (
                <Text style={{ color: '#000', fontSize: 16, textAlign: 'left' }} >{this.state.titleEN}</Text>
            )
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 40, width: width - (18 * 2), marginHorizontal: 12, backgroundColor: '#DBDBDB', paddingHorizontal:12, paddingVertical:12 }]}>
                            <Image source={require('./../../../Images/Logo.png')} style={{ flex: 1, resizeMode: 'contain', aspectRatio:2}} />
                        </View>
                    </View>
                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop:12 }]} >
                        <View style={[styles.flex, styles.row, styles.shadow, { width: width - (12 * 2), marginHorizontal: 12, marginTop: 10, marginBottom: 24, backgroundColor: '#FFF', padding: 18, justifyContent: 'center', shadowOpacity:0.1, borderRadius:12, elevation:5 }]}>
                            {this.renderText(this.props.Language)}
                        </View>
                    </View>
                </ScrollView>
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
export default connect(mapStateToProps, {})(About)

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
    }
})


/*
import { PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts';
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
    } else if(Platform.OS === 'ios') {
        this.getList();
    }
}

getList = () => {
    Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
            console.log("cannot access");
        } else {
            this.setState({ contacts });
            console.log(contacts);
        }
    })
}
*/