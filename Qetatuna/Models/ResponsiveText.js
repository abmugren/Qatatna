import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class ResponsiveText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: null,
            fontSize: this.props.fontSize
        };
    }
    /* 
        ****************** Usage ******************
        <View style={{ width: "30%", height: 40, backgroundColor: 'powderblue', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }}>
            <ResponsiveText text="Hello World" fontWeight="bold" color="#FFF" fontSize={30} />
        </View>
        *******************************************
    
    */

    render() {
        /**** Props ****/
        const text = this.props.text
        const fontSize = this.props.fontSize
        const color = this.props.color
        const fontWeight = this.props.fontWeight
        const textAlign = this.props.textAlign
        /** Calculated **/
        const letterWidth = 0.65
        // console.log( " tl * lw = " + (text.length * letterWidth) )
        const scaled = this.state.width / (text.length * letterWidth)
        // console.log("Scaled " + scaled)
        const FS = scaled > fontSize ? fontSize : scaled
        // console.log("Font size " + FS)
        // this.setState({ fontSize:FS })
        /****************/
        return (
            <View
                style={{ width: "100%" }}
                onLayout={(event) => {
                    var { x, y, width, height } = event.nativeEvent.layout;
                    !this.state.width && this.state.fontSize == 0 ? {} : this.setState({ width, fontSize: FS })
                    // console.log(width + " state width " + this.state.width + " fontSize " + FS + " State FS " + this.state.fontSize)
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{ fontSize: this.state.fontSize, color, fontWeight, textAlign }}
                >
                    {text}
                </Text>
            </View>
        )
    }
}