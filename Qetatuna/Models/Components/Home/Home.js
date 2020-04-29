import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Image, ImageBackground, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    componentDidMount() {

        if (Platform.OS === 'ios') {
            AdMobRewarded.setTestDevices([AdMobRewarded.simulatorId]);
            // AdMobRewarded.setAdUnitID('ca-app-pub-9347551870390498/6771208472');
            AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');

            AdMobRewarded.addEventListener('rewarded', reward =>
                console.log('AdMobRewarded => rewarded', reward),
            );
            AdMobRewarded.addEventListener('adLoaded', () =>
                console.log('AdMobRewarded => adLoaded'),
            );
            AdMobRewarded.addEventListener('adFailedToLoad', error =>
                console.warn(error),
            );
            AdMobRewarded.addEventListener('adOpened', () =>
                console.log('AdMobRewarded => adOpened'),
            );
            AdMobRewarded.addEventListener('videoStarted', () =>
                console.log('AdMobRewarded => videoStarted'),
            );
            AdMobRewarded.addEventListener('adClosed', () => {
                console.log('AdMobRewarded => adClosed');
                AdMobRewarded.requestAd().catch(error => console.warn(error));
            });
            AdMobRewarded.addEventListener('adLeftApplication', () =>
                console.log('AdMobRewarded => adLeftApplication'),
            );

            AdMobRewarded.requestAd().catch(error => console.warn(error));
        } else {
            AdMobRewarded.setTestDevices([AdMobRewarded.simulatorId]);
            // AdMobRewarded.setAdUnitID('ca-app-pub-9347551870390498/8518516369');
            AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');

            AdMobRewarded.addEventListener('rewarded', reward =>
                console.log('AdMobRewarded => rewarded', reward),
            );
            AdMobRewarded.addEventListener('adLoaded', () =>
                console.log('AdMobRewarded => adLoaded'),
            );
            AdMobRewarded.addEventListener('adFailedToLoad', error =>
                console.warn(error),
            );
            AdMobRewarded.addEventListener('adOpened', () =>
                console.log('AdMobRewarded => adOpened'),
            );
            AdMobRewarded.addEventListener('videoStarted', () =>
                console.log('AdMobRewarded => videoStarted'),
            );
            AdMobRewarded.addEventListener('adClosed', () => {
                console.log('AdMobRewarded => adClosed');
                AdMobRewarded.requestAd().catch(error => console.warn(error));
            });
            AdMobRewarded.addEventListener('adLeftApplication', () =>
                console.log('AdMobRewarded => adLeftApplication'),
            );

            AdMobRewarded.requestAd().catch(error => console.warn(error));
        }


    }

    onADV() {
        // AdMobRewarded.showAd().catch(error => console.warn(error));
        AdMobRewarded.showAd().catch(error => alert(this.Language != "EN" ? "لا توجد اعلانات حاليا" : "There is no adv."));
    }

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6', shadowOpacity: 0.1 }]} >
                <View style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} ></View>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "الرئيسية" : "Home"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                {this.renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('QattaMain')} >
                        <ImageBackground source={require('./../../../Images/1.png')} imageStyle={{ borderRadius: 12, resizeMode: 'stretch' }} style={[styles.rowReverse, styles.shadow, styles.ItemStyle, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18 }]} >
                            <View style={{ height: '80%', aspectRatio: 1, backgroundColor: 'transparent' }}>
                                <Image source={require('./../../../Images/00.png')} style={{ height: null, width: null, flex: 1, resizeMode: 'stretch' }} />
                            </View>
                            <Text style={{ color: '#FFF', fontSize: 32 }} >{this.Language != "EN" ? "القطة" : "Qatta"}</Text>
                            <View style={[styles.column, { justifyContent: 'flex-end', height: '100%', paddingVertical: 16 }]} >
                                <TouchableOpacity onPress={() => this.props.User.isMember ? {} : this.props.navigation.navigate('QattaAdd')} >
                                    <Entypo name="circle-with-plus" style={{ color: '#FFF', fontSize: 26 }} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('DorayaMain')} >
                        <ImageBackground source={require('./../../../Images/2.png')} imageStyle={{ borderRadius: 12, resizeMode: 'stretch' }} style={[styles.rowReverse, styles.shadow, styles.ItemStyle, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18 }]} >
                            <View style={{ height: '80%', aspectRatio: 1, backgroundColor: 'transparent' }}>
                                <Image source={require('./../../../Images/00.png')} style={{ height: null, width: null, flex: 1, resizeMode: 'stretch' }} />
                            </View>
                            <Text style={{ color: '#FFF', fontSize: 32 }} >{this.Language != "EN" ? "الدورية" : "Doraya"}</Text>
                            <View style={[styles.column, { justifyContent: 'flex-end', height: '100%', paddingVertical: 16 }]} >
                                <TouchableOpacity onPress={() => this.props.User.isMember ? {} : this.props.navigation.navigate('DorayaAdd')} >
                                    <Entypo name="circle-with-plus" style={{ color: '#FFF', fontSize: 26 }} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('GamayaMain')} >
                        <ImageBackground source={require('./../../../Images/3.png')} imageStyle={{ borderRadius: 12, resizeMode: 'stretch' }} style={[styles.rowReverse, styles.shadow, styles.ItemStyle, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18 }]} >
                            <View style={{ height: '80%', aspectRatio: 1, backgroundColor: 'transparent' }}>
                                <Image source={require('./../../../Images/00.png')} style={{ height: null, width: null, flex: 1, resizeMode: 'stretch' }} />
                            </View>
                            <Text style={{ color: '#FFF', fontSize: 32 }} >{this.Language != "EN" ? "الجمعية" : "Gamaya"}</Text>
                            <View style={[styles.column, { justifyContent: 'flex-end', height: '100%', paddingVertical: 16 }]} >
                                <TouchableOpacity onPress={() => this.props.User.isMember ? {} : this.props.navigation.navigate('GamayaAdd')} >
                                    <Entypo name="circle-with-plus" style={{ color: '#FFF', fontSize: 26 }} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OdwayaMain')} >
                        <ImageBackground source={require('./../../../Images/4.png')} imageStyle={{ borderRadius: 12, resizeMode: 'stretch' }} style={[styles.rowReverse, styles.shadow, styles.ItemStyle, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18 }]} >
                            <View style={{ height: '80%', aspectRatio: 1, backgroundColor: 'transparent' }}>
                                <Image source={require('./../../../Images/00.png')} style={{ height: null, width: null, flex: 1, resizeMode: 'stretch' }} />
                            </View>
                            <Text style={{ color: '#FFF', fontSize: 32 }} >{this.Language != "EN" ? "العضوية" : "Groups"}</Text>
                            <View style={[styles.column, { justifyContent: 'flex-end', height: '100%', paddingVertical: 16 }]} >

                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.onADV()}
                    >
                        <ImageBackground source={require('./../../../Images/1.png')} imageStyle={{ borderRadius: 12, resizeMode: 'stretch' }} style={[styles.rowReverse, styles.shadow, styles.ItemStyle, { justifyContent: 'space-between', alignItems: 'center', justifyContent:'center', paddingHorizontal: 18 }]} >
                            <Text numberOfLines={1} style={{ color: '#FFF', fontSize: 32, fontWeight:'bold' }} >{this.Language != "EN" ? "مشاهدة اعلان" : "Watch Adv."}</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                </ScrollView>

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
export default connect(mapStateToProps, {})(Home)

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
    ItemStyle: {
        width: width - (12 * 2),
        height: height * 0.21,
        marginTop: 4,
        marginHorizontal: 12,
        shadowOpacity: 0.16
    }
})
