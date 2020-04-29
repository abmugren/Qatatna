import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, KeyboardAvoidingView, Image, BackHandler, Linking } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
// import { WebView } from 'react-native-webview';
import { DrawerActions } from 'react-navigation-drawer'
import { Input, Item } from 'native-base'
import { connect } from 'react-redux' // redux
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
axios.defaults.timeout = 10000

const { width, height } = Dimensions.get('window')

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 1,
            cardHolder: '',
            cardNumber: '',
            cvv: '',
            expiryDate: '',
            expiryMonth: '',
            expiryYear: ''
        };
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('Subscribe');
        return true;
    }

    pay() {
        const thisComponent = this
        // console.log(this.state.expiryDate.slice(0, 2) + " " + "20" + this.state.expiryDate.slice(3, 5))
        // if (this.state.expiryDate.length < 5) {
        //     alert(this.Language != "EN" ? "التاريخ غير صالح" : "Date is not Valid")
        // } else {
        //     if (this.state.cardNumber.length != 16) {
        //         alert(this.Language != "EN" ? "رقم الكارت غير صالح" : "card number is not Valid")
        //     } else {
        thisComponent.setState({ Processing: true })
        try {
            axios.post('http://167.172.183.142/api/user/initialPayment2', {
                // cardHolder: 'Jane Jones', cardNumber: '4200000000000000',
                // cvv: '123', expiryMonth: '05', expiryYear: '2020',
                // amount: '92.00'
                email: 'email',
                street1: 'street1',
                city: 'city',
                state: 'state',
                country: 'country',
                postcode: 1234,
                givenName: 'givenName',
                surname: 'surname',
                cardHolder: 'Jane Jones',
                cardNumber: '4111111111111111',
                cvv: 123,
                expiryMonth: '05',
                expiryYear: '2021',
                amount: '30.00'
            }).then(function (response) {
                console.log(response)
                thisComponent.setState({ Processing: false })
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
        // }
        // }

    }

    Language = this.props.Language ? this.props.Language : "AR"

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "طرق الدفع" : "Payment methods"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} >

                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <View style={{ flex: 1, width, backgroundColor: '#81C32E' }} >
                    <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    {this.renderHeader()}

                    <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }} >

                        <View style={[styles.shadow, { height: '95%', width: "90%", backgroundColor: '#FFF' }]} >

                            {/******************************************************/}

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 16 }]}>
                                <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }} >
                                    {this.Language != "EN" ? 'اختر طريقه دفع' : 'Payment method'}
                                </Text>
                                <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                            </View>

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 16, paddingHorizontal: 14 }]}>
                                <TouchableOpacity onPress={() => this.setState({ selected: 2 })} >
                                    <Image source={require('./../../../../Images/visa.png')} style={{ width: width / 8, height: width / 8, resizeMode: 'contain', marginRight: 12 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ selected: 3 })}  >
                                    <Image source={require('./../../../../Images/MasterCard.png')} style={{ width: width / 8, height: width / 8, resizeMode: 'contain', marginRight: 12 }} />
                                </TouchableOpacity>
                            </View>

                            {/******************************************************/}

                            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 32 }]}>
                                <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }} >
                                    {this.Language != "EN" ? 'بيانات البطاقه' : 'Card details'}
                                </Text>
                                <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, height: 2, flex: 1, marginHorizontal: 18 }}></View>
                            </View>

                            {/******************************************************/}

                            <View style={[styles.row, styles.shadow, { shadowOpacity: 0.2, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]}>
                                <View style={[styles.row, { width: '90%', height: width * 0.6, borderRadius: 24, backgroundColor: '#FFF', overflow: 'hidden' }]}>

                                    {/******************************************************/}
                                    <View style={[styles.column, { flex: 0.45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }]} >

                                        <View style={[styles.row, { justifyContent: 'flex-end', alignItems: 'center' }]}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }} >
                                                {this.Language != "EN" ? 'تاريخ الانتهاء' : 'Expiration date'}
                                            </Text>
                                        </View>

                                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}>
                                            <View style={[styles.shadow, { backgroundColor: '#FFF', height: 40, flex: 1, marginHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#9F9F9F', marginBottom: 4, }]}>
                                                <Item style={{ flex: 1 }}>
                                                    <Input
                                                        defaultValue={this.state.expiryDate}
                                                        placeholder=''
                                                        style={{ color: '#000' }}
                                                        keyboardType="numeric"
                                                        textAlign={'center'}
                                                        onChangeText={(text) => this.setState({
                                                            expiryDate:
                                                                text.length <= 5 ?
                                                                    text.length == 2 ? text + "/"
                                                                        :
                                                                        text
                                                                    :
                                                                    ""
                                                        })}
                                                    />
                                                </Item>
                                            </View>
                                        </View>

                                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 16 }]}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }} >CVV</Text>
                                        </View>

                                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}>
                                            <View style={[styles.shadow, { backgroundColor: '#FFF', height: 40, flex: 1, marginHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#9F9F9F', marginBottom: 4, }]}>
                                                <Item style={{ flex: 1 }}>
                                                    <Input
                                                        defaultValue={this.state.cvv}
                                                        placeholder=''
                                                        keyboardType="numeric"
                                                        style={{ color: '#000' }}
                                                        textAlign={'center'}
                                                        onChangeText={(text) => this.setState({ cvv: text })}
                                                    />
                                                </Item>
                                            </View>
                                        </View>

                                    </View>

                                    {/******************************************************/}
                                    <View style={[styles.column, { flex: 0.55, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }]} >

                                        <View style={[styles.row, { justifyContent: 'flex-end', alignItems: 'center' }]}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }} >
                                                {this.Language != "EN" ? 'رقم البطاقه' : 'Card number'}
                                            </Text>
                                        </View>

                                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}>
                                            <View style={[styles.shadow, { backgroundColor: '#FFF', height: 40, flex: 1, marginHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#9F9F9F', marginBottom: 4, }]}>
                                                <Item style={{ flex: 1 }}>
                                                    <Input
                                                        placeholder=''
                                                        defaultValue={this.state.cardNumber}
                                                        keyboardType="numeric"
                                                        style={{ color: '#000' }}
                                                        textAlign={'center'}
                                                        onChangeText={(text) => this.setState({ cardNumber: text })}
                                                    />
                                                </Item>
                                            </View>
                                        </View>

                                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 16 }]}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }} >
                                                {this.Language != "EN" ? 'اسم حامل البطاقه' : "Owner's name"}
                                            </Text>
                                        </View>

                                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}>
                                            <View style={[styles.shadow, { backgroundColor: '#FFF', height: 40, flex: 1, marginHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#9F9F9F', marginBottom: 4, }]}>
                                                <Item style={{ flex: 1 }}>
                                                    <Input
                                                        placeholder=''
                                                        defaultValue={ this.state.cardHolder }
                                                        style={{ color: '#000' }}
                                                        textAlign={'center'}
                                                        onChangeText={(text) => this.setState({ cardHolder: text })}
                                                    />
                                                </Item>
                                            </View>
                                        </View>

                                    </View>

                                </View>
                            </View>



                        </View>

                    </View>


                    <View style={[styles.column, { width, height: height * 0.15, backgroundColor: '#FFF', borderTopLeftRadius: 38, borderTopRightRadius: 38, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { justifyContent: 'center', alignItems: 'center', marginBottom: 4 }]}>
                            <Text>{this.Language != "EN" ? "ريال سعودى" : "SAR"}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginHorizontal: 4 }} >{"30"}</Text>
                        </View>
                        <View style={[styles.column, { justifyContent: 'center', alignItems: 'center' }]} >
                            <TouchableOpacity onPress={() => this.pay()} style={[styles.row, { width: width * 0.4, justifyContent: 'center', backgroundColor: '#81C32E', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 2, paddingHorizontal: 12 }]}>
                                <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 12 }} >{this.Language != "EN" ? "أدفع القيمة" : 'Pay price'}</Text>
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
export default connect(mapStateToProps, {})(Payment)

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

/*
               <View style={{width:'100%',height:'100%'}}>

               <WebView
                 style={styles.WebViewStyle}
               source={{uri: 'http://138.68.107.172/html/payment2.html?price='+this.state.servicesData.price+'&bookingID='+this.state.bookingID}}
               javaScriptEnabled={true}
              domStorageEnabled={true}  />
               </View>
*/