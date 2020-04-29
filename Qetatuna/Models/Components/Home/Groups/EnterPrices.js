import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler, KeyboardAvoidingView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { Input, Item, Picker } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
axios.defaults.timeout = 10000

class EnterPrices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Qatta: this.props.navigation.getParam('Qatta'),
            outGoings: [],
            selected: "0",
            customOutGoing: '',
            price: '',
            Processing: false,
        };
    }

    UNSAFE_componentWillMount() {
        this.getManagerOutGoings()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const lastScreen = this.props.navigation.getParam('screen')
        this.props.navigation.navigate(lastScreen, { Qatta: this.props.navigation.getParam('Qatta') });
        return true;
    }

    getManagerOutGoings = () => {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getAlloutgoingsType", {
                params: {
                    managerID: this.props.User._id
                }
            }).then(response => {
                thisComponent.setState({ outGoings: response.data, Processing: false })
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

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6', paddingHorizontal: 8 }]} >
                <TouchableOpacity onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "أدخال مصروفات" : "Enter Expenses"}</Text>
                <View></View>
            </View>
        )
    }

    enterPrices() {
        const thisComponent = this
        const { selected, customOutGoing, price } = this.state
        if (this.props.User.membershipStatus == 1) {
            alert(this.Language != "EN" ? "هذه الخدمة غير متاحة للحساب المجانى" : "Sorry this service is not available for free accounts")
        } else {
            if (selected == "0") {
                alert(this.Language != "EN" ? "من فضلك اختر نوع المصروف" : "please choose expense type")
            } else {
                if (selected == "00") {
                    if (customOutGoing == '') {
                        alert(this.Language != "EN" ? "من فضلك ادخل النص" : "please enter text")
                    } else {
                        if (price == '') {
                            alert(this.Language != "EN" ? "من فضلك اكتب المصروف" : "please enter expense")
                        } else {
                            thisComponent.setState({ Processing: true })
                            try {
                                axios.post('http://167.172.183.142/api/admin/outgoingsType', {
                                    managerID: thisComponent.props.User._id,
                                    titleAR: customOutGoing
                                }).then(function (response) {
                                    console.log(response)
                                    thisComponent.getManagerOutGoings()
                                    thisComponent.setState({ Processing: false })
                                    thisComponent.getManagerOutGoings()
                                    thisComponent.setState({ selected: response.data._id })
                                    thisComponent.addPrices()
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
                } else {
                    if (price == '') {
                        alert(this.Language != "EN" ? "من فضلك اكتب المصروف" : "please enter expense")
                    } else {
                        // all done
                        thisComponent.addPrices()
                    }
                }
            }
        }

    }

    addPrices() {
        const thisComponent = this
        const { selected, customOutGoing, price } = this.state
        thisComponent.setState({ Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/outgoings', {
                outgoingTypeID: selected,
                qattaID: thisComponent.props.navigation.getParam('Qatta')._id,
                managerID: thisComponent.props.User._id,
                amount: price
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
                <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }} >
                    <KeyboardAvoidingView style={[styles.column, styles.shadow, { width: '90%', height: "90%", backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]}>
                        {
                            this.props.User.membershipStatus == 1 ? // law mosh moshtarek
                                null
                                :
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }} >

                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '95%', backgroundColor: '#FFF', alignItems: 'center', marginTop: 22, marginBottom: height * 0.005  }]}>
                                        <Image source={require('./../../../../Images/list.png')} style={{ width: 24, height: 24 }} />
                                        <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "المجموعة" : "Group"}</Text>
                                    </View>

                                    <View style={[styles.rowReverse, { width: '95%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: 12 + height * 0.015, marginTop: 8 }]}>
                                        <View style={{ width: '95%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#DBEDFA', borderRadius: 8, borderColor: "#017ED4", borderWidth: 2, justifyContent: 'center', alignItems: 'center' }} >
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#017ED4' }} >{this.state.Qatta.group}</Text>
                                        </View>
                                    </View>

                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '95%', backgroundColor: '#FFF', alignItems: 'center',marginBottom: height * 0.005  }]}>
                                        <Image source={require('./../../../../Images/list.png')} style={{ width: 24, height: 24 }} />
                                        <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "نوع المصروف" : "Expense type"}</Text>
                                    </View>

                                    <View style={[styles.rowReverse, { width: '95%', backgroundColor: '#FFF', alignItems: 'center', marginTop: 8 }]}>
                                        <View style={[styles.row, { width: '95%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#FFF', borderRadius: 8, borderColor: "#E9E9E9", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]} >
                                            <AntDesign name="down" size={14} style={{ color: '#000', marginHorizontal: 8 }} />
                                            <Picker
                                                selectedValue={this.state.selected ? this.state.selected : "0"}
                                                mode="dropdown"
                                                style={{ backgroundColor: 'transparent', height: '100%', flex: 1 }}
                                                onValueChange={(item, Index) => this.setState({ selected: item })}
                                            >
                                                <Picker.Item label={this.Language != "EN" ? "أختر  نوع المصروف" : "Choose type"} color={'#CDCBCB'} value="0" />
                                                {
                                                    this.state.outGoings.map((item, index) => {
                                                        return (
                                                            <Picker.Item
                                                                label={item.titleAR}
                                                                value={item._id}
                                                                key={index.toString()} color={'#0C546A'}
                                                            />
                                                        )
                                                    })
                                                }
                                                <Picker.Item label={this.Language != "EN" ? "أدخال نص" : "Enter text"} color={'#0C546A'} value="00" />
                                            </Picker>
                                            <View></View>
                                        </View>
                                    </View>
                                    {
                                        this.state.selected == "00" ?
                                            <View style={[styles.rowReverse, { width: '95%', backgroundColor: '#FFF', alignItems: 'center' }]}>
                                                <View style={[styles.rowReverse, { height: 45, width: '95%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: 12, borderColor: "#E9E9E9", borderWidth: 1, }]}>
                                                    <Item style={[{ height: '100%', width: '90%', backgroundColor: '#FFF', justifyContent: 'center', borderBottomWidth: 0, alignItems: 'center', }]}>
                                                        <Input
                                                            placeholder={this.Language != "EN" ? 'أدخل النص هنا' : 'Enter text here'}
                                                            style={{ color: '#0C546A', }} textAlign={this.Language != "EN" ? 'right' : 'left'}
                                                            onChangeText={(text) => this.setState({ customOutGoing: text })}
                                                        />
                                                    </Item>
                                                </View>
                                            </View>
                                            :
                                            <View style={{ marginBottom: 12 }} ></View>
                                    }


                                    <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width: '95%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: height * 0.005, marginTop: height * 0.015  }]}>
                                        <Image source={require('./../../../../Images/money.png')} style={{ width: 24, height: 24 }} />
                                        <Text style={{ color: '#707070', fontSize: 24, marginHorizontal: 4 }} >{this.Language != "EN" ? "المبلغ" : "Price"}</Text>
                                    </View>

                                    <View style={[styles.rowReverse, { width: '95%', backgroundColor: '#FFF', alignItems: 'center', marginBottom: 12, marginTop: 8 }]}>
                                        <View style={{ width: '95%', height: height * 0.06, minHeight: 35, maxHeight: 60, backgroundColor: '#DBEDFA', borderRadius: 8, borderColor: "#017ED4", borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >
                                            <Item style={[{ flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]}>
                                                <Input
                                                    placeholder={this.Language != "EN" ? 'أدخل المبلغ المصروف' : "Enter price"}
                                                    style={{ color: '#0C546A' }} textAlign={'center'}
                                                    keyboardType="numeric"
                                                    onChangeText={(text) => this.setState({ price: text })}
                                                />
                                            </Item>
                                        </View>
                                    </View>

                                </ScrollView>
                        }
                        {
                            this.props.User.membershipStatus == 1 ? // law mosh moshtarek

                                <Text>
                                    {this.Language != "EN" ? "هذه الخدمة غير متاحة للحساب المجانى" : "This service is not available for free accounts"}
                                </Text>

                                :
                                null
                        }
                    </KeyboardAvoidingView >
                </View>

                <View style={{ width, height: height * 0.1, backgroundColor: '#017ED4', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.enterPrices()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "أدخل المصروفات" : "Enter Expenses"}</Text>
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
export default connect(mapStateToProps, {})(EnterPrices)

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
