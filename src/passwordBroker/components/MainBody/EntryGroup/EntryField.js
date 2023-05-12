import React, {useContext, useState} from "react";
import {FaCopy, FaDownload, FaRegEye, FaRegEyeSlash, FaTrashAlt} from "react-icons/fa";
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


    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        masterPassword,
        setMasterPassword,
        setMasterPasswordCallback,
        setMasterPasswordState,
        showMasterPasswordModal,
        baseUrl,
        entryGroupId
    } = passwordBrokerContext

    const handleValueVisibility = () => {
        if (decryptedValue !== '') {
            setDecryptedValueVisible(!decryptedValueVisible)
            return;
        }

        const getDecryptedValue = (masterPassword) => {
            axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId + '/decrypted',
                {
                    master_password: masterPassword
                }
            ).then(
                (result) => {
                    setMasterPasswordState(MASTER_PASSWORD_VALIDATED)

                    const decoded = Buffer.from(result.data, 'base64').toString('utf8')

                    if (type === FIELD_TYPE_FILE) {
                        const blob = stringToBlob(decoded, fileMime)
                        const href = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = href
                        link.setAttribute('download', fileName)
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(href)
                        return
                    }

                    setDecryptedValue(decoded)
                    setDecryptedValueVisible(true)
                },
                (error) => {
                    if (error.response.data.errors.master_password) {
                        setMasterPassword('')
                        setMasterPasswordState(MASTER_PASSWORD_INVALID)
                        setMasterPasswordCallback((masterPassword) => getDecryptedValue)
                        showMasterPasswordModal("MasterPassword is invalid")
                    }
                }
            )
        }

        if (masterPassword === '') {
            setMasterPasswordCallback((masterPassword) => getDecryptedValue)
            showMasterPasswordModal()
        } else {
            getDecryptedValue(masterPassword)
        }
    }

    let value = ''
    let mainButtonIcon = decryptedValueVisible ? <FaRegEyeSlash /> : <FaRegEye/>

    switch (type) {
        default:
            value = ''
            break

        case FIELD_TYPE_LINK:
            value = <Link value={decryptedValueVisible? decryptedValue: ''}/>
            break

        case FIELD_TYPE_PASSWORD:
            value = <Password value={decryptedValueVisible? decryptedValue: ''}/>
            break

        case FIELD_TYPE_NOTE:
            value = <Note value={decryptedValueVisible? decryptedValue: ''}/>
            break

        case FIELD_TYPE_FILE:
            value = <File fileMime={fileMime} fileName={fileName} fileSize={fileSize}/>
            mainButtonIcon = <FaDownload/>
            break;
    }
//FaBan FaTimesCircle FaTrashAlt FaTrash
    return (
        <div key={fieldId} className="flex flex-row w-full px-2 bg-slate-500 hover:bg-slate-600 items-baseline">
            <div className="px-2 basis-1/6">{title}</div>
            <div className="px-2 basis-1/6">{type}</div>
            {value}
            <div className="px-2 basis-1/6 flex justify-end ">
                <button
                    className="text-slate-100 text-2xl focus:outline-none"
                >
                    <FaCopy />
                </button>

                <button
                    className="text-slate-100 text-2xl focus:outline-none ml-3"
                    onClick={handleValueVisibility}
                >
                    {mainButtonIcon}
                </button>

                <button
                    className="text-red-400 text-2xl focus:outline-none ml-3"
                >
                    <FaTrashAlt/>
                </button>
            </div>
        </div>
    )
}
export default EntryField