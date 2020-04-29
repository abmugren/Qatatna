import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { Input, Item, Picker, DatePicker } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown'

class QattaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.navigation.getParam('Qatta')._id,
            selected: this.props.navigation.getParam('Qatta').alarm,
            group: this.props.navigation.getParam('Qatta').group,
            totalValue: this.props.navigation.getParam('Qatta').totalValue,
            perMember: this.props.navigation.getParam('Qatta').perMember,
            chosenDate: this.props.navigation.getParam('Qatta').worth,
            Members: this.props.navigation.getParam('Qatta').Members ? this.props.navigation.getParam('Qatta').Members : [],
            Alarms: [],
            Processing: false,
            totalBG: '#FFF',
            totalBC: '#E9E9E9',
            permemberBG: '#FFF',
            permemberBC: '#E9E9E9',
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        this.getMembers()
        this.getAllAlarms()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('QattaHome', { Qatta: this.props.navigation.getParam('Qatta') });
        return true;
    }

    getMembers() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        const Qatta = thisComponent.props.navigation.getParam('Qatta')
        if (Qatta.Members) {

        } else {
            try {
                axios.get('http://167.172.183.142/api/user/getMembersByQatta', {
                    params: {
                        qattaID: Qatta._id
                    }
                }).then(function (response) {
                    var newArr = thisComponent.state.Members
                    response.data.map((item, index) => {
                        newArr.push(item.membersID)
                    })
                    thisComponent.setState({ Members: newArr, Processing: false })
                    // console.log(thisComponent.state.Members)
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

    setDate = (newDate) => {
        this.setState({ chosenDate: newDate });
    }

    editMembers() {
        this.props.navigation.navigate('QattaEditMembers', {
            Qatta: {
                _id: this.state._id,
                group: this.state.group,
                worth: this.state.chosenDate,
                alarm: this.state.selected,
                totalValue: this.state.totalValue,
                perMember: this.state.perMember,
                Members: this.state.Members
            }
        })
    }

    saveEdits() {
        if (this.state.group == "") {
            alert(this.Language != "EN" ? 'من فضلك أدخل أسم المجموعة ' : "Please Enter group name")
        } else {
            if (!this.state.chosenDate) {
                alert(this.Language != "EN" ? 'من فضلك اختر التاريخ' : "Please Choose date")
            } else {
                if (this.state.selected == "0") {
                    alert(this.Language != "EN" ? 'من فضلك اختر مده التنبيه' : "Please choose period")
                } else {
                    if (this.state.totalValue == "") {
                        alert(this.Language != "EN" ? 'من فضلك اكتب المبلغ الاجمالى' : "Please enter total price")
                    } else {
                        if (this.state.perMember == "") {
                            alert(this.Language != "EN" ? 'من فضلك اكتب المبلغ لكل عضو' : "Please enter price for each member")
                        } else {
                            if (this.state.Members.length == 0) {
                                alert(this.Language != "EN" ? "من فضلك اضف اعضاء" : "Please add members")
                            } else {
                                this.save()
                            }
                        }
                    }
                }
            }
        }
    }

    save() {
        const thisComponent = this
        const { group, totalValue, perMember } = this.state
        const QattaDetails = thisComponent.props.navigation.getParam('Qatta')
        const qattaID = QattaDetails._id
        var newArr = []
        thisComponent.state.Members.map((item, index) => {
            item.membersID ?
                newArr.push(item.membersID)
                :
                newArr.push(item)
        })
        console.log(newArr)
        thisComponent.setState({ Members: newArr, Processing: false })
        thisComponent.setState({ Processing: true })
        try {
            axios.put('http://167.172.183.142/api/user/editQatta/' + qattaID, {
                group, totalValue, perMember, qattaID,
                worth: thisComponent.state.chosenDate,
                alarm: thisComponent.state.selected,
                createBy: thisComponent.props.User._id,
                members: newArr,
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
                thisComponent.props.navigation.navigate('QattaMain')
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
                        const QattaDetails = thisComponent.props.navigation.getParam('Qatta')
                        const qattaID = QattaDetails._id
                        thisComponent.setState({ Processing: true })
                        try {
                            axios.put('http://167.172.183.142/api/user/deleteQatta/' + qattaID, {

                            }).then(function (response) {
                                console.log(response)
                                thisComponent.setState({ Processing: false })
                                thisComponent.props.navigation.navigate('QattaMain')
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

    SearchAndGetObjectFromArray(arr, id) {
        return arr.find(obj => obj._id == id)
    }

    renderHeader() {
        return (
            <View style={[styles.flex, styles.row, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name="chevron-left" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "تعديل القطه" : "Edit Qatta"}</Text>
                <TouchableOpacity onPress={() => this.deleteGroup()} style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FontAwesome name={'trash-o'} style={{ fontSize: 22, color: '#000' }} />
                </TouchableOpacity>
            </View>
        )
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
                <View style={[styles.column, styles.shadow, { width: '90%', flex: 1, backgroundColor: '#FFF', justifyContent: 'flex-start', marginVertical: height * 0.025, }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} >

                        <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                        <View style={[styles.column, { width: '100%' }]} >
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                                <Image source={require('./../../../../../Images/list.png')} style={{ width: 24, height: 24 }} />
                                <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "المجموعة" : "Group"}</Text>
                            </View>

                            <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                                <TouchableOpacity onPress={() => this.editMembers()} style={[styles.shadow, { elevation: 2, width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#DBEDFA', borderRadius: 8, borderColor: "#017ED4", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]} >
                                    <Text style={{ color: this.state.group != '' ? '#017ED4' : '#707070', fontWeight: 'bold' }} >{this.state.group != '' ? this.state.group : this.Language != "EN" ? 'ضف المجموعه' : "Add group"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.column, { width: '100%' }]} >
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                                <Image source={require('./../../../../../Images/calendar.png')} style={{ width: 24, height: 24 }} />
                                <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "الاستحقاق" : "Date"}</Text>
                            </View>

                            <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                                <View style={[styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                    <EvilIcons name="calendar" style={{ fontSize: 32, color: '#707070' }} />
                                    <DatePicker
                                        defaultDate={new Date(this.state.chosenDate)}
                                        placeHolderText={!this.state.chosenDate ? this.Language != "EN" ? "اختر التاريخ" : "Choose date" : null}
                                        locale={"en"}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        animationType={"fade"}
                                        androidMode={"default"}
                                        textStyle={{ color: "#0C546A" }}
                                        placeHolderTextStyle={{ color: "#0C546A" }}
                                        onDateChange={this.setDate}
                                        disabled={false}
                                    />
                                    <View style={{ width: 32, height: 32 }} ></View>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.column, { width: '100%' }]} >
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", marginBottom: height * 0.005 }]}>
                                <Ionicons name={"ios-alarm"} style={{ fontSize: 32, color: '#CCC', marginHorizontal: 4, }} />
                                <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "التنبيه" : "Alert"}</Text>
                            </View>

                            <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.015, paddingHorizontal: "10%", justifyContent: 'center' }]}>
                                <View style={[styles.row, { width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }]} >
                                    <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                    <View style={[styles.row, { flex: 1, justifyContent: 'center', height: "100%" }]} >
                                        {/* <Picker
                                        selectedValue={this.state.selected ? this.state.selected : "0"}
                                        mode="dropdown"
                                        style={[Platform.OS === 'android' ? { marginRight: -75 } : {}, { backgroundColor: '#FFF', flex: 1, height:38 }]}                                        
                                        onValueChange={(item, Index) => this.setState({ selected: item })}
                                    >
                                        <Picker.Item color={'0C546A'} label={this.Language != "EN" ? "اختر المده" : "Choose period"} color={'#CDCBCB'} value="0" />
                                        {
                                            this.state.Alarms.map((item, index) => {
                                                return (
                                                    <Picker.Item
                                                        color={'#0C546A'}
                                                        label={this.Language != "EN" ? item.titleAR : item.titleEN}
                                                        value={item._id}
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
                                                this.state.selected != "0" && this.state.Alarms.length != 0 ?
                                                    this.Language != "EN" ?
                                                        this.SearchAndGetObjectFromArray(this.state.Alarms, this.state.selected).titleAR
                                                        :
                                                        this.SearchAndGetObjectFromArray(this.state.Alarms, this.state.selected).titleEN
                                                    :
                                                    this.Language != "EN" ? "اختر المده" : "Choose period"
                                            }
                                            // Selection Process
                                            onSelect={(index, value) => { this.setState({ selected: value._id }) }}
                                            // Value After Selection
                                            renderButtonText={(rowData) => (
                                                this.Language != "EN" ?
                                                    rowData.titleAR
                                                    :
                                                    rowData.titleEN
                                            )}
                                            // Styling
                                            style={{ backgroundColor: '#FFF', flex: 1, height: '100%', justifyContent: 'center' }} // abl ma t5tar
                                            textStyle={{ textAlign: 'center', fontSize: 16, color: '#0C546A' }}
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

                        <View style={[styles.column, { width: '100%' }]} >
                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%" }]}>
                                <Image source={require('./../../../../../Images/money.png')} style={{ width: 24, height: 24, marginHorizontal: 4, }} />
                                <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "المبلغ" : "Price"}</Text>
                            </View>

                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: "10%" }]}>
                                <Text style={{ color: '#707070', fontSize: 12 }} >{this.state.Members.length} {this.Language != "EN" ? " أعضاء " : " Members "}</Text>
                            </View>

                            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingHorizontal: "10%", justifyContent: 'space-between' }]}>
                                <View style={[styles.column, { width: '48%' }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.005 }]}>
                                        <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "الاجمالي" : "Total"}</Text>
                                    </View>

                                    <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center' }]}>
                                        <View style={{ width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: this.state.totalBG, borderRadius: 8, borderColor: this.state.totalBC, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >
                                            <Item style={[{ flex: 1, backgroundColor: this.state.totalBG, justifyContent: 'center', alignItems: 'center' }]}>
                                                <Input
                                                    defaultValue={this.state.totalValue.toString()}
                                                    keyboardType="numeric"
                                                    placeholder={this.Language != "EN" ? 'أدخل المبلغ' : "Enter price"}
                                                    style={{ color: '#0C546A' }} textAlign={'center'}
                                                    onChangeText={(text) => this.setState({ totalValue: text, totalBG: '#DBEDFA', totalBC: "#0069b1", permemberBG: '#FFF', permemberBC: '#E9E9E9', perMember: this.state.Members.length != 0 && text.length >= 1 ? (parseFloat(text) / this.state.Members.length).toFixed(2).toString() : '' })}
                                                />
                                            </Item>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.column, { width: '48%' }]} >
                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '100%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.005 }]}>
                                        <Text style={{ color: '#707070', fontSize: 24 }} >{this.Language != "EN" ? "على العضو" : "For each"}</Text>
                                    </View>

                                    <View style={[styles.rowReverse, { width: '100%', backgroundColor: '#FFF', alignItems: 'center' }]}>
                                        <View style={{ width: '100%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: this.state.permemberBG, borderRadius: 8, borderColor: this.state.permemberBC, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >
                                            <Item style={[{ flex: 1, backgroundColor: this.state.permemberBG, justifyContent: 'center', alignItems: 'center' }]}>
                                                <Input
                                                    defaultValue={this.state.perMember.toString()}
                                                    keyboardType="numeric"
                                                    placeholder={this.Language != "EN" ? 'أدخل المبلغ' : "Enter price"}
                                                    style={{ color: '#0C546A' }} textAlign={'center'}
                                                    onChangeText={(text) => this.setState({ perMember: text, totalBG: '#FFF', totalBC: '#E9E9E9', permemberBG: '#DBEDFA', permemberBC: '#0069b1', totalValue: this.state.Members.length != 0 && text.length >= 1 ? (parseFloat(text) * this.state.Members.length).toFixed(2).toString() : '' })}
                                                />
                                            </Item>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.column, { width: '100%', height: height * 0.025 }]} ></View>

                    </ScrollView>
                </View >

                <View style={{ width, height: 80, backgroundColor: '#017ED4', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.saveEdits()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "‫حفظ‬ ‫التعديلات‬" : "Save Edits"}</Text>
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
export default connect(mapStateToProps, {})(QattaEdit)

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
