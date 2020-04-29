import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase'

export const SaveUser = (usr) => {
    return (dispatch) => {
        console.log(usr)
        dispatch({ type: 'SAVE_USER', payload: usr })
    }
}

export const logOut = () => {
    return async (dispatch) => {
        await AsyncStorage.clear()
        checkPermission();
        dispatch({ type: 'LOGOUT' })
    }
}

const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        getToken();
    } else {
        requestPermission();
    }
}


const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken)
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        console.log(fcmToken)
        if (fcmToken) {
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
}
const requestPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        getToken();
    } catch (error) {
        console.log('permission rejected');
    }
}