import React, {useContext} from 'react'
import { View } from 'react-native-windows'
import Draggable from "react-native-draggable";
import {AppContext} from "../AppContext";
import tw from "twrnc";
const Modal = (props) => {

    const {
        modalVisible,
        modalContent,
        modalStyle,
    } = useContext(AppContext)

    if (!modalVisible) return (<View />)

    const style = {
        position: 'absolute',
        zIndex: 10000,
        elevation: 10000,
    }

    console.log({...tw`p-4 rounded bg-slate-700`, ...modalStyle})

    return (
        <View style={style}>
            <Draggable x={100} y={0} z={style.zIndex}>
                <View style={{...tw`p-4 rounded-lg bg-slate-700`, ...modalStyle}}>
                    {modalContent}
                </View>
            </Draggable>
        </View>
    )
}
export default Modal