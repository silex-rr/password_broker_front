import React, {useContext, useState} from 'react';
import PasswordBrokerContext from './PasswordBrokerContext';
import {ENTRY_GROUP_ADDING_AWAIT, ENTRY_GROUP_ADDING_IN_PROGRESS} from '../constants/EntryGroupAddingStates';
import axios from 'axios';
import {ENTRY_GROUP_TREES_REQUIRED_LOADING} from '../constants/EntryGroupTreesStatus';
import {
    MASTER_PASSWORD_ENTERING_IS_CANCELED,
    MASTER_PASSWORD_INVALID,
    MASTER_PASSWORD_VALIDATED,
} from '../constants/MasterPasswordStates';
// import {Buffer} from 'buffer';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
    FIELD_TYPE_TOTP,
} from '../constants/MainBodyEntryGroupEntryFieldTypes';
import {ROLE_CAN_EDIT} from '../constants/EntryGroupRole';
import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_EDITING,
    FIELD_EDITING_LOADING_DATA,
} from '../constants/EntryGroupEntryFieldEditingStates';
import EntryGroupContext from './EntryGroupContext';
import {DATABASE_MODE_OFFLINE} from '../../identity/constants/DatabaseModeStates';
// import {OfflineDatabaseService} from '../../utils/native/OfflineDatabaseService';
import {CryptoService} from '../../utils/native/CryptoService';
import UserApplicationContext from '../../identity/contexts/UserApplicationContext';
import TOTP from '../../../src_web/passwordBroker/components/MainBody/EntryGroup/EntryFieldTypes/View/TOTP';

const Buffer = require('buffer/').Buffer;

const EntryGroupContextProvider = props => {
    const {Link, Password, Note, File} = props.entryFieldTypes;
    const EntryFieldButton = props.EntryFieldButton;
    const copy = props.copyToClipboard;
    const writeFile = props.writeFile;
    const {iconDisableColor} = useContext(UserApplicationContext);
    const passwordBrokerContext = useContext(PasswordBrokerContext);
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

        entryGroupData,
        databaseMode,
    } = passwordBrokerContext;

    /**
     * @type {OfflineDatabaseService}
     */
    const offlineDatabaseService = passwordBrokerContext.offlineDatabaseService;

    const [addingEntryGroupState, setAddingEntryGroupState] = useState(ENTRY_GROUP_ADDING_AWAIT);
    const [addingEntryGroupTitle, setAddingEntryGroupTitle] = useState('');
    const [addingEntryGroupErrorMessage, setAddingEntryGroupErrorMessage] = useState('');
    const cryptoService = new CryptoService();
    const addNewEntryGroup = (entryGroupId = null, visibilityRef = null) => {
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
                if (visibilityRef && visibilityRef.current) {
                    visibilityRef.current.checked = false;
                }
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

                if (databaseMode === DATABASE_MODE_OFFLINE) {
                    offlineDatabaseService.reloadKeyAndSalt().then(() => {
                        const rsaPrivateKey = offlineDatabaseService.getKey();
                        const salt = offlineDatabaseService.getSalt();
                        // console.log('rsaPrivateKey', rsaPrivateKey);
                        // console.log('salt', salt);
                        const entry = entryGroupData.entries.find(
                            entryCandidate => entryCandidate.entry_id === fieldProps.entry_id,
                        );
                        const field = entry[fieldProps.type + 's'].find(
                            fieldCandidate => (fieldCandidate.field_id = fieldProps.field_id),
                        );
                        const encrypted_value = Buffer.from(field.encrypted_value_base64, 'base64').toString('binary');
                        const initialization_vector = Buffer.from(
                            field.initialization_vector_base64,
                            'base64',
                        ).toString('binary');

                        // const encrypted_aes_password = Buffer.from(
                        //     entryGroupData.entryGroup.admins[0].encrypted_aes_password_base64,
                        //     'base64',
                        // ).toString('binary');
                        // console.log('encrypted_value_b64', field.encrypted_value_base64);
                        // console.log('offlineDatabaseService', offlineDatabaseService);
                        const fieldValue = cryptoService.decryptFieldValue(
                            encrypted_value,
                            initialization_vector,
                            entryGroupData.entryGroup.admins[0].encrypted_aes_password_base64,
                            rsaPrivateKey,
                            masterPasswordNew,
                            salt,
                        );
                        // console.log('decryptedFieldValue', fieldValue);
                        setMasterPasswordState(MASTER_PASSWORD_VALIDATED);
                        setButtonLoading('');
                        onSucceed(fieldValue);
                    });
                    return;
                }

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

        const handleGenerateTotp = () => {
            loadDecryptedValue(decoded => {
                setDecryptedValue(decoded);
            }, 'totp_gen');
        };

        const handleDownload = () => {
            loadDecryptedValue(decoded => {
                writeFile(decoded, fileName, fileMime);
                // const blob = stringToBlob(decoded, fileMime);
                // const href = URL.createObjectURL(blob);
                // const link = document.createElement('a');
                // link.href = href;
                // link.setAttribute('download', fileName);
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);
                // URL.revokeObjectURL(href);
            }, 'download');
        };

        const handleHistoryButton = () => {
            setHistoryVisible(!historyVisible);
        };

        let value = '';
        const buttons = [];

        const disableButtons = databaseMode === DATABASE_MODE_OFFLINE;
        const iconColor = disableButtons ? iconDisableColor : '';

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
                colour={historyVisible ? 'text-yellow-500' : iconColor}
                disabled={disableButtons}
            />
        );

        const totpButton = (
            <EntryFieldButton
                key="totpButton"
                icon="IoTimerOutline"
                onclick={handleGenerateTotp}
                loading={buttonLoading === 'TOTP'}
                tip="genereta TOTP"
                colour={historyVisible ? 'text-yellow-500' : iconColor}
                disabled={disableButtons}
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

            case FIELD_TYPE_TOTP:
                value = <TOTP value={decryptedValueVisible ? decryptedValue : ''} />;
                buttons.push(totpButton);
                buttons.push(visibilityButton);
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
                    onclick={handleEdit}
                    loading={buttonLoading === 'edit'}
                    tip="edit"
                    colour={historyVisible ? 'text-blue-300' : iconColor}
                    disabled={disableButtons}
                />,
            );

            buttons.push(
                <EntryFieldButton
                    key="deleteButton"
                    icon="FaTrashAlt"
                    onclick={handleDelete}
                    loading={buttonLoading === 'delete'}
                    tip="delete"
                    colour={historyVisible ? 'text-red-400' : iconColor}
                    disabled={disableButtons}
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
                setAddingEntryGroupErrorMessage: setAddingEntryGroupErrorMessage,
            }}>
            {props.children}
        </EntryGroupContext.Provider>
    );
};

export default EntryGroupContextProvider;
