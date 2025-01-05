import React, {useContext, useState} from 'react';
import PasswordBrokerContext from './PasswordBrokerContext';
import {FIELD_ADDING_AWAIT, FIELD_ADDING_IN_PROGRESS} from '../constants/EntryGroupEntryFieldAddingStates';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
    FIELD_TYPE_TOTP,
} from '../constants/MainBodyEntryGroupEntryFieldTypes';
import FormData from 'form-data';
import {APP_TYPE_WIN} from '../../constants/AppType';
import {formDataToObject} from '../../utils/formDataToObject';
import axios from 'axios';
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from '../constants/MasterPasswordStates';
import EntryFieldContext from './EntryFieldContext';
import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_EDITING,
    FIELD_EDITING_IN_PROGRESS,
    FIELD_EDITING_MODAL_SHOULD_BE_CLOSE,
} from '../constants/EntryGroupEntryFieldEditingStates';
import {ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING} from '../constants/EntryGroupEntryFieldsStatus';
import {ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_DEFAULT} from '../constants/EntryGroupEntryFieldTOTPAlgorithms';

const EntryFieldContextProvider = props => {
    const {
        baseUrl,
        masterPassword,
        setMasterPassword,
        setMasterPasswordState,
        AppContext,
        entryGroupFieldForEditState,
        setEntryGroupFieldForEditState,
        passwordGenerator,
    } = useContext(PasswordBrokerContext);

    const TOTP_DEFAULT_TIMEOUT = 30;

    const {appType} = useContext(AppContext);

    const [addingFieldState, setAddingFieldState] = useState(FIELD_ADDING_AWAIT);

    const [addingFieldType, setAddingFieldType] = useState(FIELD_TYPE_PASSWORD);
    const [addingFieldValue, setAddingFieldValue] = useState('');
    const [addingFieldLogin, setAddingFieldLogin] = useState('');
    const [addingFieldTOTPAlgorithm, setAddingFieldTOTPAlgorithm] = useState(
        ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_DEFAULT,
    );
    const [addingFieldTOTPTimeout, setAddingFieldTOTPTimeout] = useState(TOTP_DEFAULT_TIMEOUT);
    const [addingFieldFile, setAddingFieldFile] = useState(null);
    const [addingFieldTitle, setAddingFieldTitle] = useState('');
    const [masterPasswordInput, setMasterPasswordInput] = useState('');
    const [errorMessage, setErrorMessage] = useState([]);

    const addNewField = (entryGroupId, entryId) => {
        if (addingFieldState === FIELD_ADDING_IN_PROGRESS) {
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
            case FIELD_TYPE_TOTP:
                data.append('totp_hash_algorithm', addingFieldTOTPAlgorithm);
                data.append('totp_timeout', addingFieldTOTPTimeout);
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
                        if (error.response.data?.errors) {
                            Object.keys(error.response.data.errors).forEach(err => {
                                if (['value_encrypted', 'initialization_vector', 'master_password'].includes(err)) {
                                    return;
                                }
                                if (err === 'value') {
                                    errMsg.push('Field Value is missing');
                                    return;
                                }
                                if (err === 'file') {
                                    if (addingFieldType === FIELD_TYPE_FILE) {
                                        errMsg.push('Field File is missing');
                                    }
                                    return;
                                }
                                errMsg.push(error.response.data.errors[err][0]);
                            });
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

    const updateField = (entryGroupId, entryId, entryGroupFieldForEditId, setEntryFieldsStatus, type) => {
        if (entryGroupFieldForEditState !== FIELD_EDITING_EDITING) {
            return;
        }
        let masterPasswordForm = masterPassword;
        if (masterPassword === '') {
            setMasterPassword(masterPasswordInput);
            masterPasswordForm = masterPasswordInput;
        }

        setEntryGroupFieldForEditState(FIELD_EDITING_IN_PROGRESS);

        let data = new FormData();
        data.append('title', addingFieldTitle);
        data.append('master_password', masterPasswordForm);
        switch (type) {
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
                break;
            case FIELD_TYPE_TOTP:
                data.append('totp_hash_algorithm', addingFieldTOTPAlgorithm);
                data.append('totp_timeout', addingFieldTOTPTimeout);
                data.append('value', addingFieldValue);
                break;
        }
        data.append('_method', 'put');
        if (appType === APP_TYPE_WIN) {
            data = formDataToObject(data);
        }
        axios
            .post(
                baseUrl +
                    '/entryGroups/' +
                    entryGroupId +
                    '/entries/' +
                    entryId +
                    '/fields/' +
                    entryGroupFieldForEditId,
                data,
            )
            .then(
                () => {
                    beforeModalOpen();
                    setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING);
                    setEntryGroupFieldForEditState(FIELD_EDITING_MODAL_SHOULD_BE_CLOSE);
                    setMasterPasswordState(MASTER_PASSWORD_VALIDATED);
                },
                error => {
                    let errMsg = [];
                    const editFieldErrKey = 'editFieldErr_';
                    if (error.response.data.errors.master_password) {
                        if (error.response.data.errors.master_password === 'invalid') {
                            errMsg.push(<p key={editFieldErrKey + errMsg.length}>MasterPassword is invalid</p>);
                        } else {
                            errMsg.push(<p key={editFieldErrKey + errMsg.length}>MasterPassword is missing</p>);
                        }
                        setMasterPasswordState(MASTER_PASSWORD_INVALID);
                        setMasterPassword('');
                    }
                    if (error.response.data.errors.value) {
                        errMsg.push(<p key={editFieldErrKey + errMsg.length}>Field Value is missing</p>);
                    }
                    if (error.response.data.errors.title) {
                        errMsg.push(<p key={editFieldErrKey + errMsg.length}>{error.response.data.errors.title[0]}</p>);
                    }

                    if (errMsg.length) {
                        setErrorMessage(errMsg);
                    } else {
                        setErrorMessage([error.message]);
                    }
                    setEntryGroupFieldForEditState(FIELD_EDITING_AWAIT);
                },
            );
        //     },
        //     (error) => {
        //         setErrorMessage(error.message)
        //         setAddingFieldState(FIELD_ADDING_AWAIT)
        //     }
        // )
    };

    const changeType = value => {
        setAddingFieldFile(null);
        setAddingFieldType(value);

        setAddingFieldValue(value === FIELD_TYPE_PASSWORD ? passwordGenerator.generate() : '');
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

    const changeTOTPAlgorithm = value => {
        setAddingFieldTOTPAlgorithm(value);
    };

    const changeTOTPTimeout = value => {
        setAddingFieldTOTPTimeout(value);
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
                updateField: updateField,
                beforeModalOpen: beforeModalOpen,
                addingFieldType: addingFieldType,
                changeLogin: changeLogin,
                addingFieldLogin: addingFieldLogin,
                addingFieldTOTPAlgorithm: addingFieldTOTPAlgorithm,
                changeTOTPAlgorithm: changeTOTPAlgorithm,
                addingFieldTOTPTimeout: addingFieldTOTPTimeout,
                changeTOTPTimeout: changeTOTPTimeout,
                changeValue: changeValue,
                addingFieldValue: addingFieldValue,
                masterPasswordInput: masterPasswordInput,
                changeMasterPassword: changeMasterPassword,
                addingFieldTitle: addingFieldTitle,
                changeTitle: changeTitle,
                changeType: changeType,
                addingFieldState: addingFieldState,
                setAddingFieldState: setAddingFieldState,
                errorMessage: errorMessage,
            }}>
            {props.children}
        </EntryFieldContext.Provider>
    );
};

export default EntryFieldContextProvider;
