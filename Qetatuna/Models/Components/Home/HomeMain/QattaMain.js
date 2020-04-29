import React, { Component } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, BackHandler } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { DrawerActions } from 'react-navigation-drawer'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux' // redux
import axios from 'axios'
axios.defaults.timeout = 10000
import Spinner from 'react-native-loading-spinner-overlay';
import { BoxShadow } from 'react-native-shadow'

class QattaMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Qattas: [],
            QattasPaginated: [],
            pageCounter: 6,
            page: 0,
            Processing: false,
            itemHeight: 110
        };
    }

    Language = this.props.Language ? this.props.Language : "AR"

    UNSAFE_componentWillMount() {
        this.getData()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('Home');
        return true;
    }

    getData() {
        const thisComponent = this
        thisComponent.setState({ Processing: true })
        if (this.props.User.isMember) {
            try {
                axios.get('http://167.172.183.142/api/user/getQattaByMember', {
                    params: {
                        membersID: thisComponent.props.User._id,
                        // page: thisComponent.state.page,
                        // limit: "4"

                    }
                }).then(function (response) {
                    thisComponent.setState({ Processing: false })
                    if (response.data.length != 0) {
                        // thisComponent.setState({ Qattas: [...thisComponent.state.Qattas, ...response.data], page: thisComponent.state.page + 1 })
                        thisComponent.setState({ QattasPaginated: [...response.data.slice(0, thisComponent.state.pageCounter)], Qattas: [...response.data] })
                    } else {
                        thisComponent.state.Qattas.length == 0 ?
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "ليس لديك قطه" : "There is no Qattas")
                            }, 100)
                            :
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "لا يوجد مزيد" : "End of results")
                            }, 100)
                    }
                    //thisComponent.setState({ Qattas: response.data })
                    console.log(response.data)
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
        } else {
            try {
                axios.get('http://167.172.183.142/api/user/getQattaByManager', {
                    params: {
                        managerID: thisComponent.props.User._id,
                        mobile: thisComponent.props.User.mobile,
                        // page: thisComponent.state.page,
                        // limit: "4"
                    }
                }).then(function (response) {
                    thisComponent.setState({ Processing: false })
                    if (response.data.length != 0) {
                        // thisComponent.setState({ Qattas: [...thisComponent.state.Qattas, ...response.data], page: thisComponent.state.page + 1 })
                        // if (response.data.length <= 10) {
                            thisComponent.setState({ QattasPaginated: [...response.data.slice(0, thisComponent.state.pageCounter)], Qattas: [...response.data] })
                            // console.log(thisComponent.state.GamayasPaginated)
                        // }
                    } else {
                        thisComponent.state.Qattas.length == 0 ?
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "ليس لديك قطه" : "There is no Qattas")
                            }, 100)
                            :
                            setTimeout(() => {
                                alert(thisComponent.Language != 'EN' ? "لا يوجد مزيد" : "End of results")
                            }, 100)
                    }
                    // thisComponent.setState({ Qattas: response.data })
                    console.log(response.data)
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

    loadMore() {
        let arr = this.state.Qattas.slice(this.state.pageCounter, this.state.pageCounter + 6 )
        this.setState({ QattasPaginated: [ ...this.state.QattasPaginated, ...arr] })
        this.setState({ pageCounter: this.state.pageCounter + 6 })
    }

    renderHeader() {
        return (
            <View style={[styles.flex, this.Language != "EN" ? styles.row : styles.rowReverse, styles.shadow, { width, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }]} >
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handleBackButtonClick()} >
                    <Entypo name={this.Language != "EN" ? "chevron-left" : "chevron-right"} style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
                <Text style={{ color: '#000', fontSize: 16 }}>{this.Language != "EN" ? "القطة" : "Qatta"}</Text>
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} >
                    <Entypo name="dots-three-vertical" style={{ color: '#000', fontSize: 22 }} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const shadowOpt = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 1, // width of shadow
            opacity: 0.2,
            x: 2,
            y: 2,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt2 = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 2, // width of shadow
            opacity: 0.2,
            x: 3,
            y: 3,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt3 = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 3, // width of shadow
            opacity: 0.1,
            x: 4,
            y: 4,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }
        const shadowOpt4 = {
            width: width * 0.9, height: this.state.itemHeight, // height & width of child element
            radius: 26, // border radius of child element
            color: "#000", // shadow color
            border: 5, // width of shadow
            opacity: 0.1,
            x: 5,
            y: 5,
            // style: [ styles.shadow, { marginVertical: 15, elevation: 20 }]
        }

        return (
            <SafeAreaView style={styles.container} >
                <View style={{ flex: 1, width }} >

                    <StatusBar backgroundColor='#FFF' barStyle="dark-content" />
                    <Spinner
                        visible={this.state.Processing}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />
                    {this.renderHeader()}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }} >
                        {
                            this.state.QattasPaginated.map((item, index) => {
                                return (
                                    item.data ?
                                        <View key={index.toString()} style={[styles.row, { width, justifyContent: 'center', alignItems: 'center', marginTop: 16 }]} >
                                            <TouchableOpacity activeOpacity={1}
                                                onPress={() => this.props.navigation.navigate('QattaHome', { Qatta: this.props.User.isMember ? item.data.qattaID : item.data, qattaMemberID: item.data._id })}
                                                style={[styles.shadow, { elevation: 10, backgroundColor: '#FFF', borderRadius: 26 }]} >
                                                <BoxShadow setting={shadowOpt}>
                                                    <BoxShadow setting={shadowOpt2}>
                                                        <BoxShadow setting={shadowOpt3}>
                                                            <BoxShadow setting={shadowOpt4}>
                                                                <View
                                                                    style={[styles.row, {
                                                                        position: "relative",
                                                                        width: width * 0.9, minHeight: 110,
                                                                        backgroundColor: '#017ED4', borderRadius: 26,
                                                                    }]}
                                                                    onLayout={( event ) => {
                                                                        var { x, y, width, height } = event.nativeEvent.layout;
                                                                        height > this.state.itemHeight ?
                                                                            this.setState({ itemHeight: height }) : {}
                                                                    }}
                                                                >
                                                                    <View style={[styles.column, { flex: 1, justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8 }]}>

                                                                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', justifyContent: 'flex-start', alignItems: 'center' }]} >
                                                                            <Text style={{ color: '#FFF', textAlign: 'left', fontSize: 10 }} >{item.membersNumber.length}{this.Language != "EN" ? " اعضاء " : " Members "}</Text>
                                                                        </View>

                                                                        <View style={[styles.row, { width: '100%', justifyContent: 'center', alignItems: 'center' }]} >
                                                                            <Text numberOfLines={1} style={{ color: '#FFF', textAlign: 'center', fontSize: 26, fontWeight: 'bold' }} >{this.props.User.isMember ? item.data.qattaID.group : item.data.group}</Text>
                                                                        </View>

                                                                        <View style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: '100%', justifyContent: 'flex-start', alignItems: 'center' }]} >
                                                                            <TouchableOpacity style={{ backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                                                                                <Text style={{ color: '#017ED4', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.props.User.isMember ? item.data.qattaID.totalValue : item.data.totalValue}{this.Language != "EN" ? " ر.س " : " SAR "}</Text>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                    </View>

                                                                </View>
                                                            </BoxShadow>
                                                        </BoxShadow>
                                                    </BoxShadow>
                                                </BoxShadow>
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                )
                            })
                        }

                        {
                            // !this.props.Processing ?
                            this.state.pageCounter < this.state.Qattas.length ?
                                <TouchableOpacity
                                    style={[styles.flex, { padding: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: '#017ED4', marginHorizontal: 18, marginTop: 20, marginBottom: 14 }]}
                                    onPress={() => this.loadMore()}
                                >
                                    <Text style={{ color: '#FFF' }}>
                                        {this.Language != "EN" ? "عرض المزيد" : "Load More"}
                                    </Text>
                                </TouchableOpacity>
                                :
                                <View></View>
                            // :
                            // <View></View>
                        }

                    </ScrollView>

                    {
                        this.props.User.isMember ?
                            null :
                            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width, height: 80, backgroundColor: '#FFF', borderTopLeftRadius: 38, borderTopRightRadius: 38 }} >

                                <View style={[styles.row, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} >
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('QattaAdd')} style={[this.Language != "EN" ? styles.row : styles.rowReverse, { width: width * 0.5, justifyContent: 'space-between', backgroundColor: '#017ED4', paddingVertical: 8, borderRadius: 16, borderColor: '#0069B1', borderWidth: 1, paddingHorizontal: 12 }]}>
                                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{" "}</Text>
                                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }} >{this.Language != "EN" ? "أضافة قطة" : "Add Qatta"}</Text>
                                        <Text style={{ color: '#000', textAlign: 'center', fontSize: 12 }} >{"+"}</Text>
                                    </TouchableOpacity>
                                </View>

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
export default connect(mapStateToProps, {})(QattaMain)

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