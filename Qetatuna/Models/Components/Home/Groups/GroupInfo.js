import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DatePicker } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import Accordion from 'react-native-collapsible/Accordion';
const SECTIONS = [
    {
        title: 'First',
        content: 'Lorem ipsum...',
    },
    {
        title: 'Second',
        content: 'Lorem ipsum...',
    },
    {
        title: 'Second',
        content: 'Lorem ipsum...',
    },
    {
        title: 'Second',
        content: 'Lorem ipsum...',
    },
];

class GroupInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Qatta: this.props.navigation.getParam('Qatta'),
            selectedTab: 1,
            activeSections: [],
            outGoings: [],
            Processing: false,
            chosenDate: new Date(Date.now() - 86400000),
            chosenDateTo: new Date(Date.now() + 86400000)
        };
    }

    componentDidMount() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        try {
            axios.get("http://167.172.183.142/api/user/getOutGonigByQattaID", {
                params: {
                    qattaID: thisComponent.state.Qatta._id
                }
            }).then(response => {
                console.log(response)
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

    // _renderSectionTitle = section => {
    //     return (
    //         <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
    //             <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, marginHorizontal: 18, backgroundColor: '#DBEDFA', height: 40, borderTopColor: '#FFF', borderTopWidth: 1 }]}>
    //                 <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#FFF' } : { borderLeftWidth: 1, borderLeftColor: '#FFF' }]}>
    //                     <Text style={{ color: '#000', fontSize: 14, textAlign: 'center' }} >{"10,000 ر.س"}</Text>
    //                 </View>
    //                 <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#FFF' } : { borderLeftWidth: 1, borderLeftColor: '#FFF' }]}>
    //                     <Text style={{ color: '#000', fontSize: 14, textAlign: 'center' }} >{"8-12-2019"}</Text>
    //                 </View>
    //                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //                     <Text style={{ color: '#000', fontSize: 14, textAlign: 'center', fontWeight: 'bold' }} >{"أتعاب معقبين"}</Text>
    //                 </View>
    //             </View>
    //         </View>
    //     );
    // };

    // _renderHeader = section => {
    //     return (
    //         <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
    //             <View style={[styles.row, styles.shadow, { flex: 1, marginHorizontal: 18, backgroundColor: '#FFF', height: 20, elevation: 2, marginBottom: 2 }]}>
    //                 <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
    //                     <AntDesign name="down" size={14} style={{ color: '#707070', marginHorizontal: 4 }} />
    //                     <Text style={{ color: '#000', fontSize: 14, textAlign: 'center', fontWeight: 'bold' }} >{this.Language != "EN" ? "التفاصيل" : "Details"}</Text>
    //                 </View>
    //             </View>
    //         </View>
    //     );
    // };

    // _renderContent = section => {
    //     return (
    //         <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
    //             <View style={[styles.column, { flex: 1, marginHorizontal: 18, backgroundColor: '#FFF', borderTopColor: '#FFF', borderTopWidth: 1, marginBottom: 2 }]}>

    //                 <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, backgroundColor: '#FFF', height: 40, borderTopColor: '#FFF', borderTopWidth: 1 }]}>
    //                     <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#DBEDFA' } : { borderLeftWidth: 1, borderLeftColor: '#DBEDFA' }]}>
    //                         <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }} >{"10,000 ر.س"}</Text>
    //                     </View>
    //                     <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#DBEDFA' } : { borderLeftWidth: 1, borderLeftColor: '#DBEDFA' }]}>
    //                         <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }} >{"8-12-2019"}</Text>
    //                     </View>
    //                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //                         <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }} >{"سارة العقاد"}</Text>
    //                     </View>
    //                 </View>

    //                 <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, backgroundColor: '#FFF', height: 40, borderTopColor: '#FFF', borderTopWidth: 1 }]}>
    //                     <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#DBEDFA' } : { borderLeftWidth: 1, borderLeftColor: '#DBEDFA' }]}>
    //                         <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }} >{"10,000 ر.س"}</Text>
    //                     </View>
    //                     <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#DBEDFA' } : { borderLeftWidth: 1, borderLeftColor: '#DBEDFA' }]}>
    //                         <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }} >{"8-12-2019"}</Text>
    //                     </View>
    //                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //                         <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }} >{"سارة العقاد"}</Text>
    //                     </View>
    //                 </View>

    //             </View>
    //         </View>
    //     );
    // };

    // _updateSections = activeSections => {
    //     this.setState({ activeSections });
    // };

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const lastScreen = this.props.navigation.getParam('screen')
        this.props.navigation.navigate(lastScreen ? lastScreen : "Home");
        return true;
    }

    Language = this.props.Language ? this.props.Language : "AR"

    setDate = (newDate) => {
        this.setState({ chosenDate: newDate });
    }

    setDateTo = (newDate) => {
        this.setState({ chosenDateTo: newDate });
    }

    sendEmail = async () => {
        if (this.props.User.membershipStatus === 1)// law mosh moshtarek
        {
            alert(this.Language != "EN" ? "هذه الخدمة غير متاحة\n للحساب المجانى" : "This service is not available \nfor free accounts")
        } else {
            let text = "***** المصروفات *****\n*********************"
            await this.state.outGoings.map((item, index) => {
                if (new Date(item.createdAt) >= this.state.chosenDate) {
                    if (new Date(item.createdAt) <= this.state.chosenDateTo) {
                        text =
                            text + "\n"
                            + item.outgoingTypeID.titleAR + "\n" +
                            (new Date(item.createdAt).getDate()
                                + '-' +
                                new Date(item.createdAt).getMonth()
                                + '-' +
                                new Date(item.createdAt).getFullYear()
                            ) + "\n" + item.amount + "\n*********************"
                    }
                } else {

                }
            })
            const thisComponent = this
            thisComponent.setState({ Processing: true })
            try {
                axios.post('http://167.172.183.142/api/user/sendEmail', {
                    // params : {
                    email: thisComponent.props.User.email,
                    // email: 'adelredaa97@gmail.com',
                    text
                    // },
                }).then(function (response) {
                    console.log(response)
                    thisComponent.setState({ Processing: false })
                    setTimeout(() => {
                        alert(thisComponent.Language != "EN" ? "تم" : "Done")
                    }, 100);

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
                // console.log(error)
                thisComponent.setState({ Processing: false })
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
                <Text style={{ color: '#000', fontSize: 16 }}>{this.state.Qatta.group}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    renderTabs() {
        return (
            <View style={[this.Language != "EN" ? styles.rowReverse : styles.row, { width, height: 80, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }]} >
                <View style={[styles.row, { flex: 1, height: '100%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity
                        onPress={() => this.setState({ selectedTab: 1 })}
                        style={[
                            styles.row,
                            this.state.selectedTab == 1 ?
                                { backgroundColor: '#017ED4' }
                                :
                                { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CCC' },
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '85%', height: '40%',
                                borderRadius: 12,
                            }
                        ]}
                    >
                        <Text
                            style={[this.state.selectedTab == 1 ? { color: '#FFF' } : { color: '#707070' }, { fontSize: 12, fontWeight: 'bold' }]}
                        >
                            {this.Language != "EN" ? "الصندوق" : "Inbox"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.row, { flex: 1, height: '100%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity
                        onPress={() => this.setState({ selectedTab: 2 })}
                        style={[
                            styles.row,
                            this.state.selectedTab == 2 ?
                                { backgroundColor: '#017ED4' }
                                :
                                { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CCC' },
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '85%', height: '40%',
                                borderRadius: 12,
                            }
                        ]}
                    >
                        <Text
                            style={[this.state.selectedTab == 2 ? { color: '#FFF' } : { color: '#707070' }, { fontSize: 12, fontWeight: 'bold' }]}
                        >
                            {this.Language != "EN" ? "المصروفات" : "Expenses"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.row, { flex: 1, height: '100%', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity
                        onPress={() => this.setState({ selectedTab: 3 })}
                        style={[
                            styles.row,
                            this.state.selectedTab == 3 ?
                                { backgroundColor: '#017ED4' }
                                :
                                { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CCC' },
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '85%', height: '40%',
                                borderRadius: 12,
                            }
                        ]}
                    >
                        <Text
                            style={[this.state.selectedTab == 3 ? { color: '#FFF' } : { color: '#707070' }, { fontSize: 12, fontWeight: 'bold' }]}
                        >
                            {this.Language != "EN" ? "الأرشيف" : "Archive"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderTab1() {
        return (
            <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 1 }]} >

                <View style={[styles.column, styles.shadow, { width: '90%', height: height * 0.55, backgroundColor: '#FFF', shadowOpacity: 0.1, paddingVertical: 12 }]}>

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >

                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '85%', height: '80%', backgroundColor: '#DBEDFA', borderRadius: 12, paddingVertical: 8 }]} >
                            <View style={[styles.column, { flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#017ED4' } : {}]} >
                                <Text style={{ fontSize: 12, color: '#017ED4', fontWeight: 'bold' }} >{this.Language != "EN" ? "المصروف" : "Expenses"}</Text>
                                <Text style={{ fontSize: 16, color: '#017ED4', fontWeight: 'bold', marginTop: 8 }} >{this.state.Qatta.totalOutgoing.toFixed(2)}</Text>
                                <Text style={{ fontSize: 12, color: '#017ED4' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                            </View>
                            <View style={[styles.column, { flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language == "EN" ? { borderRightWidth: 1, borderRightColor: '#017ED4' } : {}]} >
                                <Text style={{ fontSize: 12, color: '#017ED4', fontWeight: 'bold' }} >{this.Language != "EN" ? "المبالغ الواردة" : "Income"}</Text>
                                <Text style={{ fontSize: 16, color: '#017ED4', fontWeight: 'bold', marginTop: 8 }} >{this.state.Qatta.totalValueAmount.toFixed(2)}</Text>
                                <Text style={{ fontSize: 12, color: '#017ED4' }} >{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                            </View>
                        </View>

                    </View>

                    <View style={[styles.column, { flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 14 }]} >
                        <Text style={{ fontSize: 14, color: '#017ED4', fontWeight: 'bold', marginBottom: 8 }} >{this.Language != "EN" ? "الباقى" : "Remained"}</Text>
                        <TouchableOpacity style={[styles.row, { justifyContent: 'center', alignItems: 'center', width: width * 0.5, paddingVertical: 8, backgroundColor: '#DBEDFA', borderRadius: 12, borderWidth: 1, borderColor: '#017ED4' }]} >
                            <Text style={{ color: '#017ED4' }} >
                                {(parseFloat(this.state.Qatta.totalValueAmount) - parseFloat(this.state.Qatta.totalOutgoing)).toFixed(2).toString()}{this.Language != "EN" ? " ريال سعودى " : " SAR "}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        )
    }

    renderTab2() {
        return (
            <View style={[styles.column, { width, backgroundColor: 'transparent', height: '100%', justifyContent: 'flex-start', alignItems: 'center', marginTop: 1 }]} >

                <View style={[styles.row, { flex: 1, width, justifyContent: 'center', alignItems: 'flex-start', marginTop: 1 }]} >
                    <View style={[styles.column, styles.shadow, { width: '90%', height: height * 0.55, backgroundColor: '#FFF', shadowOpacity: 0.1 }]}>

                        {
                            this.props.User.membershipStatus == 1 ? // law mosh moshtarek
                                null
                                :
                                <View style={[styles.row, { flex: 2, justifyContent: 'center', alignItems: 'center' }]} >

                                    <View style={[styles.row, { width: '85%', height: '80%', backgroundColor: '#DBEDFA', borderRadius: 12, padding: 12 }]} >
                                        <ScrollView>
                                            <View style={[styles.column, { flex: 1, justifyContent: 'flex-start', alignItems: 'center', }]} >

                                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', borderBottomWidth: 1, borderBottomColor: '#017ED4' }]} >
                                                    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4 }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#017ED4' } : { borderLeftWidth: 1, borderLeftColor: '#017ED4' }]} >
                                                        <Text style={{ fontSize: 12, color: '#017ED4', fontWeight: 'bold' }} >{this.Language != "EN" ? "المبالغ" : "Prices"}</Text>
                                                    </View>
                                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }} >
                                                        <Text style={{ fontSize: 12, color: '#017ED4', fontWeight: 'bold' }} >{this.Language != "EN" ? "المصروفات" : "Expenses"}</Text>
                                                    </View>
                                                </View>

                                                {/* item */}

                                                {
                                                    this.state.outGoings.map((item, index) => {
                                                        return (
                                                            <View key={index.toString()} style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%' }]} >
                                                                <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4 }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#017ED4' } : { borderLeftWidth: 1, borderLeftColor: '#017ED4' }]} >
                                                                    <Text style={{ fontSize: 12, color: '#6E6E6E', fontWeight: 'bold' }} >{item.amount}</Text>
                                                                </View>
                                                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }} >
                                                                    <Text style={{ fontSize: 12, color: '#6E6E6E', fontWeight: 'bold' }} >{item.outgoingTypeID.titleAR}</Text>
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }




                                            </View>
                                        </ScrollView>
                                    </View>

                                </View>
                        }

                        {
                            this.props.User.membershipStatus == 1 ? // law mosh moshtarek
                                null
                                :
                                <View style={[styles.column, { flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 14 }]} >
                                    <Text style={{ fontSize: 14, color: '#017ED4', fontWeight: 'bold', marginBottom: 8 }} >{this.Language != "EN" ? "أجمالى المصروفات" : "Total expenses"}</Text>
                                    <TouchableOpacity style={[styles.row, { justifyContent: 'center', alignItems: 'center', width: width * 0.5, paddingVertical: 8, backgroundColor: '#DBEDFA', borderRadius: 12, borderWidth: 1, borderColor: '#017ED4' }]} >
                                        <Text style={{ color: '#017ED4' }} >
                                            {this.state.Qatta.totalOutgoing}{this.Language != "EN" ? " ريال سعودى " : " SAR "}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                        }

                        {
                            this.props.User.membershipStatus == 1 ? // law mosh moshtarek
                                <View style={{ width: '100%', height: '100%', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', padding: 10 }} >
                                    <Text style={{ textAlign: 'center' }} >
                                        {this.Language != "EN" ? "هذه الخدمة غير متاحة \nللحساب المجانى" : "This service is not available \nfor free accounts"}
                                    </Text>
                                </View>
                                :
                                null
                        }

                    </View>
                </View>
                {
                    this.props.User.isMember || this.props.navigation.getParam('Qatta').createBy != this.props.User._id ?
                        null :
                        <View style={{ width, height: 80, backgroundColor: '#017ED4', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('EnterPrices', { screen: 'GroupInfo', Qatta: this.state.Qatta })} style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: width * 0.5, justifyContent: 'space-between', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{" "}</Text>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "أدخال مصروفات" : "Enter expenses"}</Text>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{"+"}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                }

            </View>
        )
    }

    renderTab3() {
        return (
            <View style={[styles.column, { width, backgroundColor: 'transparent', height: '100%', justifyContent: 'flex-start', alignItems: 'center', marginTop: 1 }]} >

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginVertical: 16 }]} >

                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '90%', height: 120, backgroundColor: '#DBEDFA', borderRadius: 12, paddingVertical: 8, borderColor: '#017ED4', borderWidth: 1 }]} >

                            <View style={[styles.column, { flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#FFF' } : { borderLeftWidth: 1, borderLeftColor: '#FFF' }]} >
                                <Text style={{ fontSize: 12, color: '#000', fontWeight: 'bold' }} >{this.Language != "EN" ? "الى تاريخ" : "To"}</Text>
                                <View style={[styles.row, { width: '90%', backgroundColor: '#FFF', marginTop: 12, alignItems: 'center', justifyContent: 'space-evenly' }]} >
                                    <EvilIcons name='calendar' style={{ fontSize: 26 }} />
                                    <DatePicker
                                        defaultDate={new Date(this.state.chosenDateTo)}
                                        placeHolderText={!this.state.chosenDateTo ? this.Language != "EN" ? "اختر التاريخ" : "Choose date" : null}
                                        locale={"en"}
                                        style={{ backgroundColor: '#CCC' }}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        animationType={"fade"}
                                        androidMode={"default"}
                                        textStyle={{ color: "#0C546A" }}
                                        placeHolderTextStyle={{ color: "#0C546A" }}
                                        onDateChange={this.setDateTo}
                                        disabled={false}
                                    />
                                    <View style={{ width: 32, height: 32 }} ></View>
                                </View>
                            </View>

                            <View style={[styles.column, { flex: 1, justifyContent: 'center', alignItems: 'center', }]} >
                                <Text style={{ fontSize: 12, color: '#000', fontWeight: 'bold' }} >{this.Language != "EN" ? "من تاريخ" : "From"}</Text>
                                <View style={[styles.row, { width: '90%', backgroundColor: '#FFF', marginTop: 12, alignItems: 'center', justifyContent: 'space-evenly' }]} >
                                    <EvilIcons name='calendar' style={{ fontSize: 26 }} />
                                    <DatePicker
                                        defaultDate={new Date(this.state.chosenDate)}
                                        placeHolderText={!this.state.chosenDate ? this.Language != "EN" ? "اختر التاريخ" : "Choose date" : null}
                                        locale={"en"}
                                        style={{ backgroundColor: '#CCC' }}
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

                    </View>
                    {
                        this.props.User.membershipStatus == 1 ? // law mosh moshtarek
                            null
                            :
                            <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 8 }]} >

                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, marginHorizontal: 18, backgroundColor: '#DBEDFA', height: 45, paddingVertical: 4 }]}>
                                    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#FFF' } : { borderLeftWidth: 1, borderLeftColor: '#FFF' }]}>
                                        <Text style={{ color: '#000', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }} >{this.Language != "EN" ? "المبلغ" : "Price"}</Text>
                                    </View>
                                    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#FFF' } : { borderLeftWidth: 1, borderLeftColor: '#FFF' }]}>
                                        <Text style={{ color: '#000', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }} >{this.Language != "EN" ? "الأستحقاق" : "Date"}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }} >{this.Language != "EN" ? "القطة" : "Qatta"}</Text>
                                    </View>
                                </View>

                            </View>
                    }
                    {
                        this.props.User.membershipStatus === 1 ? // law mosh moshtarek
                            null
                            :
                            this.state.outGoings.map((item, index) => {
                                if (new Date(item.createdAt) >= this.state.chosenDate) {
                                    if (new Date(item.createdAt) <= this.state.chosenDateTo) {
                                        return (
                                            <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                                                <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, marginHorizontal: 18, backgroundColor: '#DBEDFA', height: 40, borderTopColor: '#FFF', borderTopWidth: 1 }]}>
                                                    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#FFF' } : { borderLeftWidth: 1, borderLeftColor: '#FFF' }]}>
                                                        <Text numberOfLines={1} style={{ color: '#000', fontSize: 12, textAlign: 'center' }} >{item.amount}</Text>
                                                    </View>
                                                    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, this.Language != "EN" ? { borderRightWidth: 1, borderRightColor: '#FFF' } : { borderLeftWidth: 1, borderLeftColor: '#FFF' }]}>
                                                        <Text numberOfLines={1} style={{ color: '#000', fontSize: 12, textAlign: 'center' }} >
                                                            {
                                                                new Date(item.createdAt).getDate()
                                                                + '-' +
                                                                new Date(item.createdAt).getMonth()
                                                                + '-' +
                                                                new Date(item.createdAt).getFullYear()
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text numberOfLines={1} style={{ color: '#000', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }} >{item.outgoingTypeID.titleAR}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }
                                } else {

                                }
                            })

                        // <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }]} >
                        //     <Accordion
                        //         sections={SECTIONS}
                        //         activeSections={this.state.activeSections}
                        //         renderSectionTitle={this._renderSectionTitle}
                        //         renderHeader={this._renderHeader}
                        //         renderContent={this._renderContent}
                        //         onChange={this._updateSections}
                        //     />
                        // </View>
                    }
                    {
                        this.props.User.membershipStatus === 1 ? // law mosh moshtarek
                            <View style={[styles.shadow, { width: '90%', height: height * 0.4, marginRight: '5%', marginLeft: '5%', backgroundColor: '#DBEDFA', justifyContent: 'center', alignItems: 'center', padding: 10, shadowOpacity: 0.15 }]} >
                                <Text style={{ textAlign: 'center' }} >
                                    {this.Language != "EN" ? "هذه الخدمة غير متاحة\n للحساب المجانى" : "This service is not available \nfor free accounts"}
                                </Text>
                            </View>
                            :
                            null
                    }

                </ScrollView>

                {
                    this.props.User.isMember || this.props.navigation.getParam('Qatta').createBy != this.props.User._id ?
                        null :
                        <View style={{ width, height: 80, backgroundColor: '#017ED4', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                            <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                <TouchableOpacity onPress={() => this.sendEmail()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "أرسل على البريد الألكترونى" : "Send to Email"}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                }



            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                {this.renderTabs()}
                <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style={{ flex: 1 }} >

                    {
                        this.state.selectedTab == 1 ?
                            this.renderTab1()
                            :
                            this.state.selectedTab == 2 ?
                                this.renderTab2()
                                :
                                this.renderTab3()
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
export default connect(mapStateToProps, {})(GroupInfo)

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
