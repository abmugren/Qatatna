import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window')

export default class ChooseLoginType extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    loginManager() {
        this.props.navigation.navigate('LoginManager')
    }

    loginMember() {
        this.props.navigation.navigate('LoginMember')
    }

    goRegister() {
        this.props.navigation.navigate('Register')
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />

                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                    <Image source={require('./../../Images/Logo.png')} style={[styles.image]} />
                </View>

                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]} >
                    <Text style={{ textAlign: 'center', marginTop: 50, fontWeight:'bold' }} >{"تسجيل دخول"}</Text>
                </View>

                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity onPress={() => this.loginManager()} style={[styles.Button, styles.shadow, { backgroundColor: '#E5F1D7', elevation:5, borderColor: '#8AD032', borderWidth: 3, marginTop: 12, borderRadius: 14, shadowOpacity:0.05 }]} >
                        <Text style={{ color: '#343434', fontSize: 14, fontWeight: 'bold' }}>
                            {'مدير مجموعة'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity onPress={() => this.loginMember()} style={[styles.Button, styles.shadow, { backgroundColor: '#E5F1D7', elevation:5, borderColor: '#8AD032', borderWidth: 3, marginTop: 8, borderRadius: 14, shadowOpacity:0.05 }]} >
                        <Text style={{ color: '#343434', fontSize: 14, fontWeight: 'bold' }}>
                            {'عضو داخل مجموعة'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.row, { width, justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity onPress={() => this.goRegister()} style={[styles.Button, styles.shadow, { backgroundColor: '#8AD032', elevation:5, borderColor: '#3E9545', borderWidth: 4, marginTop: 40, borderRadius: 60, shadowOpacity:0.05 }]} >
                        <Text style={{ color: '#343434', fontSize: 19, fontWeight: 'bold' }}>
                            {'أنشاء حساب'}
                        </Text>
                    </TouchableOpacity>
                </View>
                
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
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
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    image: {
        width: width - (36 * 4),
        // height: height * 0.2,
        aspectRatio: 1.8,
        resizeMode: 'stretch'
    },
    Button: {
        width: width - (36 * 2) + 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginHorizontal: 36
    },
})