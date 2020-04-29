import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, KeyboardAvoidingView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { Input, Item, Picker, DatePicker } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { Overlay } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay';

class DorayaHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Processing: false,
            selected: null,
            chosenDate: null, //this.props.User.birthday,
            isVisible: false,
            Doraya: this.props.navigation.getParam("Doraya"),
            members: this.props.navigation.getParam("Doraya").membersNumber,
            overlayHeight1: height - 180,
        };
    }

    repeats = [
        { id: 0, dayAr: "الأحد", dayEn: "Sunday" },
        { id: 1, dayAr: "الاثنين", dayEn: "Monday" },
        { id: 2, dayAr: "الثلاثاء", dayEn: "Tuesday" },
        { id: 3, dayAr: "الأربعاء", dayEn: "Wednesday" },
        { id: 4, dayAr: "الخميس", dayEn: "Thursday" },
        { id: 5, dayAr: "الجمعة", dayEn: "Friday" },
        { id: 6, dayAr: "السبت", dayEn: "Saturday" },
    ]

    UNSAFE_componentWillMount() {
        console.log(this.state.Doraya.data)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('DorayaMain');
        return true;
    }

    apologize() {
        const thisComponent = this
        const DorayaMember = this.props.navigation.getParam("DorayaMember")
        console.log(DorayaMember)
        thisComponent.setState({ isVisible: false, Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/memberApologise/', {
                order: DorayaMember.order, dorayaID: DorayaMember.dorayaID
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.handleBackButtonClick()
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

    apologizeAttend() {
        const thisComponent = this
        const DorayaMember = this.props.navigation.getParam("DorayaMember")
        console.log(DorayaMember)
        thisComponent.setState({ isVisible: false, Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/rejectApologiseTwo/', {
                mobile: thisComponent.props.User.mobile, dorayaID: DorayaMember.dorayaID
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.handleBackButtonClick()
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

    renderOverlay = () => {
        return (
            <Overlay
                isVisible={this.state.isVisible}
                windowBackgroundColor="rgba(0, 0, 0, .5)"
                overlayBackgroundColor="#FFF"
                width={width - 18 * 2}
                height={this.state.overlayHeight1 + 45}
                borderRadius={34}
                overlayStyle={{ overflow: 'hidden' }}
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View
                    onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        this.setState({ overlayHeight1: height })
                    }}
                    style={[styles.column, { backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }]}
                >


                    <Text onPress={() => this.setState({ isVisible: false })} style={{ color: '#000', fontSize: 22, fontWeight: 'bold', position: 'absolute', left: 10, top: 10 }}>
                        {"×"}
                    </Text>


                    <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginVertical: 8 }]}>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                        <Text style={{ color: '#00C4CA', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8, }}>
                            {this.Language != "EN" ? "تنبيه" : "Alert"}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                flex: 1, marginHorizontal: 0
                            }}
                        />
                    </View>

                    <View style={[styles.row, { width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 38 }]}>
                        <Text style={{ textAlign: 'center', color: '#707070' }} >
                            {
                                this.Language != "EN" ?
                                    "هل انت متاكد انك تريد الاعتزار عن دورك في هذه الدوريه؟"
                                    :
                                    "Are you sure you want to apologize ?"
                            }
                        </Text>
                    </View>

                    <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'space-evenly', marginVertical: 8 }]}>
                        <TouchableOpacity onPress={() => this.setState({ isVisible: false })} style={[styles.shadow, { width: '40%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#00C4CA", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "الغاء" : "Cancel"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.apologize()} style={[styles.shadow, { width: '40%', backgroundColor: "#DBEDFA", borderRadius: 12, borderWidth: 4, paddingVertical: 8, borderColor: "#00C4CA", justifyContent: 'center', alignItems: 'center' }]} >
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                {this.Language != "EN" ? "نعم , اعتزر" : "Yes"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    Language = this.props.Language ? this.props.Language : "AR"

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "الدوريه" : "Doraya"}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

    render() {
        const num = this.props.User.isMember ? this.state.Doraya.data.dorayaID.dorayaTime : this.state.Doraya.data.dorayaTime
        const DorayaMember = this.props.navigation.getParam("DorayaMember")
        console.log(DorayaMember)
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                {this.renderHeader()}
                {this.renderOverlay()}
                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                    <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }} >
                        {this.Language != "EN" ? 'بيانات الدوريه' : "Doraya details"}
                    </Text>
                    <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                </View>

                <View style={[styles.column, styles.shadow, { width: '90%', flex: 1, backgroundColor: '#FFF', marginVertical: height * 0.025, }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} >

                        <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Image source={require('./../../../../../Images/list.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                            <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "المجموعة" : "Group"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[styles.shadow, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', elevation: 3, borderRadius: 8, justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.15, shadowOffset: { height: 2, width: 0 } }]} >
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#00C4CA' }} >{this.props.User.isMember ? this.state.Doraya.data.dorayaID.group : this.state.Doraya.data.group}</Text>
                            </View>
                        </View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Image source={require('./../../../../../Images/calendar.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                            <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "تاريخ الدوريه القادم" : "Next Doraya"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                <EvilIcons name="calendar" style={{ fontSize: 32, color: '#00C4CA' }} />
                                <Text style={{ textAlign: 'center', color: '#0C546A' }} >
                                    {
                                        DorayaMember ?
                                            new Date(DorayaMember.turnDate).getDate()
                                            + '-' +
                                            parseInt(new Date(DorayaMember.turnDate).getMonth() + 1)
                                            + '-' +
                                            new Date(DorayaMember.turnDate).getFullYear()
                                            :
                                            "00-00-0000"
                                    }
                                </Text>
                                <View style={{ height: 32, width: 32 }} ></View>
                            </View>
                        </View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Ionicons name={"ios-alarm"} style={{ fontSize: 32, color: '#CCC', marginHorizontal: 4, }} />
                            <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "توقيت الدورية" : "Doraya time"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]} >
                                <Text style={{ textAlign: 'center', color: '#0C546A' }} >{(num < 12 ? (num).toString() + ":00 am " : (num == 12 ? 12 : num % 12).toString() + ":00 pm ")}</Text>
                            </View>
                        </View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Image source={require('./../../../../../Images/list.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                            <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "قائمه الادوار" : "Turn list"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#DBF4FA', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center' }]} >

                                <View style={[{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderLeftWidth: 1, borderLeftColor: '#E9E9E9' } : { borderRightWidth: 1, borderRightColor: '#E9E9E9' }]} >
                                    <Text style={{ fontWeight: 'bold', color: '#0C546A' }} >
                                        {
                                            DorayaMember ?
                                                (DorayaMember.order + 1).toString()
                                                :
                                                this.state.members[0] ? "1" : "0"
                                        }
                                    </Text>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, height: '100%', alignItems: 'center' }]} >
                                    <View style={{ height: 30, width: 30, backgroundColor: '#CCC', borderRadius: 15, marginHorizontal: 8, overflow: 'hidden' }} >
                                        <Image
                                            source={
                                                DorayaMember ?
                                                    DorayaMember.membersID.managerID ?
                                                        DorayaMember.membersID.managerID.imgPath ?
                                                            { uri: DorayaMember.membersID.managerID.imgPath }
                                                            :
                                                            require('./../../../../../Images/user.jpg')
                                                        :
                                                        DorayaMember.membersID.imgPath ?
                                                            { uri: DorayaMember.membersID.imgPath }
                                                            // require('./../../../../../Images/user.jpg')
                                                            :
                                                            require('./../../../../../Images/user.jpg')
                                                    :
                                                    require('./../../../../../Images/user.jpg')
                                            }
                                            style={{ width: null, height: null, flex: 1, resizeMode: 'stretch' }}
                                        />
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0C546A' }} >
                                        {
                                            DorayaMember ?
                                                DorayaMember.membersID.managerID ?
                                                    DorayaMember.membersID.managerID.fullname
                                                    :
                                                    DorayaMember.membersID.fullname
                                                :
                                                "..."
                                        }
                                    </Text>
                                </View>


                            </View>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[styles.shadow, this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 3 }]} >
                                <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#00C4CA', fontSize: 16 }} />
                                <Text onPress={() => this.props.navigation.navigate('DorayaMembers', { Doraya: this.state.Doraya, DorayaMember })} style={{ fontSize: 14, fontWeight: 'bold', color: '#00C4CA' }} >{this.Language != "EN" ? "عرض القائمه" : "View menu"}</Text>
                            </View>
                        </View>

                        <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                    </ScrollView>
                </View >

                <Text onPress={() => { this.apologizeAttend() }} style={{ fontSize: 16, marginBottom: 12, textDecorationLine: 'underline', color:'grey', fontWeight:'bold' }} >{this.Language != "EN" ? "اعتذار عن الحضور" : "Apologize from attendance"}</Text>

                <View style={{ width, height: 80, backgroundColor: '#00C4CA', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    {
                        this.props.User.isMember || this.state.Doraya.data.createBy != this.props.User._id ?
                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <TouchableOpacity
                                    onPress={() => {
                                        // console.log( DorayaMember._id)
                                        DorayaMember.membersID.managerID ?
                                            this.props.User._id == DorayaMember.membersID.managerID._id ?
                                                this.setState({ isVisible: true })
                                                :
                                                alert(this.Language != "EN" ? "هذا ليس دورك" : "This is not your turn")
                                            :
                                            this.props.User._id == DorayaMember.membersID._id ?
                                                this.setState({ isVisible: true })
                                                :
                                                alert(this.Language != "EN" ? "هذا ليس دورك" : "This is not your turn")
                                    }}
                                    style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#00A5AA', borderWidth: 1, paddingHorizontal: 12 }]}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "اعتذر" : "Apologize"}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[styles.row, { flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }]} >
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('DorayaEdit', { Doraya: this.state.Doraya, DorayaMember })} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#00A5AA', borderWidth: 1, paddingHorizontal: 12 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "تعديل الدوريه" : "Edit Doraya"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        // console.log( DorayaMember._id)
                                        DorayaMember.membersID.managerID ?
                                            this.props.User._id == DorayaMember.membersID.managerID._id ?
                                                this.setState({ isVisible: true })
                                                :
                                                alert(this.Language != "EN" ? "هذا ليس دورك" : "This is not your turn")
                                            :
                                            this.props.User._id == DorayaMember.membersID._id ?
                                                this.setState({ isVisible: true })
                                                :
                                                alert(this.Language != "EN" ? "هذا ليس دورك" : "This is not your turn")
                                    }}
                                    style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#00A5AA', borderWidth: 1, paddingHorizontal: 12 }]}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "اعتذر" : "Apologize"}</Text>
                                </TouchableOpacity>
                            </View>
                    }

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
export default connect(mapStateToProps, {})(DorayaHome)

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
