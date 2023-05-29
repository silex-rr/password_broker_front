import React, {useContext, useState} from "react";
import {FaCopy, FaDownload, FaEdit, FaRegEye, FaRegEyeSlash, FaTrashAlt} from "react-icons/fa";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import axios from "axios";
import {Buffer} from "buffer";
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from "../../../constants/MasterPasswordStates";
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD
} from "../../../constants/MainBodyEntryGroupEntryFieldTypes";
import Link from "./EntryFieldTypes/Link";
import Password from "./EntryFieldTypes/Password";
import Note from "./EntryFieldTypes/Note";
import File from "./EntryFieldTypes/File";
import {stringToBlob} from "../../../../utils/stringToBlob";
import EntryFieldButton from "./EntryFieldButton";
import {ROLE_CAN_EDIT} from "../../../constants/EntryGroupRole";
import copy from "copy-to-clipboard";

const EntryField = (props) => {

    const fieldId = props.field_id
    const entryId = props.entry_id
    const type = props.type
    const title = props.title
    const fileMime = props.file_mime ?? ''
    const fileName = props.file_name ?? ''
    const fileSize = props.file_size ? parseInt(props.file_size): 0
    // const createdBy = props.created_by
    // const updateBy = props.update_by
    // const createdAt = props.created_at
    // const updatedAt = props.updated_at
    // const encryptedValue = props.encrypted_value_base64
    // const initializationVector = props.initialization_vector_base64

    const [decryptedValue, setDecryptedValue] = useState('')
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false)
    const [buttonLoading, setButtonLoading] = useState('')


    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        masterPassword,
        setMasterPassword,
        setMasterPasswordCallback,
        setMasterPasswordState,
        showMasterPasswordModal,
        baseUrl,
        entryGroupId,
        entryGroupRole
    } = passwordBrokerContext

    const loadDecryptedValue = (onSucceed, button = '') => {
        if (decryptedValue !== '') {
            onSucceed(decryptedValue)
            return
        }
        const getDecryptedFieldValue = (masterPassword) => {
            setButtonLoading(button)

            axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId + '/decrypted',
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

    let value = ''
    const buttons = []

    const visibilityButton = <EntryFieldButton
            key='visibilityButton'
            icon={decryptedValueVisible ? <FaRegEyeSlash /> : <FaRegEye/>}
            onclick={handleValueVisibility}
            loading={buttonLoading === 'show'}
        />

    const downloadButton = <EntryFieldButton
            key='downloadButton'
            icon={<FaDownload />}
            onclick={handleDownload}
            loading={buttonLoading === 'download'}
        />

    const copyButton = <EntryFieldButton
            key='copyButton'
            icon={<FaCopy />}
            onclick={handleValueCopy}
            loading={buttonLoading === 'copy'}
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
            value = <Password value={decryptedValueVisible? decryptedValue: ''}/>
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
    if (ROLE_CAN_EDIT.includes(entryGroupRole)) {
        const handleDelete = () => {

        }
        const handleEdit = () => {

        }

        buttons.push(<EntryFieldButton
            key="editButton"
            icon={<FaEdit/>}
            colour="text-blue-300"
            onclick={handleEdit}
        />)

        buttons.push(<EntryFieldButton
            key="deleteButton"
            colour="text-red-400"
            icon={<FaTrashAlt/>}
            onclick={handleDelete}
        />)
    }

//FaBan FaTimesCircle FaTrashAlt FaTrash
    return (
        <div key={fieldId} className="flex flex-row w-full px-2 bg-slate-500 hover:bg-slate-600 items-baseline">
            <div className="px-2 basis-1/6">{title}</div>
            <div className="px-2 basis-1/6">{type}</div>
            {value}
            <div className="px-2 basis-1/6 flex justify-end py-1">
                {buttons}
            </div>
        </div>
    )
}
export default EntryField