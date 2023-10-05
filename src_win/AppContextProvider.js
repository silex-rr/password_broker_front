import React, {useState} from 'react';
import {View} from 'react-native-windows';
import {appUUIDFromStorage} from '../src_shared/utils/native/appUUIDFromStorage';
import MasterPasswordModal from './passwordBroker/components/MasterPasswordModal';
import {APP_TYPE_WIN} from '../src_shared/constants/AppType';
import AppContext from './AppContext';
import Clipboard from '@react-native-clipboard/clipboard';
//import * as RNFS from 'react-native-fs';
import * as RNFS from '@dr.pogodin/react-native-fs';
import URI from 'uri-js';
//    "react-native-fs": "github:silex-rr/react-native-fs#dev",
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

    const downloadFile = (uri, fileName = '', storageDirectory = '') => {
        if (storageDirectory === '') {
            storageDirectory = RNFS.DownloadDirectoryPath;
        }
        if (fileName.length === 0) {
            const {path} = URI.parse(uri);
            fileName = path.split('/').pop();
        }
        return RNFS.downloadFile({
            fromUrl: uri,
            toFile: storageDirectory + fileName,
        }).promise;
    };

    const writeFile = (content, fileName, fileMime = '', storageDirectory = '') => {
        if (storageDirectory === '') {
            storageDirectory = RNFS.DocumentDirectoryPath; //RNFS.DownloadDirectoryPath;
        }
        // storageDirectory = storageDirectory.replace('/', '\\');
        const path =
            storageDirectory +
            (storageDirectory.length === 0 || storageDirectory.slice(-1) !== '\\' ? '\\' : '') +
            fileName;
        console.log(path);
        return RNFS.writeFile(path, content);
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

                writeFile: writeFile,
                downloadFile: downloadFile,
            }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
