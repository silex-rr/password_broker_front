import React, {useContext, useState} from 'react';
import PasswordBrokerContext from './PasswordBrokerContext';
import {FIELD_ADDING_AWAIT, FIELD_ADDING_IN_PROGRESS} from '../constants/EntryGroupEntryFieldAddingStates';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
} from '../constants/MainBodyEntryGroupEntryFieldTypes';
import FormData from 'form-data';
import {APP_TYPE_WIN} from '../../constants/AppType';
import {formDataToObject} from '../../utils/formDataToObject';
import axios from 'axios';
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from '../constants/MasterPasswordStates';
import EntryFieldContext from './EntryFieldContext';

const EntryFieldContextProvider = props => {
    const {baseUrl, masterPassword, setMasterPassword, setMasterPasswordState, AppContext} =
        useContext(PasswordBrokerContext);

    const {appType} = useContext(AppContext);

    const [addingFieldState, setAddingFieldState] = useState(FIELD_ADDING_AWAIT);

    const [addingFieldType, setAddingFieldType] = useState(FIELD_TYPE_PASSWORD);
    const [addingFieldValue, setAddingFieldValue] = useState('');
    const [addingFieldLogin, setAddingFieldLogin] = useState('');
    const [addingFieldFile, setAddingFieldFile] = useState(null);
    const [addingFieldTitle, setAddingFieldTitle] = useState('');
    const [masterPasswordInput, setMasterPasswordInput] = useState('');
    const [errorMessage, setErrorMessage] = useState([]);

    const addNewField = (entryGroupId, entryId) => {
        if (addingFieldState !== FIELD_ADDING_AWAIT) {
            return;
        }
        let masterPasswordForm = masterPassword;
        if (masterPassword === '') {
            setMasterPassword(masterPasswordInput);
            masterPasswordForm = masterPasswordInput;
        }

        setAddingFieldState(FIELD_ADDING_IN_PROGRESS);

        let data = new FormData();
        data.append('title', addingFieldTitle);
        data.append('type', addingFieldType);
        data.append('master_password', masterPasswordForm);

        switch (addingFieldType) {
            default:
                break;
            case FIELD_TYPE_PASSWORD:
                data.append('login', addingFieldLogin);
            // eslint-disable-next-line no-fallthrough
            case FIELD_TYPE_LINK:
            case FIELD_TYPE_NOTE:
                data.append('value', addingFieldValue);
                break;
            case FIELD_TYPE_FILE:
                data.append('file', addingFieldFile);
                break;
        }

        // Have to convert FormData to common obj bcz Axios has been broken since v 0.25 for React Native
        if (appType === APP_TYPE_WIN) {
            data = formDataToObject(data);
        }
        return new Promise((resolve, reject) => {
            axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields', data).then(
                response => {
                    setMasterPasswordState(MASTER_PASSWORD_VALIDATED);
                    beforeModalOpen();
                    resolve(response);
                },
                error => {
                    let errMsg = [];
                    // const addFieldErrKey = 'addFieldErr_';
                    if (error.response) {
                        if (error.response.data.errors.master_password) {
                            if (error.response.data.errors.master_password === 'invalid') {
                                errMsg.push('MasterPassword is invalid');
                            } else {
                                errMsg.push('MasterPassword is missing');
                            }
                            setMasterPasswordState(MASTER_PASSWORD_INVALID);
                            setMasterPassword('');
                        }
                        if (error.response.data.errors.value) {
                            errMsg.push('Field Value is missing');
                        }
                        if (error.response.data.errors.title) {
                            errMsg.push(error.response.data.errors.title[0]);
                        }
                    }

                    if (errMsg.length) {
                        setErrorMessage(errMsg);
                    } else {
                        setErrorMessage([error.message]);
                    }
                    setAddingFieldState(FIELD_ADDING_AWAIT);
                    reject(error);
                },
            );
        });
    };

    const changeType = value => {
        setAddingFieldValue('');
        setAddingFieldFile(null);
        setAddingFieldType(value);
    };

    const changeValue = (value, file = null) => {
        setAddingFieldValue(value);
        setAddingFieldFile(file);
    };
    const changeTitle = value => {
        setAddingFieldTitle(value);
    };
    const changeLogin = value => {
        setAddingFieldLogin(value);
    };

    const changeMasterPassword = value => {
        setMasterPasswordInput(value);
    };

    const beforeModalOpen = () => {
        setAddingFieldTitle('');
        setAddingFieldValue('');
        setAddingFieldFile(null);
        setAddingFieldType(FIELD_TYPE_PASSWORD);
        setMasterPasswordInput('');
        setAddingFieldLogin('');
        setErrorMessage([]);
        setAddingFieldState(FIELD_ADDING_AWAIT);
    };

    return (
        <EntryFieldContext.Provider
            value={{
                addNewField: addNewField,
                beforeModalOpen: beforeModalOpen,
                addingFieldType: addingFieldType,
                changeLogin: changeLogin,
                addingFieldLogin: addingFieldLogin,
                changeValue: changeValue,
                addingFieldValue: addingFieldValue,
                masterPasswordInput: masterPasswordInput,
                changeMasterPassword: changeMasterPassword,
                addingFieldTitle: addingFieldTitle,
                changeTitle: changeTitle,
                changeType: changeType,
                addingFieldState: addingFieldState,
                errorMessage: errorMessage,
            }}>
            {props.children}
        </EntryFieldContext.Provider>
    );
};

export default EntryFieldContextProvider;
