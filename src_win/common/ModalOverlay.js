import {View} from "react-native-windows";
import {useContext} from "react";
import {AppContext} from "../AppContext";

const ModalOverlay = () => {
    const {modalVisible} = useContext(AppContext)
    if (!modalVisible) {
        return <View></View>
    }
    return (
        <View
            style={{
                width: '100%',
                height: '100%',
                opacity: 0.2,
                backgroundColor: '#777777',
                zIndex: 9000,
                elevation: 9000,
                position: 'absolute',
                display: (modalVisible ? 'flex' : 'none')
        }}>

        </View>
    )
}

export default ModalOverlay