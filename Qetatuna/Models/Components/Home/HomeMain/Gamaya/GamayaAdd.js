import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { Input, Item, Picker, DatePicker } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown'

class GamayAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Alarms: [],
            Processing: false,
            group: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').group : '',
            aljameiaType: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').aljameiaType : "1",
            aljameiaAmount: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').aljameiaAmount : '',
            membersNum: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').membersNum : '',
            startDate: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').startDate : new Date(), //this.props.User.birthday,
            alarm: this.props.navigation.getParam('Gamaya') ? this.props.navigation.getParam('Gamaya').alarm : "0",
            members: this.props.navigation.getParam('Gamaya') ?
                this.props.navigation.getParam('Gamaya').members
                :
                [{
                    fullname: this.props.User.fullname,
                    callingCode: this.props.User.callingCode,
                    countryCode: this.props.User.countryCode,
                    mobile: this.props.User.mobile
                }],
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        this.getAllAlarms()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('GamayaMain');
        return true;
    }

    getAllAlarms = () => {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getAllAlarms").then(response => {
                thisComponent.setState({ Alarms: response.data, Processing: false })
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

    SearchAndGetObjectFromArray(arr, id) {
        return arr.find(obj => obj._id == id)
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "الجميعية" : "Gamaya"}</Text>
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
            </View>
        )
    }

    setDate = (newDate) => {
        this.setState({ startDate: newDate });
    }

    addMembers() {
        console.log(this.state.alarm)
        if (this.state.membersNum == '' || parseInt(this.state.membersNum) < 2) {
            alert(this.Language != "EN" ? "أضف عدد الاعضاء" : "Add members number")
        } else {
            if (this.state.aljameiaAmount == '' || parseInt(this.state.aljameiaAmount) < 2) {
                alert(this.Language != "EN" ? "اكتب المبلغ" : "Enter Price")
            } else {
                if (this.state.alarm == '0') {
                    alert(this.Language != "EN" ? "أختر التنبية" : "Choose alarm")
                } else {
                    this.props.navigation.navigate('GamayaMembers', {
                        Gamaya: {
                            group: this.state.group,
                            aljameiaType: this.state.aljameiaType,
                            aljameiaAmount: this.state.aljameiaAmount,
                            membersNum: this.state.membersNum,
                            startDate: this.state.startDate,
                            alarm: this.state.alarm,
                            members: this.state.members,
                            createBy: this.props.User._id,
                        }
                    })
                }
            }
        }
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
                <View style={{ flex: 1, width }}>

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: height * 0.025 }]} >
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                        <Text style={{ fontSize: 18, color: '#000' }} >
                            {this.Language != "EN" ? 'أضافة جمعية' : "Add Gamaya"}
                        </Text>
                        <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                    </View>

                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', paddingHorizontal: 10 }]} >
                        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', borderColor: "#E1D115", borderWidth: 3, overflow: 'hidden' }} >
                            <Image source={this.props.User.imgPath ? { uri: this.props.User.imgPath } : require('./../../../../../Images/user.jpg')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch' }} />
                        </View>
                        <View style={[styles.column, this.Language != "EN" ? { alignItems: 'flex-end', } : { alignItems: 'flex-start', }, { flex: 1, justifyContent: 'space-evenly', marginHorizontal: 10 }]} >
                            <Text style={{ color: '#707070', fontSize: 16, }} >{this.Language != "EN" ? "مدير المجموعة" : "Manager"}</Text>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }} >{this.props.User.fullname}</Text>
                        </View>

                    </View>

                    <View style={[styles.row, { width, flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: height * 0.025 }]} >
                        <View style={[styles.shadow, { backgroundColor: '#FFF', height: '100%', width: '90%' }]} >
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} >

                                <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', paddingHorizontal: "5%", marginBottom: height * 0.015 }]} >
                                    <Text style={{ color: '#707070', fontWeight: 'bold' }} >{this.Language != "EN" ? "نوع الجميعية" : "Gamaya type"}</Text>
                                    <TouchableOpacity onPress={() => this.setState({ aljameiaType: "1" })} style={[this.state.aljameiaType == "1" ? { backgroundColor: '#E1D115', borderWidth: 2, borderColor: "#E1D115" } : { backgroundColor: '#F6F6F6', borderWidth: 2, borderColor: "#DCDCDC" }, { paddingHorizontal: 18, height: height * 0.06, minHeight: 35, maxHeight: 60, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 }]} >
                                        <Text style={[this.state.aljameiaType == 1 ? { color: '#FFF' } : { color: "#707070" }]} >{this.Language != "EN" ? "اسبوعيا" : "Weekly"}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ aljameiaType: "2" })} style={[this.state.aljameiaType == "2" ? { backgroundColor: '#E1D115', borderWidth: 2, borderColor: "#E1D115" } : { backgroundColor: '#F6F6F6', borderWidth: 2, borderColor: "#DCDCDC" }, { paddingHorizontal: 18, height: height * 0.06, minHeight: 35, maxHeight: 60, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }]} >
                                        <Text style={[this.state.aljameiaType == 2 ? { color: '#FFF' } : { color: "#707070" }]} >{this.Language != "EN" ? "شهريا" : "Monthly"}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', paddingHorizontal: "5%", marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '30%', alignItems: 'center' }]} >
                                        <Image source={require('./../../../../../Images/list.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                                        <Text style={{ color: '#707070', fontWeight: 'bold' }} >{this.Language != "EN" ? "المجموعة" : "Group"}</Text>
                                    </View>
                                    <View style={[styles.rowReverse, { width: '70%', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }]}>
                                        <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'center' }]}>
                                            <TouchableOpacity onPress={() => this.addMembers()} style={[styles.shadow, { elevation: 2, width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]} >
                                                <Text style={{ color: this.state.group != '' ? '#0C546A' : '#707070', fontWeight: 'bold' }} >{this.state.group != '' ? this.state.group : this.Language != "EN" ? 'ضف المجموعه' : "Add group"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', paddingHorizontal: "5%", marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '30%', alignItems: 'center' }]} >
                                        <Image source={require('./../../../../../Images/money.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                                        <Text style={{ color: '#707070', fontWeight: 'bold' }} >{this.Language != "EN" ? "المبلغ" : "Price"}</Text>
                                    </View>
                                    <View style={[styles.rowReverse, { width: '70%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'center' }]}>
                                        <View style={{ width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >
                                            <Item style={[{ width: '100%', height: '100%', backgroundColor: '#FFF', borderBottomColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
                                                <Input
                                                    defaultValue={this.state.aljameiaAmount.toString()}
                                                    placeholder={this.Language != "EN" ? 'المبلغ' : "Price"}
                                                    placeholderTextColor={"#E9E9E9"}
                                                    keyboardType="numeric"
                                                    style={{ color: '#0C546A' }} textAlign={'center'}
                                                    onChangeText={(text) => this.setState({ aljameiaAmount: text })}
                                                />
                                            </Item>
                                        </View>
                                    </View>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', paddingHorizontal: "5%", marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '30%', alignItems: 'center' }]} >
                                        <Image source={require('./../../../../../Images/userr.png')} style={{ width: 24, height: 24, marginHorizontal: 4, resizeMode: 'stretch' }} />
                                        <Text style={{ color: '#707070', fontWeight: 'bold', }} >{this.Language != "EN" ? "الاعضاء" : "Members"}</Text>
                                    </View>
                                    <View style={[styles.rowReverse, { width: '70%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'center' }]}>
                                        {
                                            // this.state.aljameiaType == "1" ?
                                            <View style={{ width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >
                                                <Item style={[{ width: '100%', height: '100%', backgroundColor: '#FFF', borderBottomColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
                                                    <Input
                                                        defaultValue={this.state.membersNum.toString()}
                                                        placeholder={this.Language != "EN" ? 'عدد الاعضاء' : "No. of members"}
                                                        placeholderTextColor={"#E9E9E9"}
                                                        keyboardType="numeric"
                                                        style={{ color: '#0C546A' }} textAlign={'center'}
                                                        onChangeText={(text) => this.setState({ membersNum: text })}
                                                    />
                                                </Item>
                                            </View>
                                            // :
                                            // <View style={{ width: '100%', height: 40, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >
                                            //     <Item style={[{ width: '100%', height: '100%', backgroundColor: '#FFF', borderBottomColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
                                            //         <Input
                                            //             defaultValue={this.state.membersNum.toString()}
                                            //             placeholder={this.Language != "EN" ? 'عدد الاعضاء' : "No. of members"}
                                            //             placeholderTextColor={"#E9E9E9"}
                                            //             keyboardType="numeric"
                                            //             style={{ color: '#0C546A' }} textAlign={'center'}
                                            //             onChangeText={(text) => this.setState({ membersNum: text })}
                                            //         />
                                            //     </Item>
                                            // </View>
                                            // <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', height: 40, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]} >
                                            //     <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                            //     <Picker
                                            //         selectedValue={this.state.membersNum ? this.state.membersNum : "2"}
                                            //         mode="dropdown"
                                            //         style={{ backgroundColor: 'transparent', height: '100%', flex: 1 }}
                                            //         onValueChange={(item, Index) => this.setState({ membersNum: item })}
                                            //     >
                                            //         <Picker.Item label={"2"} color={'#0C546A'} value="2" />
                                            //         <Picker.Item label={"3"} color={'#0C546A'} value="3" />
                                            //         <Picker.Item label={"4"} color={'#0C546A'} value="4" />
                                            //         <Picker.Item label={"5"} color={'#0C546A'} value="5" />
                                            //         <Picker.Item label={"6"} color={'#0C546A'} value="6" />
                                            //         <Picker.Item label={"7"} color={'#0C546A'} value="7" />
                                            //         <Picker.Item label={"8"} color={'#0C546A'} value="8" />
                                            //         <Picker.Item label={"9"} color={'#0C546A'} value="9" />
                                            //         <Picker.Item label={"10"} color={'#0C546A'} value="10" />
                                            //         <Picker.Item label={"11"} color={'#0C546A'} value="11" />
                                            //         <Picker.Item label={"12"} color={'#0C546A'} value="12" />
                                            //     </Picker>
                                            //     <View></View>
                                            // </View>
                                        }
                                    </View>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', paddingHorizontal: "5%", marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '30%', alignItems: 'center' }]} >
                                        <Image source={require('./../../../../../Images/calendar.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                                        <Text style={{ color: '#707070', fontWeight: 'bold' }} >{this.Language != "EN" ? "البدايه" : "Starts"}</Text>
                                    </View>
                                    <View style={[styles.rowReverse, { width: '70%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'center' }]}>
                                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                            <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                            <DatePicker
                                                defaultDate={new Date(this.state.startDate)}
                                                placeHolderText={!this.state.startDate ? "اختر التاريخ" : null}
                                                locale={"en"}
                                                timeZoneOffsetInMinutes={undefined}
                                                modalTransparent={false}
                                                animationType={"fade"}
                                                androidMode={"default"}
                                                textStyle={{ color: "#0C546A" }}
                                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                                onDateChange={this.setDate}
                                                disabled={false}
                                            />
                                            <View style={{ width: 14, height: 14, marginHorizontal: 8 }} ></View>
                                        </View>
                                    </View>
                                </View>

                                <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', alignItems: 'center', paddingHorizontal: "5%", marginBottom: height * 0.015 }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '30%', alignItems: 'center' }]} >
                                        <Image source={require('./../../../../../Images/alarm.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                                        <Text style={{ color: '#707070', fontWeight: 'bold' }}
                                        >{this.Language != "EN" ? "التنبيه" : "Alert"}</Text>
                                    </View>
                                    <View style={[styles.rowReverse, { width: '70%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'center' }]}>
                                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                            <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                            <View style={[styles.row, { flex: 1, justifyContent: 'center', height: "90%" }]} >
                                                {/* <Picker
                                                    selectedValue={this.state.alarm ? this.state.alarm : "0"}
                                                    mode="dropdown"
                                                    style={[Platform.OS === 'android' ? { marginRight: -75 } : {}, { backgroundColor: '#FFF', flex: 1, height:38 }]}
                                                    onValueChange={(item, Index) => this.setState({ alarm: item })}
                                                >
                                                    <Picker.Item label={this.Language != "EN" ? "اختر التنبية" : "Choose alarm"} color={'#0C546A'} value="0" />
                                                    {
                                                        this.state.Alarms.map((item, index) => {
                                                            return (
                                                                <Picker.Item
                                                                    label={this.Language != "EN" ? item.titleAR : item.titleEN}
                                                                    value={item._id}
                                                                    color={'#0C546A'}
                                                                    key={index.toString()}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </Picker> */}
                                                <ModalDropdown
                                                    // Data => Array
                                                    options={this.state.Alarms} // data
                                                    // Default Value => Before Selection
                                                    defaultValue={
                                                        this.state.alarm != "0" && this.state.Alarms.length != 0 ?
                                                            this.Language != "EN" ?
                                                                this.SearchAndGetObjectFromArray(this.state.Alarms, this.state.alarm).titleAR
                                                                :
                                                                this.SearchAndGetObjectFromArray(this.state.Alarms, this.state.alarm).titleEN
                                                            :
                                                            this.Language != "EN" ? "اختر التنبية" : "Choose alarm"
                                                    }
                                                    // Selection Process
                                                    onSelect={(index, value) => { this.setState({ alarm: value._id }) }}
                                                    // Value After Selection
                                                    renderButtonText={(rowData) => (
                                                        this.Language != "EN" ?
                                                            rowData.titleAR
                                                            :
                                                            rowData.titleEN
                                                    )}
                                                    // Styling
                                                    style={{ backgroundColor: '#FFF', flex: 1, height: '100%', justifyContent: 'center' }} // abl ma t5tar
                                                    textStyle={{ textAlign: 'center', fontSize: 16, color: '#000' }}
                                                    dropdownStyle={{ width: 180, alignSelf: 'center', height: 160, borderColor: '#D7D7D7', borderWidth: 2, borderRadius: 3, }}
                                                    renderRow={function (rowData, rowID, highlighted) {
                                                        return (
                                                            <View style={[styles.row, { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 50, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                                                                <Text style={[{ fontSize: 16, color: '#707070', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                                                                    {(this.Language != "EN" ? rowData.titleAR : rowData.titleEN)}
                                                                </Text>
                                                            </View>
                                                        );
                                                    }.bind(this)}
                                                />
                                            </View>
                                            <View style={{ width: 14, height: 14, marginHorizontal: 8 }} ></View>
                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                            </ScrollView>
                        </View>
                    </View>

                </View>

                <View style={{ width, height: 80, backgroundColor: '#E1D115', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.addMembers()} style={[styles.row, { width: width * 0.5, justifyContent: 'space-between', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#CBBE21', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{" "}</Text>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "أضافة أعضاء" : "Add Members"}</Text>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{"+"}</Text>

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
export default connect(mapStateToProps, {})(GamayAdd)

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
    inputFields: {
        borderColor: '#E9E9E9',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRadius: 8
    },
})

