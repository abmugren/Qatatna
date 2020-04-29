import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, Linking, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
// import Spinner from 'react-native-loading-spinner-overlay';
// import axios from 'axios'
// axios.defaults.timeout = 10000

class Subscribe extends Component {
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
        this.props.navigation.navigate('Settings');
        return true;
    }

    // pay() {
    //     const thisComponent = this
    //     thisComponent.setState({ Processing: true })
    //     try {
    //         axios.post('http://167.172.183.142/api/user/register', {

    //         }).then(function (response) {
    //             console.log(response)
    //             thisComponent.setState({ Processing: false })
    //         }).catch(function (error) {
    //             // console.log(error)
    //             thisComponent.setState({ Processing: false })
    //             if (error.response && error.response.data && error.response.data.message) {
    //                 setTimeout(() => {
    //                     alert('Oops! ' + error.response.data.message);
    //                 }, 100);
    //             } else {
    //                 setTimeout(() => {
    //                     alert('Oops! ' + "Network error");
    //                 }, 100);
    //             }
    //         })
    //     } catch (error) {
    //         // console.log(error)
    //         thisComponent.setState({ Processing: false })
    //         setTimeout(() => {
    //             alert('Oops! ' + "Something went wrong");
    //         }, 100);
    //     }
    // }

    Language = this.props.Language ? this.props.Language : "AR"

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "أعدادات" : "Settings"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                {/* <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                /> */}
                <View style={[styles.column, { height: height - 160, width, backgroundColor: '#CCC' }]} >

                    <View style={[styles.column, { flex: 0.35, width: '100%', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, }]} >
                        <View style={[styles.row, { width: '90%', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }]}>
                            <View
                                style={{
                                    borderBottomColor: '#707070',
                                    borderBottomWidth: 2,
                                    flex: 1, marginHorizontal: 0
                                }}
                            />
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, }}>
                                {this.Language != "EN" ? "الأشتراك" : "Subscribtion"}
                            </Text>
                            <View
                                style={{
                                    borderBottomColor: '#707070',
                                    borderBottomWidth: 2,
                                    flex: 1, marginHorizontal: 0
                                }}
                            />
                        </View>
                        <View style={[styles.row, { flex: 1, backgroundColor: '#FFF', width: '80%' }]} >
                            {/* <View style={[styles.column, { flex: 1, backgroundColor: '#DEFFB4', marginHorizontal: 4, borderRadius: 18, borderWidth: 4, borderColor: "#8AD032", justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                <Text style={{ color: '#636363', fontWeight: 'bold', fontSize: 18 }} >{this.Language != "EN" ? "نصف سنوى" : "Half yearly"}</Text>
                                <Text style={{ color: '#636363', fontWeight: 'bold', fontSize: 12 }} >{"50"}{ this.Language != "EN" ? " ريال سعودى " : " SAR "}</Text>
                                <TouchableOpacity style={{ width: '70%', height: '25%', backgroundColor: '#8AD032', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ color: '#FFF', fontWeight: 'bold' }} >{this.Language != "EN" ? "أشترك" : "Subscribe"}</Text>
                                </TouchableOpacity>
                            </View> */}
                            <View style={[styles.column, { flex: 1, backgroundColor: '#8AD032', marginHorizontal: 4, borderRadius: 18, borderWidth: 4, borderColor: "#8AD032", justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 18 }} >{this.Language != "EN" ? "سنوى" : "Yearly"}</Text>
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }} >{"30"}{this.Language != "EN" ? " ريال سعودى " : " SAR "}</Text>
                                <TouchableOpacity style={{ width: '70%', height: '25%', backgroundColor: '#FFF', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ color: '#8AD032', fontWeight: 'bold' }} >{this.Language != "EN" ? "أشترك" : "Subscribe"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                    <View style={[{ flex: 0.65, width: '100%', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.shadow, styles.column, { width: '90%', height: '90%', backgroundColor: '#FFF', justifyContent: 'space-evenly', alignItems: 'center' }]} >
                            <View style={[styles.row, { flex: 0.2, justifyContent: 'center', alignItems: 'center' }]} >
                                <Text style={{ fontSize: 18 }} > {this.Language != "EN" ? "أشتراك سنوى" : "Yearly subscribtion"} </Text>
                            </View>
                            <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 0.3, backgroundColor: '#FFF', width: '80%', justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                <View style={[styles.column, { width: '50%', height: '100%', backgroundColor: '#FFF', padding: 6, justifyContent: 'center', alignItems: 'center' }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }]} >
                                        <Image source={require('./../../../../Images/calendar.png')} style={{ width: 24, height: 24 }} />
                                        <Text style={{ color: '#8B8B8B', fontSize: 14, marginHorizontal: 6 }} >{this.Language != "EN" ? "سارى حتى" : "To"}</Text>
                                    </View>
                                    <View style={{ width: '95%', height: 40, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E9E9E9', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: '#0C546A', fontSize: 14 }} >{"11/11/2020"}</Text>
                                    </View>
                                </View>
                                <View style={[styles.column, { width: '50%', height: '100%', backgroundColor: '#FFF', padding: 6, justifyContent: 'center', alignItems: 'center' }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }]} >
                                        <Image source={require('./../../../../Images/calendar.png')} style={{ width: 24, height: 24 }} />
                                        <Text style={{ color: '#8B8B8B', fontSize: 14, marginHorizontal: 6 }} >{this.Language != "EN" ? "تاريخ الأشتراك" : "From"}</Text>
                                    </View>
                                    <View style={{ width: '95%', height: 40, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E9E9E9', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ color: '#0C546A', fontSize: 14 }} >{"11/11/2020"}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.row, { width: '80%' }]} >
                                <View
                                    style={{
                                        borderBottomColor: '#707070',
                                        borderBottomWidth: 2,
                                        flex: 1
                                    }}
                                />
                            </View>
                            <View style={[styles.column, { flex: 0.3, width: '80%', justifyContent: 'center' }, this.Language != "EN" ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]} >
                                <Text style={[{ fontSize: 16, color: '#8B8B8B', fontWeight: 'bold', }, this.Language != "EN" ? { textAlign: 'right' } : { textAlign: 'left' }]} > {this.Language != "EN" ? "ملحوظة" : "Note"} </Text>
                                <Text style={[{ fontSize: 14, color: '#8B8B8B', fontWeight: 'bold' }, this.Language != "EN" ? { textAlign: 'right' } : { textAlign: 'left' }]} > {this.Language != "EN" ? "سيتم التذكير بميعاد التجديد قبل أنتهاء الأشتراك بشهر" : "We will remember you before subscription expires"} </Text>
                            </View>
                        </View>
                    </View>

                </View>


                <View style={{ position: 'absolute', bottom: 0, left: 0, width, height: 65, backgroundColor: '#81C32E', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity
                            onPress={() => Linking.openURL('http://138.68.107.172/html/payment3.html?managerID='+this.props.User._id).catch(err => console.error('An error occurred', err))}
                            // onPress={() => { this.props.navigation.navigate('Payment') }}
                            style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 1, paddingHorizontal: 12 }]}
                        >
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "تجديد الأشتراك" : "Renew subscribtion"}</Text>
                        </TouchableOpacity>
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
export default connect(mapStateToProps, {})(Subscribe)

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