import React, { Component } from 'react';
import { View, Text, Share } from 'react-native';

export default class ShareApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.navigate('Home')
        this.onShare()
    }

    onShare = async () => {
        const thisComponent = this
        try {
            const result = await Share.share({
                message:
                    'App Url',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    // thisComponent.props.navigation.navigate("Home")
                } else {
                    // shared
                    // thisComponent.props.navigation.navigate("Home")

                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                // thisComponent.props.navigation.navigate("Home")

            }
        } catch (error) {
            alert(error.message);
            thisComponent.props.navigation.navigate("Home")
        }
    };

    render() {
        return (
            <View>

            </View>
        );
    }
}
