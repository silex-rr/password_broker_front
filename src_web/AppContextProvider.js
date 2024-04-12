import React, {useRef, useState} from 'react';
import {APP_TYPE_WEB} from '../src_shared/constants/AppType';
import AppContext from './AppContext';
import {stringToBlob} from '../src_shared/utils/stringToBlob';
import copy from 'copy-to-clipboard';
import {THEME_DARK, THEME_LIGHT} from '../src_shared/constants/ThemeMode';

const AppContextProvider = props => {
    const masterPasswordModalVisibilityCheckboxRef = useRef();
    const masterPasswordModalVisibilityErrorRef = useRef();
    const [masterPasswordModalIsVisible, setMasterPasswordModalIsVisible] = useState(false);
    const [themeMode, setThemeMode] = React.useState(
        window.matchMedia('(prefers-color-scheme: dark)') ? THEME_DARK : THEME_LIGHT,
    );
    const showMasterPasswordModal = (errorText = '') => {
        const masterPasswordModalVisibilityCheckbox = masterPasswordModalVisibilityCheckboxRef.current;
        const masterPasswordModalVisibilityError = masterPasswordModalVisibilityErrorRef.current;

        if (!masterPasswordModalVisibilityCheckbox.checked) {
            masterPasswordModalVisibilityCheckbox.click();
        }
        masterPasswordModalVisibilityError.textContent = errorText;

        const classList = masterPasswordModalVisibilityError.classList;
        if (errorText !== '') {
            classList.add('mt-8');
            classList.add('py-1.5');
        } else {
            classList.remove('mt-8');
            classList.remove('py-1.5');
        }
    };
    const closeMasterPasswordModal = () => {
        const modalVisibilityCheckbox = masterPasswordModalVisibilityCheckboxRef.current;
        const masterPasswordModalVisibilityError = masterPasswordModalVisibilityErrorRef.current;
        modalVisibilityCheckbox.checked = false;
        masterPasswordModalVisibilityError.text = '';
    };

    const writeFile = (content, fileName, fileMime = '', storageDirectory = '') => {
        const blob = stringToBlob(content, fileMime);
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const toggleThemeMode = () => {
        setThemeMode(curTheme => (curTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK));
    };

    React.useEffect(() => {
        if (themeMode !== THEME_DARK) {
            setThemeMode(THEME_DARK);
            return;
        }
        document.querySelector('html').setAttribute('data-themeMode', themeMode);
    }, [themeMode]);

    return (
        <AppContext.Provider
            value={{
                appType: APP_TYPE_WEB,
                hostURL: process.env.REACT_APP_PASSWORD_BROKER_HOST,
                showMasterPasswordModal: showMasterPasswordModal,
                closeMasterPasswordModal: closeMasterPasswordModal,
                masterPasswordModalVisibilityCheckboxRef: masterPasswordModalVisibilityCheckboxRef,
                masterPasswordModalVisibilityErrorRef: masterPasswordModalVisibilityErrorRef,
                masterPasswordModalIsVisible: masterPasswordModalIsVisible,
                setMasterPasswordModalIsVisible: setMasterPasswordModalIsVisible,
                copyToClipboard: copy,
                themeMode: themeMode,
                toggleThemeMode: toggleThemeMode,

                writeFile: writeFile,
            }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
