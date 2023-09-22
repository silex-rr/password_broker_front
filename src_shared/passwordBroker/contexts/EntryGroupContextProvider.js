import React, {useContext, useRef, useState} from 'react';
import PasswordBrokerContext from './PasswordBrokerContext';
import {ENTRY_GROUP_ADDING_AWAIT, ENTRY_GROUP_ADDING_IN_PROGRESS} from '../constants/EntryGroupAddingStates';
import axios from 'axios';
import {ENTRY_GROUP_TREES_REQUIRED_LOADING} from '../constants/EntryGroupTreesStatus';
import {
    MASTER_PASSWORD_ENTERING_IS_CANCELED,
    MASTER_PASSWORD_INVALID,
    MASTER_PASSWORD_VALIDATED,
} from '../constants/MasterPasswordStates';
import {Buffer} from 'buffer';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
} from '../constants/MainBodyEntryGroupEntryFieldTypes';
import {stringToBlob} from '../../utils/stringToBlob';
import {ROLE_CAN_EDIT} from '../constants/EntryGroupRole';
import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_EDITING,
    FIELD_EDITING_LOADING_DATA,
} from '../constants/EntryGroupEntryFieldEditingStates';
import EntryGroupContext from './EntryGroupContext';

const EntryGroupContextProvider = props => {
    const {Link, Password, Note, File} = props.entryFieldTypes;
    const EntryFieldButton = props.EntryFieldButton;
    const copy = props.copyToCliboard;

    const {
        masterPassword,
        masterPasswordState,
        setMasterPassword,
        setMasterPasswordCallback,
        setMasterPasswordState,
        showMasterPasswordModal,
        entryGroupRole,
        setEntryGroupFieldForEditId,
        setEntryGroupFieldForEditDecryptedValue,
        entryGroupFieldForEditState,
        setEntryGroupFieldForEditState,

        baseUrl,
        setEntryGroupTreesStatus,
        entryGroupTreesOpened,
        setEntryGroupTreesOpened,
    } = useContext(PasswordBrokerContext);

    const [addingEntryGroupState, setAddingEntryGroupState] = useState(ENTRY_GROUP_ADDING_AWAIT);
    const [addingEntryGroupTitle, setAddingEntryGroupTitle] = useState('');
    const [addingEntryGroupErrorMessage, setAddingEntryGroupErrorMessage] = useState('');
    const addingEntryGroupModalVisibilityCheckboxRef = useRef();

    const addNewEntryGroup = (entryGroupId = null) => {
        if (addingEntryGroupState !== ENTRY_GROUP_ADDING_AWAIT) {
            return;
        }
        setAddingEntryGroupState(ENTRY_GROUP_ADDING_IN_PROGRESS);
        const data = {};
        data.name = addingEntryGroupTitle;
        if (entryGroupId) {
            data.parent_entry_group_id = entryGroupId;
        }

        axios.post(baseUrl + '/entryGroups/', data).then(
            () => {
                if (entryGroupId && !entryGroupTreesOpened.includes(entryGroupId)) {
                    entryGroupTreesOpened.push(entryGroupTreesOpened);
                    setEntryGroupTreesOpened(entryGroupTreesOpened);
                }
                setEntryGroupTreesStatus(ENTRY_GROUP_TREES_REQUIRED_LOADING);
                setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT);
                addingEntryGroupModalVisibilityCheckboxRef.current.checked = false;
                setAddingEntryGroupErrorMessage('');
            },
            error => {
                console.log(error);
                let errMsg = '';
                if (error.response && error.response.data.errors.name[0]) {
                    console.log(error.response.data.errors.name[0]);
                    errMsg += error.response.data.errors.name[0] + '\r\n';
                }
                if (errMsg.length) {
                    setAddingEntryGroupErrorMessage(errMsg);
                } else {
                    setAddingEntryGroupErrorMessage(error.message);
                }
                setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT);
            },
        );
    };
    const loadEntryFieldValueAndButtons = (url, states, fieldProps, historyMode = false) => {
        const fieldId = fieldProps.field_id;
        const type = fieldProps.type;
        const fileMime = fieldProps.file_mime ?? '';
        const fileName = fieldProps.file_name ?? '';
        const login = fieldProps.login ?? '';
        const fileSize = fieldProps.file_size ? parseInt(fieldProps.file_size, 10) : 0;
        const {
            decryptedValue,
            setDecryptedValue,
            decryptedValueVisible,
            setDecryptedValueVisible,
            buttonLoading,
            setButtonLoading,
            historyVisible,
            setHistoryVisible,
            // trashed,
            setTrashed,
        } = states;

        const loadDecryptedValue = (onSucceed, button = '') => {
            if (decryptedValue !== '') {
                onSucceed(decryptedValue);
                return;
            }
            const getDecryptedFieldValue = masterPasswordNew => {
                setButtonLoading(button);

                axios
                    .post(url + '/decrypted', {
                        master_password: masterPasswordNew,
                    })
                    .then(
                        result => {
                            setMasterPasswordState(MASTER_PASSWORD_VALIDATED);

                            const decoded = Buffer.from(result.data, 'base64').toString(
                                type === FIELD_TYPE_FILE ? 'binary' : 'utf8',
                            );
                            setButtonLoading('');
                            onSucceed(decoded);
                        },
                        error => {
                            if (error.response.data.errors.master_password) {
                                setMasterPassword('');
                                setMasterPasswordState(MASTER_PASSWORD_INVALID);
                                setMasterPasswordCallback(() => masterPasswordForCheck => {
                                    getDecryptedFieldValue(masterPasswordForCheck);
                                });
                                showMasterPasswordModal('MasterPassword is invalid');
                            }
                            setButtonLoading('');
                        },
                    );
            };

            if (masterPassword === '') {
                setMasterPasswordCallback(() => masterPasswordForCheck => {
                    getDecryptedFieldValue(masterPasswordForCheck);
                });
                showMasterPasswordModal();
            } else {
                getDecryptedFieldValue(masterPassword);
            }
        };

        const handleValueVisibility = () => {
            loadDecryptedValue(decoded => {
                setDecryptedValue(decoded);
                setDecryptedValueVisible(!decryptedValueVisible);
            }, 'show');
        };

        const handleValueCopy = () => {
            loadDecryptedValue(decoded => {
                setDecryptedValue(decoded);
                copy(decoded);
            }, 'copy');
        };

        const handleDownload = () => {
            loadDecryptedValue(decoded => {
                const blob = stringToBlob(decoded, fileMime);
                const href = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }, 'download');
        };

        const handleHistoryButton = () => {
            setHistoryVisible(!historyVisible);
        };

        let value = '';
        const buttons = [];

        const visibilityButton = (
            <EntryFieldButton
                key="visibilityButton"
                icon={decryptedValueVisible ? 'FaRegEyeSlash' : 'FaRegEye'}
                onclick={handleValueVisibility}
                loading={buttonLoading === 'show'}
                tip={decryptedValueVisible ? 'hide' : 'show'}
            />
        );

        const downloadButton = (
            <EntryFieldButton
                key="downloadButton"
                icon="FaDownload"
                onclick={handleDownload}
                loading={buttonLoading === 'download'}
                tip="download"
            />
        );

        const copyButton = (
            <EntryFieldButton
                key="copyButton"
                icon="FaCopy"
                onclick={handleValueCopy}
                loading={buttonLoading === 'copy'}
                tip="copy"
            />
        );

        const historyButton = (
            <EntryFieldButton
                key="historyButton"
                icon="FaHistory"
                onclick={handleHistoryButton}
                loading={buttonLoading === 'history'}
                tip="history"
                colour={historyVisible ? 'text-yellow-500' : ''}
            />
        );

        switch (type) {
            default:
                value = '';
                break;

            case FIELD_TYPE_LINK:
                value = <Link value={decryptedValueVisible ? decryptedValue : ''} />;
                buttons.push(copyButton);
                buttons.push(visibilityButton);
                break;

            case FIELD_TYPE_PASSWORD:
                value = <Password value={decryptedValueVisible ? decryptedValue : ''} login={login} />;
                buttons.push(copyButton);
                buttons.push(visibilityButton);
                break;

            case FIELD_TYPE_NOTE:
                value = <Note value={decryptedValueVisible ? decryptedValue : ''} />;
                buttons.push(copyButton);
                buttons.push(visibilityButton);
                break;

            case FIELD_TYPE_FILE:
                value = <File fileMime={fileMime} fileName={fileName} fileSize={fileSize} />;
                buttons.push(downloadButton);
                break;
        }

        if (!historyMode) {
            buttons.push(historyButton);
        }

        if (!historyMode && ROLE_CAN_EDIT.includes(entryGroupRole)) {
            const handleDelete = () => {
                const deleteField = masterPasswordNew => {
                    setButtonLoading('delete');

                    const data = new FormData();
                    data.append('_method', 'delete');
                    data.append('master_password', masterPasswordNew);

                    axios.post(url, data).then(
                        () => {
                            setMasterPasswordState(MASTER_PASSWORD_VALIDATED);
                            setTrashed(true);
                            setButtonLoading('');
                        },
                        error => {
                            if (error.response.data.errors.master_password) {
                                setMasterPassword('');
                                setMasterPasswordState(MASTER_PASSWORD_INVALID);
                                setMasterPasswordCallback(() => masterPasswordForCheck => {
                                    deleteField(masterPasswordForCheck);
                                });
                                showMasterPasswordModal('MasterPassword is invalid');
                            }
                            setButtonLoading('');
                        },
                    );
                };

                if (masterPassword === '') {
                    setMasterPasswordCallback(() => masterPasswordForCheck => {
                        deleteField(masterPasswordForCheck);
                    });
                    showMasterPasswordModal();
                } else {
                    deleteField(masterPassword);
                }
            };
            const handleEdit = () => {
                if (
                    entryGroupFieldForEditState !== FIELD_EDITING_AWAIT &&
                    masterPasswordState !== MASTER_PASSWORD_ENTERING_IS_CANCELED
                ) {
                    return;
                }
                setEntryGroupFieldForEditState(FIELD_EDITING_LOADING_DATA);
                loadDecryptedValue(decoded => {
                    setDecryptedValue(decoded);
                    setEntryGroupFieldForEditId(fieldId);
                    setEntryGroupFieldForEditDecryptedValue(decoded);
                    setEntryGroupFieldForEditState(FIELD_EDITING_EDITING);
                }, 'edit');
            };

            buttons.push(
                <EntryFieldButton
                    key="editButton"
                    icon="FaEdit"
                    colour="text-blue-300"
                    onclick={handleEdit}
                    loading={buttonLoading === 'edit'}
                    tip="edit"
                />,
            );

            buttons.push(
                <EntryFieldButton
                    key="deleteButton"
                    icon="FaTrashAlt"
                    colour="text-red-400"
                    onclick={handleDelete}
                    loading={buttonLoading === 'delete'}
                    tip="delete"
                />,
            );
        }

        return {value, buttons};
    };

    return (
        <EntryGroupContext.Provider
            value={{
                loadEntryFieldValueAndButtons: loadEntryFieldValueAndButtons,

                addNewEntryGroup: addNewEntryGroup,
                addingEntryGroupState: addingEntryGroupState,
                setAddingEntryGroupState: setAddingEntryGroupState,
                addingEntryGroupTitle: addingEntryGroupTitle,
                setAddingEntryGroupTitle: setAddingEntryGroupTitle,
                addingEntryGroupErrorMessage: addingEntryGroupErrorMessage,
                addingEntryGroupModalVisibilityCheckboxRef: addingEntryGroupModalVisibilityCheckboxRef,
                setAddingEntryGroupErrorMessage: setAddingEntryGroupErrorMessage,
            }}>
            {props.children}
        </EntryGroupContext.Provider>
    );
};

export default EntryGroupContextProvider;
