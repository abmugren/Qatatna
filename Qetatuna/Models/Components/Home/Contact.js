import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, BackHandler } from 'react-native';
import { Textarea } from 'native-base'
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            Processing: false
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("Home");
        return true;
    }

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "تواصل معنا" : "Contact Us"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    send() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        if (this.state.description.length < 2) {
            thisComponent.setState({ Processing: false })
            alert(thisComponent.Language != "EN" ? "الرجاء كتابه رساله" : "Please enter message")
        } else {
            try {
                axios.post("http://167.172.183.142/api/user/ContactUs", {
                    msg: this.state.description,
                    managerID: this.props.User._id
                }).then(response => {
                    thisComponent.setState({ Processing: false })

                    alert(thisComponent.Language != "EN" ? "تم" : "Done")
                    thisComponent.props.navigation.navigate('Home');
                    console.log(response)
                    //this.setState({ titleAr: response.data[0].titleAr, titleEN: response.data[0].titleEN })
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-evenly' }} >

                    <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image source={require('./../../../Images/Logo.png')} style={styles.image} />
                        </View>
                    </View>

                    <View style={[styles.column, { width }]} >
                        <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                            <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 18, }]} >
                                <Text style={{ fontSize: 22, color: '#000', marginTop: 18 }} >
                                    {this.Language != "EN" ? 'اكتب رسالتك' : 'Write your message'}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 12, marginHorizontal: 18 }]}>
                            <View style={[styles.shadow, { flex: 1, backgroundColor: '#FFF', marginHorizontal: 0, borderRadius: 12, shadowOpacity: 0.1, elevation: 5 }]} >
                                <Textarea
                                    defaultValue={this.state.description}
                                    onChangeText={(text) => this.setState({ description: text })}
                                    style={{ flex: 1, height: 140, textAlign: this.Language != "EN" ? 'right' : 'left' }}
                                    placeholder={this.Language != "EN" ? "اكتب هنا" : "Write here"}
                                />
                            </View>
                        </View>
                    </View>

                </ScrollView>

                <View style={{ width, height: 80, backgroundColor: '#81C32E', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                    <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                        <TouchableOpacity onPress={() => this.send()} style={[styles.row, { width: width * 0.5, justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 8, borderRadius: 16, borderColor: '#6DB611', borderWidth: 1, paddingHorizontal: 12 }]}>
                            <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "أرسال" : "Send"}</Text>
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
export default connect(mapStateToProps, {})(Contact)

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
    image: {
        width: '85%',
        aspectRatio: 2,
        resizeMode: 'stretch'
    },
    button: {
        backgroundColor: '#F67534',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 8,
        borderRadius: 18,
        marginTop: 46
    }
})