import React, {useState} from "react"
import {View} from "react-native-windows"
import {appUUIDFromStorage} from "../src_shared/utils/native/appUUIDFromStorage";
import MasterPasswordModal from "./passwordBroker/components/MasterPasswordModal";
import {APP_TYPE_WIN} from "../src_shared/constants/AppType";

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

    const showMasterPasswordModal = () => {
        modalShow(<MasterPasswordModal/>, {width: 700})
    }

    const closeMasterPasswordModal = () => {
        modalClose()
    }

    return (
        <AppContext.Provider
            value={{
                hostURL: hostURL,
                appType: APP_TYPE_WIN,

                modalContent: modalContent,
                modalStyle: modalStyle,
                modalVisible: modalVisible,
                modalShow: modalShow,
                modalClose: modalClose,
                getAppUUId: getAppUUId,

                showMasterPasswordModal: showMasterPasswordModal,
                closeMasterPasswordModal: closeMasterPasswordModal,
            }}
            >
            {props.children}
        </AppContext.Provider>
    )
}

export {AppContext, AppProvider}