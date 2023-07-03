import React, {useContext, useState} from "react";
import axios from "axios";
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from "../constants/MasterPasswordStates";
import {Buffer} from "buffer";
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD
} from "../constants/MainBodyEntryGroupEntryFieldTypes";
import {PasswordBrokerContext} from "./PasswordBrokerContext";
import copy from "copy-to-clipboard";
import {stringToBlob} from "../../utils/stringToBlob";
import EntryFieldButton from "../components/MainBody/EntryGroup/EntryFieldButton";
import {FaCopy, FaDownload, FaEdit, FaHistory, FaRegEye, FaRegEyeSlash, FaTrashAlt} from "react-icons/fa";
import Link from "../components/MainBody/EntryGroup/EntryFieldTypes/Link";
import Password from "../components/MainBody/EntryGroup/EntryFieldTypes/Password";
import Note from "../components/MainBody/EntryGroup/EntryFieldTypes/Note";
import File from "../components/MainBody/EntryGroup/EntryFieldTypes/File";
import {ROLE_CAN_EDIT} from "../constants/EntryGroupRole";
import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_EDITING,
    FIELD_EDITING_LOADING_DATA
} from "../constants/EntryGroupEntryFieldEditingStates";
import {ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED} from "../constants/EntryGroupEntryFieldsStatus";

const EntryContext = React.createContext()

const EntryProvider = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        masterPassword,
        setMasterPassword,
        setMasterPasswordCallback,
        setMasterPasswordState,
        showMasterPasswordModal,
        entryGroupRole,
        setEntryGroupFieldForEditId,
        setEntryGroupFieldForEditDecryptedValue,
        entryGroupFieldForEditState,
        setEntryGroupFieldForEditState,
    } = passwordBrokerContext

    const [entryFieldsStatus, setEntryFieldsStatus] = useState(ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED)
    const [entryFieldsData, setEntryFieldsData] = useState([])
    const [entryFieldsIsVisible, setEntryFieldVisible] = useState(false)


    const loadEntryFieldValueAndButtons = (
        url,
        states,
        fieldProps,
        historyMode = false
    ) => {
        const fieldId = fieldProps.field_id
        const type = fieldProps.type
        const fileMime = fieldProps.file_mime ?? ''
        const fileName = fieldProps.file_name ?? ''
        const login = fieldProps.login ?? ''
        const fileSize = fieldProps.file_size ? parseInt(fieldProps.file_size): 0
        const {
            decryptedValue, setDecryptedValue,
            decryptedValueVisible, setDecryptedValueVisible,
            buttonLoading, setButtonLoading,
            historyVisible, setHistoryVisible,
            trashed, setTrashed
        } = states

        const loadDecryptedValue = (onSucceed, button = '') => {
            if (decryptedValue !== '') {
                onSucceed(decryptedValue)
                return
            }
            const getDecryptedFieldValue = (masterPassword) => {
                setButtonLoading(button)

                axios.post(url + '/decrypted',
                    {
                        master_password: masterPassword
                    }
                ).then(
                    (result) => {
                        setMasterPasswordState(MASTER_PASSWORD_VALIDATED)

                        const decoded = Buffer.from(result.data, 'base64').toString(type === FIELD_TYPE_FILE ? 'binary' : 'utf8')
                        setButtonLoading('')
                        onSucceed(decoded)

                    },
                    (error) => {
                        if (error.response.data.errors.master_password) {
                            setMasterPassword('')
                            setMasterPasswordState(MASTER_PASSWORD_INVALID)
                            setMasterPasswordCallback(
                                () => (masterPassword) => {
                                    getDecryptedFieldValue(masterPassword)
                                }
                            )
                            showMasterPasswordModal("MasterPassword is invalid")
                        }
                        setButtonLoading('')
                    }
                )
            }

            if (masterPassword === '') {
                setMasterPasswordCallback(
                    () => (masterPassword) => {
                        getDecryptedFieldValue(masterPassword)
                    }
                )
                showMasterPasswordModal()
            } else {
                getDecryptedFieldValue(masterPassword)
            }
        }

        const handleValueVisibility = () => {
            loadDecryptedValue((decoded) => {
                setDecryptedValue(decoded)
                setDecryptedValueVisible(!decryptedValueVisible)
            }, 'show')
        }

        const handleValueCopy = () => {
            loadDecryptedValue((decoded) => {
                setDecryptedValue(decoded)
                copy(decoded)
            }, 'copy')
        }

        const handleDownload = () => {
            loadDecryptedValue((decoded) => {
                const blob = stringToBlob(decoded, fileMime)
                const href = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = href
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(href)
            }, 'download')
        }

        const handleHistoryButton = () => {
            setHistoryVisible(!historyVisible)
        }

        let value = ''
        const buttons = []

        const visibilityButton = <EntryFieldButton
            key='visibilityButton'
            icon={decryptedValueVisible ? <FaRegEyeSlash /> : <FaRegEye/>}
            onclick={handleValueVisibility}
            loading={buttonLoading === 'show'}
            tip={decryptedValueVisible ? "hide" : "show"}
        />

        const downloadButton = <EntryFieldButton
            key='downloadButton'
            icon={<FaDownload />}
            onclick={handleDownload}
            loading={buttonLoading === 'download'}
            tip="download"
        />

        const copyButton = <EntryFieldButton
            key='copyButton'
            icon={<FaCopy />}
            onclick={handleValueCopy}
            loading={buttonLoading === 'copy'}
            tip="copy"
        />

        const historyButton = <EntryFieldButton
            key='historyButton'
            icon={<FaHistory />}
            onclick={handleHistoryButton}
            loading={buttonLoading === 'history'}
            tip="history"
            colour={historyVisible ? 'text-yellow-500' : ''}
        />

        switch (type) {
            default:
                value = ''
                break

            case FIELD_TYPE_LINK:
                value = <Link value={decryptedValueVisible? decryptedValue: ''}/>
                buttons.push(copyButton)
                buttons.push(visibilityButton)
                break

            case FIELD_TYPE_PASSWORD:
                value = <Password value={decryptedValueVisible? decryptedValue: ''} login={login}/>
                buttons.push(copyButton)
                buttons.push(visibilityButton)
                break

            case FIELD_TYPE_NOTE:
                value = <Note value={decryptedValueVisible? decryptedValue: ''}/>
                buttons.push(copyButton)
                buttons.push(visibilityButton)
                break

            case FIELD_TYPE_FILE:
                value = <File fileMime={fileMime} fileName={fileName} fileSize={fileSize}/>
                buttons.push(downloadButton)
                break;
        }

        if (!historyMode) {
            buttons.push(historyButton)
        }

        if (!historyMode && ROLE_CAN_EDIT.includes(entryGroupRole)) {
            const handleDelete = () => {
                const deleteField = (masterPassword) => {
                    setButtonLoading('delete')

                    const data = new FormData();
                    data.append('_method', 'delete');
                    data.append('master_password', masterPassword)


                    axios.post( url, data).then(
                        () => {
                            setMasterPasswordState(MASTER_PASSWORD_VALIDATED)
                            setTrashed(true)
                            setButtonLoading('')
                        },
                        (error) => {
                            if (error.response.data.errors.master_password) {
                                setMasterPassword('')
                                setMasterPasswordState(MASTER_PASSWORD_INVALID)
                                setMasterPasswordCallback(
                                    () => (masterPassword) => {
                                        deleteField(masterPassword)
                                    }
                                )
                                showMasterPasswordModal("MasterPassword is invalid")
                            }
                            setButtonLoading('')
                        }
                    )
                }

                if (masterPassword === '') {
                    setMasterPasswordCallback(
                        () => (masterPassword) => {
                            deleteField(masterPassword)
                        }
                    )
                    showMasterPasswordModal()
                } else {
                    deleteField(masterPassword)
                }
            }
            const handleEdit = () => {
                if (entryGroupFieldForEditState !== FIELD_EDITING_AWAIT ){
                    return
                }
                setEntryGroupFieldForEditState(FIELD_EDITING_LOADING_DATA)
                loadDecryptedValue((decoded) => {
                    setDecryptedValue(decoded)
                    setEntryGroupFieldForEditId(fieldId)
                    setEntryGroupFieldForEditDecryptedValue(decoded)
                    setEntryGroupFieldForEditState(FIELD_EDITING_EDITING)
                }, 'edit')
            }

            buttons.push(<EntryFieldButton
                key="editButton"
                icon={<FaEdit/>}
                colour="text-blue-300"
                onclick={handleEdit}
                tip="edit"
            />)

            buttons.push(<EntryFieldButton
                key="deleteButton"
                icon={<FaTrashAlt/>}
                colour="text-red-400"
                onclick={handleDelete}
                loading={buttonLoading === 'delete'}
                tip="delete"
            />)
        }

        return {value, buttons}
    }


    return (
        <EntryContext.Provider
            value={{
                loadEntryFieldValueAndButtons: loadEntryFieldValueAndButtons,

                entryFieldsStatus: entryFieldsStatus,
                setEntryFieldsStatus: setEntryFieldsStatus,
                entryFieldsData: entryFieldsData,
                setEntryFieldsData: setEntryFieldsData,
                entryFieldsIsVisible: entryFieldsIsVisible,
                setEntryFieldVisible: setEntryFieldVisible
            }}
        >
            {props.children}
        </EntryContext.Provider>
    )
}

export {EntryContext, EntryProvider}