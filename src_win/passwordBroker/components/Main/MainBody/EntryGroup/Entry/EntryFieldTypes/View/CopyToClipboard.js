import React, {useContext, useRef} from 'react';
import * as Animatable from 'react-native-animatable';
import tw from 'twrnc';
import {Text, TouchableWithoutFeedback, View} from 'react-native-windows';
import AppContext from '../../../../../../../../AppContext';

const CopyToClipboard = ({value, style, children}) => {
    const {copyToClipboard} = useContext(AppContext);
    const refTarget = useRef();
    const copyClickHandler = () => {
        if (typeof value !== 'string' || value === '') {
            return;
        }
        copyToClipboard(value);
        refTarget.current.setNativeProps({style: {opacity: 1}});
        setTimeout(() => {
            refTarget.current.duration = 1500;
            refTarget.current.animate('fadeOut');
        }, 300);
    };

    return (
        <TouchableWithoutFeedback onPress={copyClickHandler}>
            <View style={{...style, ...tw`flex flex-row flex-wrap`}}>
                <Animatable.View ref={refTarget} style={tw`opacity-0 absolute left--13 bg-sky-200 rounded px-1`}>
                    <Text style={tw`text-slate-800`}>copied</Text>
                </Animatable.View>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default CopyToClipboard;
