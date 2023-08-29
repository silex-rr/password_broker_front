import React from "react";
// import {ClockLoader} from "react-spinners";
// import {FaCopy, FaDownload, FaEdit, FaHistory, FaRegEye, FaRegEyeSlash, FaTrashAlt} from "react-icons/fa";
import {ActivityIndicator, Pressable, Text, View} from "react-native-windows";
import tw from "twrnc";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const EntryFieldButton = ({icon, onclick, tip, colour = '', loading = false}) => {

    let iconElement = (<View></View>)

    const iconSize = 24
    const iconColor='#f1f5f9'

    switch (icon) {
        case 'FaCopy':
            iconElement = <MaterialCommunityIcons name='content-copy' size={iconSize} color={iconColor} />
            break;
        case 'FaDownload':
            iconElement = <MaterialCommunityIcons name='download' size={iconSize} color={iconColor} />
            break;
        case 'FaEdit':
            iconElement = <MaterialCommunityIcons name='note-edit' size={iconSize} color={iconColor} />
            break;
        case 'FaHistory':
            iconElement = <MaterialCommunityIcons name='history' size={iconSize} color={iconColor} />
            break;
        case 'FaRegEye':
            iconElement = <MaterialCommunityIcons name='eye-outline' size={iconSize} color={iconColor} />
            break;
        case 'FaRegEyeSlash':
            iconElement = <MaterialCommunityIcons name='eye-off-outline' size={iconSize} color={iconColor} />
            break;
        case 'FaTrashAlt':
            iconElement = <MaterialCommunityIcons name='trash-can' size={iconSize} color={iconColor} />
            break;
    }

    if (loading) {
        const color = "#f1f5f9"
        return (
            <View className="ml-1 w-7 items-baseline pt-0.5">
                <ActivityIndicator size="small" color={color} />
                {/*<ClockLoader*/}
                {/*    color={color}*/}
                {/*    size={20}*/}
                {/*    aria-label="Loading Spinner"*/}
                {/*    data-testid="loader"*/}
                {/*    speedMultiplier={1}*/}
                {/*/>*/}
            </View>
        )
    }
    colour = colour === '' ? 'text-slate-100' : colour
    //focus:outline-none
    return (
        <View
            style={tw`${colour}  ml-2 w-7 items-baseline`}
            onPress={onclick}
            // data-tip={tip}
        >
            {iconElement}
        </View>
    )
}

export default EntryFieldButton