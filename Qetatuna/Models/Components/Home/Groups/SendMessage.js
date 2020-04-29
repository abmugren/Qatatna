import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { Input, Item, Textarea, Picker } from 'native-base'
import CountryPicker from 'react-native-country-picker-modal'
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown'

class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '966',
            cca2: 'SA',
            window: 1,
            mobile: '',
            groupId: null,
            Groups: [],
            Processing: false,
            user: null,
            description: ''
        };
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('Inbox');
        return true;
    }

    Language = this.props.Language ? this.props.Language : "AR"

    sendMessage() {
        if (this.state.groupId) {
            if (this.state.user) {
                if (this.state.description == "") {
                    alert(this.Language != "EN" ? "آكتب رسالتك " : "Write your message")
                } else {
                    if (this.state.user.managerID) {
                        console.log("mobile " + this.state.user.mobile)
                        console.log("memberName " + this.state.user.fullname)
                        console.log("imgPath " + this.state.user.imgPath)
                        console.log("membersID " + this.state.user._id)
                        console.log("groupName " + this.state.groupId.data.group)
                        console.log("description " + this.state.description)
                        console.log("type " + this.state.groupId.type)
                        console.log("createBy " + this.props.User._id)
                        console.log("managerID " + this.state.user.managerID._id)
                        const thisComponent = this
                        thisComponent.setState({ Processing: true })
                        try {
                            axios.post('http://167.172.183.142/api/user/sendAlert', {
                                mobile: this.state.user.mobile,
                                memberName: this.state.user.fullname,
                                imgPath: this.state.user.imgPath,
                                membersID: this.state.user._id,
                                groupName: this.state.groupId.data.group,
                                description: this.state.description,
                                type: this.state.groupId.type,
                                createBy: this.props.User._id,
                                managerID: this.state.user.managerID._id,
                            }).then(function (response) {
                                console.log(response)
                                thisComponent.setState({ Processing: false })
                                thisComponent.props.navigation.navigate('Inbox')
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
                            console.log(error)
                            thisComponent.setState({ Processing: false })
                            setTimeout(() => {
                                alert('Oops! ' + "Something went wrong");
                            }, 100);
                        }
                    } else {
                        console.log("mobile " + this.state.user.mobile)
                        console.log("memberName " + this.state.user.fullname)
                        console.log("imgPath " + this.state.user.imgPath)
                        console.log("membersID " + this.state.user._id)
                        console.log("groupName " + this.state.groupId.data.group)
                        console.log("description " + this.state.description)
                        console.log("type " + this.state.groupId.type)
                        console.log("createBy " + this.props.User._id)
                        const thisComponent = this
                        thisComponent.setState({ Processing: true })
                        try {
                            axios.post('http://167.172.183.142/api/user/sendAlert', {
                                mobile: this.state.user.mobile,
                                memberName: this.state.user.fullname,
                                imgPath: this.state.user.imgPath,
                                membersID: this.state.user._id,
                                groupName: this.state.groupId.data.group,
                                description: this.state.description,
                                type: this.state.groupId.type,
                                createBy: this.props.User._id,
                            }).then(function (response) {
                                console.log(response)
                                thisComponent.setState({ Processing: false })
                                thisComponent.props.navigation.navigate('Inbox')
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
                            console.log(error)
                            thisComponent.setState({ Processing: false })
                            setTimeout(() => {
                                alert('Oops! ' + "Something went wrong");
                            }, 100);
                        }
                    }
                }
            } else {
                alert(this.Language != "EN" ? "آختر العضو اولا" : "Choose Member First")
            }
        } else {
            alert(this.Language != "EN" ? "آختر المجموعه اولا" : "Choose Group First")

        }
    }

    sendMessageMember() {
        if (this.state.groupId) {
            if (this.state.user) {
                if (this.state.description == "") {
                    alert(this.Language != "EN" ? "آكتب رسالتك " : "Write your message")
                } else {

                    const thisComponent = this
                    thisComponent.setState({ Processing: true })
                    try {
                        axios.post('http://167.172.183.142/api/user/sendAlertMember', {
                            mobile: this.state.user.mobile,
                            memberName: this.state.user.fullname,
                            imgPath: this.state.user.imgPath,
                            managerID: this.state.user._id,
                            groupName: this.state.groupId.data.group,
                            description: this.state.description,
                            type: this.state.groupId.type,
                            createBy: this.props.User._id,
                        }).then(function (response) {
                            console.log(response)
                            thisComponent.setState({ Processing: false })
                            thisComponent.props.navigation.navigate('Inbox')
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
                        console.log(error)
                        thisComponent.setState({ Processing: false })
                        setTimeout(() => {
                            alert('Oops! ' + "Something went wrong");
                        }, 100);
                    }
                }
            } else {
                alert(this.Language != "EN" ? "آختر المدير اولا" : "Choose Manager First")
            }
        } else {
            alert(this.Language != "EN" ? "آختر المجموعه اولا" : "Choose Group First")

        }
    }

    searchAsManager() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get('http://167.172.183.142/api/user/getModels', {
                params: {
                    managerID: thisComponent.props.User._id,
                    mobile: thisComponent.state.mobile
                }
            }).then(function (response) {
                thisComponent.setState({ Processing: false })
                if (response.data.length != 0) {
                    thisComponent.setState({ Groups: [...response.data], window: 2 })
                } else {
                    setTimeout(() => {
                        alert(thisComponent.Language != 'EN' ? "العضو غير موجود" : "Member not found")
                    }, 100)
                }
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
            console.log(error)
            thisComponent.setState({ Processing: false })
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

    searchAsMember() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        console.log(thisComponent.props.User._id)
        try {
            axios.get('http://167.172.183.142/api/user/getModelsMember', {
                params: {
                    memberID: thisComponent.props.User._id,
                    mobile: thisComponent.state.mobile
                }
            }).then(function (response) {
                thisComponent.setState({ Processing: false })
                if (response.data.length != 0) {
                    thisComponent.setState({ Groups: [...response.data], window: 2 })
                } else {
                    setTimeout(() => {
                        alert(thisComponent.Language != 'EN' ? "المدير غير موجود" : "Manager not found")
                    }, 100)
                }
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
            console.log(error)
            thisComponent.setState({ Processing: false })
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

    search() {
        if (this.state.mobile.length < 5) {
            alert(this.Language != "EN" ? "اكتب رقم هاتف صحيح" : "Enter A Valid mobile")
        } else {
            this.props.User.isMember ?
                this.searchAsMember()
                :
                this.searchAsManager()
        }
    }

    lastStep(value) {
        const thisComponent = this
        thisComponent.setState({ Processing: true, window: 4 })
        if (this.props.User.isMember) {
            try {
                axios.get('http://167.172.183.142/api/user/getManagerByMobile', {
                    params: {
                        mobile: thisComponent.state.mobile
                    }
                }).then(function (response) {
                    thisComponent.setState({ Processing: false, user: response.data, groupId: value, window: 3 })
                    console.log(response.data)
                }).catch(function (error) {
                    console.log(error)
                    thisComponent.setState({ Processing: false, window: 2 })
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
                thisComponent.setState({ Processing: false, window: 2 })
                setTimeout(() => {
                    alert('Oops! ' + "Something went wrong");
                }, 100);
            }
        } else {
            try {
                axios.get('http://167.172.183.142/api/user/getMemberByMobile', {
                    params: {
                        mobile: thisComponent.state.mobile
                    }
                }).then(function (response) {
                    thisComponent.setState({ Processing: false, user: response.data, groupId: value, window: 3 })
                    console.log(response.data)
                }).catch(function (error) {
                    console.log(error)
                    thisComponent.setState({ Processing: false, window: 2 })
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
                thisComponent.setState({ Processing: false, window: 2 })
                setTimeout(() => {
                    alert('Oops! ' + "Something went wrong");
                }, 100);
            }
        }
    }

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "صندوق الرسائل" : "Inbox"}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <View style={{ flex: 1, width }} >
                    <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                    {this.renderHeader()}
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 65, }} >

                        <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 16 }]} >
                            <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                            <Text style={{ fontSize: 14, color: '#000' }} >
                                {this.Language != "EN" ? 'ارسال تنبيه' : 'Send notification'}
                            </Text>
                            <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        </View>

                        <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 16 }]} >
                            <View style={[styles.shadow, { width: "90%", paddingVertical: 12, backgroundColor: '#FFF' }]} >

                                <View style={[styles.row, { width: '100%', justifyContent: 'center', alignItems: 'center' }]} >
                                    <Text style={{ marginTop: 8 }} >
                                        {
                                            this.props.User.isMember ?
                                                this.Language != "EN" ? "حدد المدير" : "Choose Manager"
                                                :
                                                this.Language != "EN" ? "حدد العضو" : "Choose member"
                                        }
                                    </Text>
                                </View>

                                <View style={[styles.row, { width: '100%', alignItems: 'center', paddingHorizontal: 18 }, this.Language != "EN" ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]} >
                                    <Text style={{ marginTop: 8, color: '#707070' }} >{this.Language != "EN" ? "رقم الجوال" : "Mobile number"}</Text>
                                </View>

                                <View style={[styles.row, { width: '100%', height: 50, backgroundColor: '#FFF', marginVertical: 16, paddingHorizontal: 18, }]} >

                                    <View style={[styles.row, styles.shadow, { flex: 1, shadowOpacity: 0.1, justifyContent: 'center', alignItems: 'center' }]} >
                                        <View style={[styles.shadow, styles.row, { flex: 1, backgroundColor: '#FFF', borderRadius: 12, height: '100%', overflow: 'hidden', elevation: 3 }]}>
                                            <View style={[styles.row, { width: '35%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center', borderRightColor: '#d7d7d7', borderRightWidth: 1, paddingHorizontal: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8 }]}>
                                                <CountryPicker
                                                    countryCode={this.state.cca2}
                                                    translation={'common'}
                                                    withAlphaFilter
                                                    withCallingCodeButton
                                                    withFlagButton={false}
                                                    withCallingCode
                                                    onSelect={(country) => this.setState({ code: country.callingCode, cca2: country.cca2 })}
                                                />
                                                <View style={{ flex: 0, height: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Entypo name="chevron-down" style={{ color: '#000', fontSize: 18 }} />
                                                </View>
                                            </View>
                                            <Item style={[{ width: '60%', height: '100%', borderBottomWidth: 0 }]}>
                                                <Input
                                                    placeholder={this.Language != "EN" ? 'رقم الجوال' : "Mobile"}
                                                    placeholderTextColor={"#E9E9E9"}
                                                    // defaultValue={"504208820"}
                                                    keyboardType="numeric"
                                                    //placeholder = {""}
                                                    style={{ color: '#000' }}
                                                    textAlign={'center'}
                                                    onChangeText={(text) => this.setState({ mobile: text })}
                                                />
                                            </Item>
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.row, { width: '100%', height: 120, justifyContent: 'center', alignItems: 'center', marginVertical: 8 }]} >
                                    {
                                        this.state.window == 1 ?
                                            <TouchableOpacity onPress={() => this.search()} style={[styles.shadow, { backgroundColor: '#FFF', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 12, borderWidth: 4, borderColor: '#81C32E' }]} >
                                                <Text>{this.Language != "EN" ? "بحت" : "Search"}</Text>
                                            </TouchableOpacity>
                                            :
                                            this.state.window == 2 ?
                                                <View style={[styles.shadow, this.Language != "EN" ? styles.row : styles.rowReverse, { backgroundColor: '#FFF', paddingHorizontal: 22, paddingVertical: 0, borderRadius: 12, borderWidth: 4, borderColor: '#81C32E', justifyContent: 'center', alignItems: 'center' }]} >
                                                    <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                                    <ModalDropdown
                                                        // Data => Array
                                                        options={this.state.Groups} // data
                                                        // Default Value => Before Selection
                                                        defaultValue={
                                                            this.Language != "EN" ? "اختر المجموعه" : "Choose group"
                                                        }
                                                        // Selection Process
                                                        onSelect={(index, value) => { this.lastStep(value) }}
                                                        // onSelect={(index, value) => { this.setState({ groupId: value.data._id }) }}
                                                        // Value After Selection
                                                        renderButtonText={(rowData) => (
                                                            rowData.data.group
                                                        )}
                                                        // Styling
                                                        style={{ backgroundColor: '#FFF', height: 40, justifyContent: 'center' }} // abl ma t5tar
                                                        textStyle={{ textAlign: 'center', fontSize: 16, color: '#000' }}
                                                        dropdownStyle={{ width: 180, alignSelf: 'center', height: 160, borderColor: '#D7D7D7', borderWidth: 2, borderRadius: 3, }}
                                                        renderRow={function (rowData, rowID, highlighted) {
                                                            return (
                                                                <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                                                                    <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                                                                        {rowData.data.group}
                                                                    </Text>
                                                                </View>
                                                            );
                                                        }.bind(this)}
                                                    />
                                                </View>
                                                :
                                                this.state.window == 3 ?
                                                    <View style={[styles.shadow, this.Language != "EN" ? styles.row : styles.rowReverse, { width: '90%', height: '100%', backgroundColor: '#FFF', justifyContent: 'space-between' }]} >

                                                        <View style={[styles.row, { height: '100%', flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]} >
                                                            <View style={[styles.column, { height: '100%', width: '100%', padding: 8, justifyContent: 'flex-start' }]} >
                                                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'flex-start', alignItems: 'center' }]} >
                                                                    <Image source={
                                                                        this.state.groupId ?
                                                                            this.state.groupId.type == 1 ?
                                                                                require('./../../../../Images/C.png')
                                                                                :
                                                                                this.state.groupId.type == 2 ?
                                                                                    require('./../../../../Images/B.png')
                                                                                    :
                                                                                    require('./../../../../Images/A.png')
                                                                            :
                                                                            require('./../../../../Images/B.png')
                                                                    }
                                                                        style={{ width: 30, height: 30, resizeMode: 'stretch' }}
                                                                    />
                                                                    <Text style={{ fontSize: 14, marginHorizontal: 6 }} >{this.state.groupId ? this.state.groupId.data.group : ""}</Text>
                                                                </View>
                                                                <View style={[styles.row, { flex: 1, alignItems: 'flex-start', width: '100%' }, this.Language != "EN" ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]} >
                                                                    <Text style={{ fontSize: 24, fontWeight: 'bold' }} >{this.state.user ? this.state.user.fullname : ""}</Text>
                                                                </View>
                                                            </View>

                                                        </View>

                                                        <View style={{ height: '100%', width: 100, justifyContent: 'center', alignItems: 'center' }} >
                                                            <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: "#000" }} >
                                                                <Image source={this.state.user && this.state.user.imgPath ? { uri: this.state.user.imgPath } : require('./../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                                                            </View>
                                                        </View>

                                                    </View>
                                                    : null

                                    }

                                </View>

                            </View>
                        </View>

                        {
                            true ?
                                <View style={[styles.row, { width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }]} >
                                    <View style={[styles.shadow, { flex: 0.8, backgroundColor: '#FFF' }]} >
                                        <Textarea
                                            defaultValue={this.state.description}
                                            onChangeText={(text) => this.setState({ description: text })}
                                            style={[{ flex: 1, height: 140 }, this.Language != "EN" ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                            placeholder={this.Language != "EN" ? "اكتب هنا" : "Write here"}
                                        />
                                    </View>
                                </View>
                                : null
                        }


                    </ScrollView>

                    <View style={{ position: 'absolute', bottom: 0, left: 0, width, height: 80, backgroundColor: '#81C32E', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                        <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                            <TouchableOpacity onPress={() => this.props.User.isMember? this.sendMessageMember() : this.sendMessage()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 1, paddingHorizontal: 12 }]}>

                                <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "أرسل" : "Send"}</Text>

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
export default connect(mapStateToProps, {})(SendMessage)

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