import React, {useContext, useState} from "react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import axios from "axios";
import { Buffer } from "buffer";
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

const EntryField = (props) => {

    const fieldId = props.field_id
    const entryId = props.entry_id
    const type = props.type
    const title = props.title
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
            axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId + '/decrypted', {
                master_password: masterPassword
            }).then(
                (result) => {
                    const decoded = Buffer.from(result.data.value_decrypted_base64, 'base64').toString('utf8');
                    let wrapped = '';
                    switch (type) {
                        default:
                            wrapped = decoded
                            break

                        case FIELD_TYPE_LINK:
                            wrapped = <Link value={decoded} />
                            break

                        case FIELD_TYPE_PASSWORD:
                            wrapped = <Password value={decoded} />
                            break

                        case FIELD_TYPE_NOTE:
                            wrapped = <Note value={decoded} />
                            break

                        case FIELD_TYPE_FILE:
                            wrapped = <File value={decoded} />
                            break
                    }
                    setDecryptedValue(
                        wrapped
                    )
                    setMasterPasswordState(MASTER_PASSWORD_VALIDATED)
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

    return (
        <div key={fieldId} className="flex flex-row w-full px-2 bg-slate-500">
            <div className="basis-2/5">{title}</div>
            <div className="basis-1/5">{type}</div>
            <div className="basis-3/5 flex justify-between">
                <div className="">
                    {decryptedValueVisible ? decryptedValue : ''}
                </div>
                <div className="mx-2">
                    <button
                        className="text-slate-100 text-3xl focus:outline-none"
                        onClick={handleValueVisibility}
                    >
                        {decryptedValueVisible ? <FaRegEyeSlash /> : <FaRegEye/>}
                    </button>
                </div>

                {/*<FaRegEyeSlash />*/}
                {/*{encryptedValue}*/}
            </div>
        </div>
    )
}
export default EntryField