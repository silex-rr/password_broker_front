import React, {useState} from "react"
import {View} from "react-native-windows"
import {appUUIDFromStorage} from "../src_shared/utils/native/appUUIDFromStorage";

const AppContext = React.createContext()

const AppProvider = (props) => {
    const hostURL = 'http://dev-back.jrvs.ru'
    const [modalContent, setModalContent] = useState(<View></View>)
    const [modalStyle, setModalStyle] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [appUUID, setAppUUID] = useState(null)

    const getAppUUId = async () => {
        if (appUUID) {
            return appUUID
        }
        const uuid = await appUUIDFromStorage()
        setAppUUID(uuid)

        return uuid
    }
    const modalShow = (content, style) => {
        setModalContent(content)
        setModalStyle(style)
        setModalVisible(true)
    }
    const modalClose = () => {
        setModalVisible(false)
        setModalContent(<View></View>)
        setModalStyle({})
    }

    return (
        <AppContext.Provider
            value={{
                hostURL: hostURL,

                modalContent: modalContent,
                modalStyle: modalStyle,
                modalVisible: modalVisible,
                modalShow: modalShow,
                modalClose: modalClose,
                getAppUUId: getAppUUId,
            }}
            >
            {props.children}
        </AppContext.Provider>
    )
}

export {AppContext, AppProvider}