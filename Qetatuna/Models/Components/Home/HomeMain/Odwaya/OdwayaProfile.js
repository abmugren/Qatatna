import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
import CountryPicker from 'react-native-country-picker-modal'
import { Overlay } from 'react-native-elements';
import { Input, Item, Textarea, Picker, Icon } from 'native-base'
import { connect } from 'react-redux' // redux
const { width, height } = Dimensions.get('window')
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

class OdwayaProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePicked: this.props.navigation.getParam("thirdTableId").membersID.imgPath ? { uri: this.props.navigation.getParam("thirdTableId").membersID.imgPath } : require('./../../../../../Images/user.jpg'),
            VisablePicker: false,
            isVisible: false,
            _id: this.props.navigation.getParam("thirdTableId").membersID._id,
            fullname: this.props.navigation.getParam("thirdTableId").membersID.fullname,
            mobile: this.props.navigation.getParam("thirdTableId").membersID.mobile,
            callingCode: this.props.navigation.getParam("thirdTableId").membersID.callingCode,
            countryCode: this.props.navigation.getParam("thirdTableId").membersID.countryCode,
            Processing: false,
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        console.log(this.props.navigation.getParam('thirdTableId'))
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const Id = this.props.navigation.getParam('Id')
        const Type = this.props.navigation.getParam('Type')
        this.props.navigation.navigate('OdwayaHome', { Id, Type });
        return true;
    }

    editUser() {
        const thisComponent = this
        const { _id, fullname, mobile, countryCode, callingCode } = this.state
        alert( this.Language != "EN" ? "تم الحفظ": "User Saved")
        // thisComponent.setState({ Processing: true })
        // try {
        //     axios.put('http://167.172.183.142/api/user/member/' + _id, {
        //         fullname, mobile, countryCode, callingCode
        //     }).then(function (response) {
        //         console.log(response)
        //         alert("User Saved")
        //         thisComponent.setState({ Processing: false })
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

    getUrl(type) {
        if (type == 1) {
            return 'http://167.172.183.142/api/user/editMemberQatta/'
        } else if (type == 2) {
            return 'http://167.172.183.142/api/user/editMemberAljameia/'
        } else {
            return 'http://167.172.183.142/api/user/editMemberDorraya/'
        }

    }

    activate() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        const _id = this.props.navigation.getParam("thirdTableId")._id
        const Type = this.props.navigation.getParam('Type')
        const URL = this.getUrl(Type)
        try {
            axios.put(URL + _id, {
                status: 1
            }).then(function (response) {
                thisComponent.setState({ Processing: false })
                thisComponent.handleBackButtonClick()
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

    deactive() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        const _id = this.props.navigation.getParam("thirdTableId")._id
        const Type = this.props.navigation.getParam('Type')
        const URL = this.getUrl(Type)
        try {
            axios.put(URL + _id, {
                status: 2
            }).then(function (response) {
                thisComponent.setState({ Processing: false })
                thisComponent.handleBackButtonClick()
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

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.props.navigation.getParam("thirdTableId").membersID.fullname}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

    renderSelectedImage() {
        return (
            <Image source={this.state.imagePicked} style={{ flex: 1, height: null, width: null }} />
        )
    }

    renderOverlay = () => {
        return (
            <Overlay
                isVisible={this.state.isVisible}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width={width - 18 * 2}
                borderRadius={34}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View style={[styles.column, { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 24, }]}>


                    <Text onPress={() => this.setState({ isVisible: false })} style={{ color: '#000', fontSize: 22, fontWeight: 'bold', position: 'absolute', left: 10, top: 10 }}>
                        {"×"}
                    </Text>


                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                        <Text style={{ color: '#81C32E', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
                            {this.Language != "EN" ? "أرسال تنبيه" : "Send alert"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View style={[styles.row, { width: '100%', justifyContent: 'center', alignItems: 'center', flex: 0.5, marginVertical: 24 }]}>
                        <View style={[styles.shadow, { flex: 1, backgroundColor: '#FFF', borderRadius: 12 }]} >
                            <Textarea
                                defaultValue={this.state.description}
                                onChangeText={(text) => this.setState({ description: text })}
                                style={{ flex: 1, height: 140 }}
                                placeholder={this.Language != "EN" ? "اكتب هنا" : "Write here"}
                            />
                        </View>
                    </View>

                    <View style={[styles.row, { justifyContent: 'center' }]}>
                        <TouchableOpacity style={[styles.shadow, { width: '50%', backgroundColor: "#E5F1D7", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#81C32E", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "أرسل" : "Send"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                {this.renderOverlay()}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#8AD032', width: width, height: height * 0.2, paddingHorizontal: 8 }]}>
                    <View style={[styles.column, { width: (width / 3) - 16, justifyContent: 'flex-start' }]} >
                        <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ VisablePicker: !this.state.VisablePicker })} style={[styles.shadow, styles.row, { backgroundColor: '#E5F1D7', borderRadius: 12, height: 35, borderWidth: 1, borderColor: '#6DB611', width: (width / 3) - 16, justifyContent: 'space-evenly', alignItems: 'center', marginTop: 12, paddingHorizontal: 8, marginBottom: -12 }]}>
                            <Entypo name="chevron-down" />
                            <Text>{this.Language != "EN" ? "العضوية" : "Membership"}</Text>
                        </TouchableOpacity>
                        {
                            this.state.VisablePicker ?
                                <View style={[styles.column, { borderRadius: 12, overflow: 'hidden' }]} >
                                    <TouchableOpacity
                                        onPress={() => this.activate()}
                                        style={{
                                            width: '100%', backgroundColor: '#FFF', height: 42, borderBottomWidth: 1,
                                            borderBottomColor: '#E5F1D7', justifyContent: 'flex-end',
                                            alignItems: 'center', paddingBottom: 6, paddingHorizontal: 4
                                        }}
                                    >
                                        <Text numberOfLines={1} style={[this.props.navigation.getParam("thirdTableId").status == 1 ? { color: "#8AD032" } : {}]} >{this.Language != "EN" ? "تفعيل العضوية" : "Activate membership"}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.deactive()}
                                        style={{
                                            width: '100%', backgroundColor: '#FFF', height: 30,
                                            justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4
                                        }}
                                    >
                                        <Text numberOfLines={1} style={[this.props.navigation.getParam("thirdTableId").status == 2 ? { color: "#8AD032" } : {}]} >{this.Language != "EN" ? "حذف العضوية" : "Deactivate membership"}</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                        }

                    </View>

                    <View style={[styles.column, { width: (width / 3) - 8, height: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 12 }]} >
                        <Text numberOfLines={1} style={[{ color: '#FFF', fontSize: 18 }, { textAlign: 'right', marginBottom: 4 }]} >{this.props.navigation.getParam("thirdTableId").isPaid && this.props.navigation.getParam("thirdTableId").isPaid == "2" ? this.Language != "EN" ? "تم الدفع" : "Is paid" : this.Language != "EN" ? "لم يدفع" : "Not paid"}</Text>
                        <Text numberOfLines={1} style={[{ color: '#000', fontSize: 18, fontWeight: 'bold' }, { textAlign: 'right' }]} >{this.Language != "EN" ? "عضو غير مشترك" : "Not joint"}</Text>
                    </View>
                    <TouchableOpacity style={[styles.shadow, { width: width * 0.3, height: width * 0.3, borderRadius: width * 0.3 / 2, borderColor: '#000', borderWidth: 1, overflow: 'hidden', position: 'absolute', bottom: -20, left: (width / 2) - (width * 0.3 / 2) }]}>
                        {this.renderSelectedImage()}
                    </TouchableOpacity>
                </View>

                <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 }]} >
                    <View style={[styles.shadow, { backgroundColor: '#FFF', height: '90%', width: '90%' }]} >
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-evenly' }} >

                            <View style={{ width: '100%', marginBottom: height * 0.015 }} >
                                <View style={[styles.row, { width: '100%', paddingHorizontal: 10, marginBottom: height * 0.01, justifyContent: 'center' }]} >
                                    <Text>{this.Language != "EN" ? "الأسم بالكامل" : "Full name"}</Text>
                                </View>

                                <View style={[styles.row, { width: '100%', paddingHorizontal: 10, justifyContent: 'center' }]} >
                                    <View style={[styles.row, { flex: 0.7, justifyContent: 'center', alignItems: 'center' }]} >
                                        <View style={[styles.shadow, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: height * 0.06, minHeight: 35, maxHeight: 60, elevation: 3, shadowOpacity: 0.2 }]}>
                                            <Item style={[{ width: '100%', height: '100%', borderBottomWidth: 0 }]}>
                                                <Input
                                                disabled
                                                    defaultValue={this.state.fullname}
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
                                    <View style={[styles.row, { flex: 0.7, justifyContent: 'center', alignItems: 'center' }]} >
                                        <View style={[styles.shadow, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 8, height: height * 0.06, minHeight: 35, maxHeight: 60, shadowOpacity: 0.2, elevation: 3, }]}>
                                            <View style={[styles.row, { width: '35%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center', borderRightColor: '#d7d7d7', borderRightWidth: 1, borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}>
                                                <View style={{ flex: 0, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Entypo name="chevron-down" style={{ color: '#000', fontSize: 18 }} />
                                                </View>
                                                <Text style={{ fontWeight:'500'}} >{"+" +this.state.callingCode}</Text>
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
                                                    defaultValue={this.state.mobile}
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
                                <TouchableOpacity onPress={() => this.editUser()} activeOpacity={1} style={[styles.shadow, { flex: 0.7, backgroundColor: '#E5F1D7', borderRadius: 12, paddingHorizontal: 9, borderWidth: 1, borderColor: '#6DB611', justifyContent: 'center', marginHorizontal: 18, alignItems: 'center', height: height * 0.06, minHeight: 35, maxHeight: 60 }]}>
                                    <Text style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }} >
                                        {this.Language != "EN" ? "حفظ" : "Save"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </View>

                <View style={{ width, height: 80, backgroundColor: '#81C32E', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >
                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        {/* <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 1, paddingHorizontal: 12 }]}> */}
                        <TouchableOpacity onPress={() => alert(this.Language != "EN" ? "هذه الخدمة غير متاحة للحساب المجانى" : "Sorry this service is not available for free accounts")} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "أرسال تنبيه" : "Send alert"}</Text>
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
    }
}
// redux
export default connect(mapStateToProps, {})(OdwayaProfile)

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