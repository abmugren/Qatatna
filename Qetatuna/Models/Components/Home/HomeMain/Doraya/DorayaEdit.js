import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, KeyboardAvoidingView, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { Picker, DatePicker } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown'

class DorayaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Processing: false,
            Doraya: this.props.navigation.getParam("Doraya"),
            _id: this.props.navigation.getParam("Doraya").data._id,
            group: this.props.navigation.getParam('DorayaEdited') ? this.props.navigation.getParam('DorayaEdited').group : this.props.navigation.getParam("Doraya").data.group,
            dorayaRepeatType: this.props.navigation.getParam('DorayaEdited') ? this.props.navigation.getParam('DorayaEdited').dorayaRepeatType : this.props.navigation.getParam("Doraya").data.dorayaRepeatType,
            repeatsPerWeek: this.props.navigation.getParam('DorayaEdited') ? this.props.navigation.getParam('DorayaEdited').repeatsPerWeek : this.props.navigation.getParam("Doraya").data.repeatsPerWeek,
            date: this.props.navigation.getParam('DorayaEdited') ? this.props.navigation.getParam('DorayaEdited').date : this.props.navigation.getParam("Doraya").data.date,
            dorayaTime: this.props.navigation.getParam('DorayaEdited') ? this.props.navigation.getParam('DorayaEdited').dorayaTime : this.props.navigation.getParam("Doraya").data.dorayaTime,
            members: this.props.navigation.getParam('DorayaEdited') ? this.props.navigation.getParam('DorayaEdited').members : this.props.navigation.getParam("Doraya").membersNumber,
        };
    }

    time = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    repeats = [
        { id: 0, dayAr: "الأحد", dayEn: "Sunday" },
        { id: 1, dayAr: "الاثنين", dayEn: "Monday" },
        { id: 2, dayAr: "الثلاثاء", dayEn: "Tuesday" },
        { id: 3, dayAr: "الأربعاء", dayEn: "Wednesday" },
        { id: 4, dayAr: "الخميس", dayEn: "Thursday" },
        { id: 5, dayAr: "الجمعة", dayEn: "Friday" },
        { id: 6, dayAr: "السبت", dayEn: "Saturday" },
    ]
    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const Doraya = this.props.navigation.getParam("Doraya")
        const DorayaMember = this.props.navigation.getParam("DorayaMember")
        this.props.navigation.navigate('DorayaMain', { Doraya: Doraya, DorayaMember });
        return true;
    }

    componentDidMount() {
        var newArr = []
        this.state.members.map((item, index) => {
            item.membersID ?
                newArr.push(item.membersID)
                :
                newArr.push(item)
        })
        this.setState({ members: newArr })
    }

    addMembers() {
        var newArr = this.state.members
        newArr = this.resortDate(newArr)
        console.log(newArr)
        this.props.navigation.navigate('DorayaEditMembers', {
            Doraya: this.props.navigation.getParam("Doraya"),
            DorayaEdited: {
                group: this.state.group,
                dorayaRepeatType: this.state.dorayaRepeatType,
                repeatsPerWeek: this.state.repeatsPerWeek,
                date: this.state.date,
                dorayaTime: this.state.dorayaTime,
                members: newArr
            }
        })
    }

    setDate = (newDate) => {
        this.setState({ date: newDate });
    }

    deleteGroup() {

        Alert.alert(
            this.props.Language != "EN" ? "مسح المجموعه" : "Delete Group",
            this.props.Language != "EN" ? "هل تريد حقا مسح المجموعه" : "You are about to delete Group",
            [
                {
                    text: this.props.Language != "EN" ? "الغاء" : 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: this.props.Language != "EN" ? "نعم" : 'OK', onPress: () => {

                        const thisComponent = this
                        const id = thisComponent.state._id
                        thisComponent.setState({ Processing: true })
                        try {
                            axios.put('http://167.172.183.142/api/user/deleteDoraya/' + id, {

                            }).then(function (response) {
                                console.log(response)
                                thisComponent.setState({ Processing: false })
                                thisComponent.props.navigation.navigate('DorayaMain')
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

    saveEdits() {

        const { group, dorayaRepeatType, repeatsPerWeek, date, dorayaTime, members } = this.state

        if (group == '') {

            alert(this.Language != "EN" ? 'من فضلك أدخل أسم المجموعة ' : "Please Enter group name")

        } else {

            if (dorayaTime == -1) {

                alert(this.Language != "EN" ? 'من فضلك أدخل توقيت الدورية ' : "Please Add Doraya time")

            } else {

                if (this.state.members.length < 1) {

                    alert(this.Language != "EN" ? "من فضلك اضف اعضاء" : "Please add members")

                } else {

                    this.save()

                }

            }

        }

    }

    nextDayInWeek(x) {
        var now = new Date();
        now.setDate(now.getDate() + (x + (7 - now.getDay())) % 7);
        return now;
    }

    resortDate(members) {
        if (this.state.dorayaRepeatType == 1) {
            members.forEach((item, index) => {
                var nextDay = new Date()
                nextDay.setDate(nextDay.getDate() + index + 1)
                item.turnDate = nextDay
            })
            return members
        } else if (this.state.dorayaRepeatType == 2) {
            members.forEach((item, index) => {
                var nextDay = this.nextDayInWeek(this.state.repeatsPerWeek)
                // var nextDay = new Date()
                nextDay.setDate(nextDay.getDate() + (7 * index))
                item.turnDate = nextDay
            })
            return members
        } else {

            members.forEach((item, index) => {
                if (index == 0) {
                    item.turnDate = this.state.date
                } else {
                    delete item.turnDate;
                }
            })
            return members
            // members[0].turnDate = date
        }
    }

    save() {
        const thisComponent = this
        const { _id, group, dorayaRepeatType, repeatsPerWeek, date, dorayaTime, members } = this.state
        members.forEach((item, index) => {
            item.order = index
        })
        var newArr = this.state.members
        newArr = this.resortDate(newArr)
        console.log(newArr)
        thisComponent.setState({ Processing: true })
        try {
            axios.put('http://167.172.183.142/api/user/editDoraya/' + _id, {
                group, dorayaRepeatType, repeatsPerWeek, date, dorayaTime, members
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.props.navigation.navigate('DorayaMain')
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
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "تعديل الدوريه" : "Edit Doraya"}</Text>
                <TouchableOpacity onPress={() => this.deleteGroup()} style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome name={'trash-o'} style={{ fontSize: 22, color: '#000' }} />
                </TouchableOpacity>
            </View>
        )
    }

    RadioButton(selectedValue) {
        return (
            <TouchableOpacity onPress={() => this.setState({ dorayaRepeatType: selectedValue })} style={[{
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#707070',
                alignItems: 'center',
                justifyContent: 'center',
            }]}>
                {
                    this.state.dorayaRepeatType == selectedValue ?
                        <View style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#00C4CA',
                        }} />
                        : null
                }
            </TouchableOpacity>
        );
    }

    SearchAndGetObjectFromArray(arr, id) {
        return arr.find(obj => obj.id == id)
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                    <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }} >
                        {this.Language != "EN" ? 'بيانات الدورية' : "Doraya details"}
                    </Text>
                    <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                </View>

                <View style={[styles.column, styles.shadow, { width: '90%', flex: 1, backgroundColor: '#FFF', marginVertical: height * 0.025, }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} >

                        <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Image source={require('./../../../../../Images/list.png')} style={{ width: 24, height: 24, }} />
                            <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "المجموعة" : "Group"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <TouchableOpacity onPress={() => this.addMembers()} style={[styles.shadow, { elevation: 2, width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center' }]} >
                                <Text style={{ color: this.state.group != '' ? '#00C4CA' : '#707070', fontWeight: 'bold' }} >{this.state.group != '' ? this.state.group : this.Language != "EN" ? 'ضف المجموعه' : "Add group"}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Image source={require('./../../../../../Images/calendar.png')} style={{ width: 24, height: 24, }} />
                            <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "تكرار الدوريه" : "Doraya Repeat"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', justifyContent: 'space-evenly', alignItems: 'center', overflow: 'hidden' }]} >
                                {this.RadioButton(1)}
                                <Text>{this.Language != "EN" ? "يومي" : "Daily"}</Text>
                                {this.RadioButton(2)}
                                <Text>{this.Language != "EN" ? "اسبوعى" : "Weekly"}</Text>
                                {this.RadioButton(3)}
                                <Text>{this.Language != "EN" ? "غير محدد" : "Not Specified"}</Text>
                            </View>
                        </View>

                        {
                            this.state.dorayaRepeatType == 1 ?

                                <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                        <Text style={{ color: '#0C546A' }} >{this.Language != "EN" ? "ملحوظة: الموعد يتكرر كل يوم " : "Note: Date repeated everyday"}</Text>
                                    </View>
                                </View>

                                :

                                this.state.dorayaRepeatType == 2 ?

                                    <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                                        <View style={[styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                            <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                            <View style={[styles.row, { flex: 1, justifyContent: 'center', height: "100%" }]} >
                                                {/* <Picker
                                                    selectedValue={this.state.repeatsPerWeek ? this.state.repeatsPerWeek : 0}
                                                    mode="dropdown"
                                                    style={[Platform.OS === 'android' ? { marginRight: -75 } : {}, { backgroundColor: '#FFF', flex: 1, height: 38 }]}
                                                    onValueChange={(item, Index) => this.setState({ repeatsPerWeek: item })}
                                                >
                                                    {
                                                        this.repeats.map((item, index) => {
                                                            return (<Picker.Item key={index.toString()} label={(this.Language != "EN" ? item.dayAr : item.dayEn).toString()} color={'#0C546A'} value={item.id} />)
                                                        })
                                                    }
                                                </Picker> */}
                                                <ModalDropdown
                                                    // Data => Array
                                                    options={this.repeats}
                                                    // Default Value => Before Selection
                                                    defaultValue={
                                                        this.Language != "EN" ?
                                                            this.SearchAndGetObjectFromArray(this.repeats, this.state.repeatsPerWeek).dayAr
                                                            :
                                                            this.SearchAndGetObjectFromArray(this.repeats, this.state.repeatsPerWeek).dayEn
                                                    }
                                                    // Selection Process
                                                    onSelect={(index, value) => { this.setState({ repeatsPerWeek: value.id }) }}
                                                    // Value After Selection
                                                    renderButtonText={(rowData) => (
                                                        this.Language != "EN" ?
                                                            rowData.dayAr
                                                            :
                                                            rowData.dayEn
                                                    )}
                                                    // Styling
                                                    style={{ backgroundColor: '#FFF', flex: 1, height: '100%', justifyContent: 'center' }} // abl ma t5tar
                                                    textStyle={{ textAlign: 'center', fontSize: 16, color: '#000' }}
                                                    dropdownStyle={{ width: 180, alignSelf: 'center', height: 160, borderColor: '#D7D7D7', borderWidth: 2, borderRadius: 3, }}
                                                    renderRow={function (rowData, rowID, highlighted) {
                                                        return (
                                                            <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                                                                <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                                                                    {(this.Language != "EN" ? rowData.dayAr : rowData.dayEn).toString()}
                                                                </Text>
                                                            </View>
                                                        );
                                                    }.bind(this)}
                                                />
                                            </View>
                                            <View style={{ width: 14, height: 14, marginHorizontal: 8 }} ></View>
                                        </View>
                                    </View>

                                    :

                                    <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                                        <View style={[styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                            <EvilIcons name="calendar" style={{ fontSize: 32, color: '#00C4CA' }} />
                                            <DatePicker
                                                defaultDate={new Date(this.state.date)}
                                                placeHolderText={!this.state.date ? this.Language != "EN" ? "اختر التاريخ" : "Choose date" : null}
                                                locale={"en"}
                                                timeZoneOffsetInMinutes={undefined}
                                                modalTransparent={false}
                                                animationType={"fade"}
                                                androidMode={"default"}
                                                textStyle={{ color: "#000" }}
                                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                                onDateChange={this.setDate}
                                                disabled={false}
                                            />
                                            <View style={{ width: 32, height: 32 }} ></View>
                                        </View>
                                    </View>

                        }

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Ionicons name={"ios-alarm"} style={{ fontSize: 32, color: '#CCC' }} />
                            <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4, }} >{this.Language != "EN" ? "توقيت الدوريه" : "Doraya time"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                <View style={[styles.row, { flex: 1, justifyContent: 'center', height: "100%" }]} >
                                    {/* <Picker
                                        selectedValue={this.state.dorayaTime ? this.state.dorayaTime : -1}
                                        mode="dropdown"
                                        style={[Platform.OS === 'android' ? { marginRight: -75 } : {}, { backgroundColor: '#FFF', flex: 1, height: 38 }]}
                                        onValueChange={(item, Index) => this.setState({ dorayaTime: item })}
                                    >

                                        <Picker.Item label={this.Language != "EN" ? "حدد التوقيت" : 'Choose date'} color={'#CDCBCB'} value={-1} />
                                        {
                                            this.time.map((item, index) => {
                                                return (<Picker.Item key={index.toString()} label={(item).toString() + ":00"} color={'#0C546A'} value={item} />)
                                            })
                                        }
                                    </Picker> */}
                                    <ModalDropdown
                                        // Data => Array
                                        options={this.time} // data
                                        // Default Value => Before Selection
                                        defaultValue={
                                            this.state.dorayaTime != -1 ?
                                                this.state.dorayaTime.toString() + ":00"
                                                :
                                                this.Language != "EN" ? "حدد التوقيت" : 'Choose time'
                                        }
                                        // Selection Process
                                        onSelect={(index, value) => { this.setState({ dorayaTime: value }) }}
                                        // Value After Selection
                                        renderButtonText={(rowData) => (rowData.toString() + ":00")} // ba3d ma t5tar
                                        // Styling
                                        style={{ backgroundColor: '#FFF', flex: 1, height: '100%', justifyContent: 'center' }} // abl ma t5tar
                                        textStyle={{ textAlign: 'center', fontSize: 16, color: '#000' }}
                                        dropdownStyle={{ width: 180, alignSelf: 'center', height: 160, borderColor: '#D7D7D7', borderWidth: 2, borderRadius: 3, }}
                                        renderRow={function (rowData, rowID, highlighted) {
                                            return (
                                                <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                                                    <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                                                        {rowData.toString() + ":00"}
                                                    </Text>
                                                </View>
                                            );
                                        }.bind(this)}
                                    />
                                </View>
                                <View style={{ width: 14, height: 14, marginHorizontal: 8 }} ></View>
                            </View>
                        </View>

                        <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                            <Image source={require('./../../../../../Images/list.png')} style={{ width: 24, height: 24, }} />
                            <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "قائمه الادوار" : "Members list"}</Text>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#DBF4FA', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center' }]} >

                                <View style={[{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderLeftWidth: 1, borderLeftColor: '#E9E9E9' } : { borderRightWidth: 1, borderRightColor: '#E9E9E9' }]} >
                                    <Text style={{ fontWeight: 'bold', color: '#0C546A' }} >{this.state.members[0] ? "1" : "0"}</Text>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { flex: 1, height: '100%', alignItems: 'center' }]} >
                                    <View style={{ height: 30, width: 30, backgroundColor: '#CCC', borderRadius: 15, marginHorizontal: 8, overflow: 'hidden' }} >
                                        <Image source={require('./../../../../../Images/user.jpg')} style={{ width: null, height: null, flex: 1, resizeMode: 'stretch' }} />
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0C546A' }} >{this.state.members[0] ? this.state.members[0].fullname ? this.state.members[0].fullname : this.state.members[0].membersID.fullname : "..."}</Text>
                                </View>


                            </View>
                        </View>

                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", justifyContent: 'center' }]}>
                            <View style={[styles.shadow, this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 3 }]} >
                                <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#00C4CA', fontSize: 16 }} />
                                <Text onPress={() => this.addMembers()} style={{ fontSize: 14, fontWeight: 'bold', color: '#00C4CA' }} >{this.Language != "EN" ? "عرض القائمه" : "View menu"}</Text>
                            </View>
                        </View>

                        <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                    </ScrollView>
                </View >

                <View style={{ width, height: 80, backgroundColor: '#00C4CA', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.saveEdits()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#00A5AA', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "حفظ التعديلات" : "Save Edits"}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </SafeAreaView>
        );
    }

}

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

//redux
const mapStateToProps = state => {
    return {
        Language: state.LanguageReducer.Language,
        User: state.AuthReducer.User,
    }
}
// redux
export default connect(mapStateToProps, {})(DorayaEdit)