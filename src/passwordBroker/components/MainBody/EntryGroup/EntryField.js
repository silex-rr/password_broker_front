import React, {useContext, useState} from "react";
import {FaRegEye} from "react-icons/fa";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import axios from "axios";
import { Buffer } from "buffer";
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from "../../../constants/MasterPasswordStates";

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
        const getDecryptedValue = (masterPassword) => {
            axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId + '/decrypted', {
                master_password: masterPassword
            }).then(
                (result) => {
                    setDecryptedValue(
                        Buffer.from(result.data.value_decrypted_base64, 'base64').toString('utf8')
                    )
                    setMasterPasswordState(MASTER_PASSWORD_VALIDATED)
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
            <div className="basis-3/5 flex flex-row">
                <div className="basis-4/5">
                    {decryptedValue}
                </div>
                <div className="basis-1/5">
                    <button
                        className="text-slate-100 text-3xl focus:outline-none"
                        onClick={handleValueVisibility}
                    >
                        <FaRegEye/>
                    </button>
                </div>

                {/*<FaRegEyeSlash />*/}
                {/*{encryptedValue}*/}
            </div>
        </div>
    )
}
export default EntryField