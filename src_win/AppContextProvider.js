import React, {useState} from 'react';
import {View} from 'react-native-windows';
import {appUUIDFromStorage} from '../src_shared/utils/native/appUUIDFromStorage';
import MasterPasswordModal from './passwordBroker/components/MasterPasswordModal';
import {APP_TYPE_WIN} from '../src_shared/constants/AppType';
import AppContext from './AppContext';
import Clipboard from '@react-native-clipboard/clipboard';

const AppContextProvider = props => {
    const hostURL = 'http://dev-back.jrvs.ru';
    const [modalContent, setModalContent] = useState(<View />);
    const [modalStyle, setModalStyle] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [appUUID, setAppUUID] = useState(null);

    const getAppUUId = async () => {
        if (appUUID) {
            return appUUID;
        }
        const uuid = await appUUIDFromStorage();
        setAppUUID(uuid);

        return uuid;
    };
    const modalShow = (content, style) => {
        setModalContent(content);
        setModalStyle(style);
        setModalVisible(true);
    };
    const modalClose = () => {
        setModalVisible(false);
        setModalContent(<View />);
        setModalStyle({});
    };

    const showMasterPasswordModal = () => {
        modalShow(<MasterPasswordModal />, {width: 700});
    };

    const closeMasterPasswordModal = () => {
        modalClose();
    };

    const copyToClipboard = text => {
        Clipboard.setString(text);
    };

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

                copyToClipboard: copyToClipboard,
            }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
