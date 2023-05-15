import React, {useContext, useRef, useState} from "react";
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD
} from "../../../constants/MainBodyEntryGroupEntryFieldTypes";
import {Button, Input, Textarea} from "react-daisyui";
import axios from "axios";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import {ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING} from "../../../constants/EntryGroupEntryFieldsStatus";
import {FIELD_ADDING_AWAIT, FIELD_ADDING_IN_PROGRESS} from "../../../constants/EntryGroupEntryFieldAddingStates";
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from "../../../constants/MasterPasswordStates";

const EntryFieldsAdd = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {baseUrl, masterPassword, setMasterPassword, setMasterPasswordState} = passwordBrokerContext

    const entryGroupId = props.entryGroupId
    const entryId = props.entryId
    const entryTitle = props.entryTitle

    const [addingFieldState, setAddingFieldState] = useState(FIELD_ADDING_AWAIT)

    const [fieldType, setFieldType] = useState(FIELD_TYPE_PASSWORD)
    const [fieldValue, setFieldValue] = useState('')
    const [fieldFile, setFieldFile] = useState(null)
    const [fieldTitle, setFieldTitle] = useState('')
    const [masterPasswordInput, setMasterPasswordInput] = useState('')
    const [errorMessage, setErrorMessage] = useState("")

    const modalVisibilityCheckboxRef = useRef()
    const modalFieldTypeSelectorRef = useRef()

    const addNewField = () => {
        if (addingFieldState !== FIELD_ADDING_AWAIT) {
            return
        }
        let masterPasswordForm = masterPassword
        if (masterPassword === '') {
            setMasterPassword(masterPasswordInput)
            masterPasswordForm = masterPasswordInput
        }

        setAddingFieldState(FIELD_ADDING_IN_PROGRESS)

        const data = new FormData();
        data.append('title', fieldTitle)
        data.append('type', fieldType)
        data.append('master_password', masterPasswordForm)
        switch (fieldType) {
            default:
                break
            case FIELD_TYPE_LINK:
            case FIELD_TYPE_PASSWORD:
            case FIELD_TYPE_NOTE:
                data.append('value', fieldValue)
                break

            case FIELD_TYPE_FILE:
                data.append('file', fieldFile)
                break

        }

        axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields',
                    data
                ).then(
                    () => {
                        props.setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING)
                        setAddingFieldState(FIELD_ADDING_AWAIT)
                        const modalVisibilityCheckbox =  modalVisibilityCheckboxRef.current
                        modalVisibilityCheckbox.checked = false
                        setErrorMessage('')
                        setMasterPasswordState(MASTER_PASSWORD_VALIDATED)
                    },
                    (error) => {
                        let errMsg = []
                        const addFieldErrKey = 'addFieldErr_'
                        if (error.response.data.errors.master_password) {
                            if (error.response.data.errors.master_password === 'invalid') {
                                errMsg.push(<p key={addFieldErrKey + errMsg.length}>MasterPassword is invalid</p>);
                            } else {
                                errMsg.push(<p key={addFieldErrKey + errMsg.length}>MasterPassword is missing</p>);
                            }
                            setMasterPasswordState(MASTER_PASSWORD_INVALID)
                            setMasterPassword('')
                        }
                        if (error.response.data.errors.value) {
                            errMsg.push(<p key={addFieldErrKey + errMsg.length}>Field Value is missing</p>);
                        }
                        if (error.response.data.errors.title) {
                            errMsg.push(<p key={addFieldErrKey + errMsg.length}>{error.response.data.errors.title[0]}</p>);
                        }

                        if (errMsg.length) {
                            setErrorMessage(errMsg)
                        } else {
                            setErrorMessage(error.message)
                        }
                        setAddingFieldState(FIELD_ADDING_AWAIT)
                    }
                )
        //     },
        //     (error) => {
        //         setErrorMessage(error.message)
        //         setAddingFieldState(FIELD_ADDING_AWAIT)
        //     }
        // )
    }
    const changeType = (e) => {
        setFieldValue('')
        setFieldFile(null)
        setFieldType(e.target.value)
    }

    const changeValue = (e) => {
        setFieldValue(e.target.value)
        if (fieldType === FIELD_TYPE_FILE) {
            setFieldFile(e.target.files[0])
        }

    }

    const changeTitle = (e) => {
        setFieldTitle(e.target.value)
    }

    const changeMasterPassword = (e) => {
        setMasterPasswordInput(e.target.value)
    }

    const openModal = (e) => {
        if (e.target.checked) {
            setFieldTitle('')
            setFieldValue('')
            setFieldType(FIELD_TYPE_PASSWORD)
            setMasterPasswordInput('')
            modalFieldTypeSelectorRef.current.value = FIELD_TYPE_PASSWORD
            setErrorMessage('')
            setAddingFieldState(FIELD_ADDING_AWAIT)
        }
    }

    let value = ''

    switch (fieldType) {
        default:
            break;
        case FIELD_TYPE_PASSWORD:
            value = (
                <div className="flex flex-row py-1.5 items-center">
                    <label htmlFor={"add-field-for-" + entryId + "-value"}
                           className="inline-block basis-1/3 text-lg"
                    >
                        Password:
                    </label>
                    <Input
                        id={"add-field-for-" + entryId + "-value"}
                        className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                        onChange={changeValue}
                        placeholder="type new password"
                        type="password"
                        value={fieldValue}/>
                </div>
            )
            break;
        case FIELD_TYPE_NOTE:
            value = (
                <div className="py-1.5 items-center">
                    <Textarea onChange={changeValue} placeholder="type new note" value={fieldValue}
                              className="textarea-bordered w-full bg-slate-800 text-slate-200 placeholder-slate-300"/>
                </div>
            )
            break;
        case FIELD_TYPE_LINK:
            value = (
                <div className="flex flex-row py-1.5 items-center">
                    <label htmlFor={"add-field-for-" + entryId + "-value"}
                           className="inline-block basis-1/3 text-lg"
                    >
                        Link:
                    </label>
                    <Input
                        id={"add-field-for-" + entryId + "-value"}
                        className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                        onChange={changeValue}
                        placeholder="put new link"
                        type="text"
                        value={fieldValue}/>
                </div>
            )
            break;
        case FIELD_TYPE_FILE:
            value = (
                <div className="flex flex-row py-1.5 items-center">
                    <label htmlFor={"add-field-for-" + entryId + "-value"}
                           className="inline-block basis-1/3 text-lg"
                    >
                        File:
                    </label>
                    <Input
                        id={"add-field-for-" + entryId + "-value"}
                        className="file-input file-input-bordered file-input-sm w-full basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                        onChange={changeValue}
                        placeholder="add a file"
                        type="file"
                        value={fieldValue}/>
                </div>
            )
            break

    }

    let masterPasswordField = ''

    if (masterPassword === '') {
        masterPasswordField = (
            <div className="flex flex-row py-1.5 items-center">
                <label htmlFor={"add-field-for-" + entryId + "-master-password"}
                       className="inline-block basis-1/3 text-xl align-middle text"
                >
                    MasterPassword:
                </label>
                <Input
                    id={"add-field-for-" + entryId + "-master-password"}
                    type='password'
                    value={masterPasswordInput}
                    onChange={changeMasterPassword}
                    placeholder="type your master password"
                    className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                />
            </div>
        )
    }

    return (
        <div className="px-2 pb-2">
            <label htmlFor={"add-field-for-" + entryId} className="btn btn-sm bg-slate-800">add new field</label>

            <input ref={modalVisibilityCheckboxRef}
                   type="checkbox"
                   id={"add-field-for-" + entryId}
                   className="modal-toggle"
                   onChange={openModal}/>
            <label htmlFor={"add-field-for-" + entryId} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Adding new field for entry "{entryTitle}"</h3>
                    <div className="py-4">
                        <div className="flex flex-row py-1.5 items-center">
                            <label htmlFor={"add-field-for-" + entryId + "-title"}
                                    className="inline-block basis-1/3 text-lg"
                            >
                                Field Title:
                            </label>
                            <Input id={"add-field-for-" + entryId + "-title"}
                                   type='text'
                                   value={fieldTitle}
                                   onChange={changeTitle}
                                   placeholder="type title for new field"
                                   className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                            />
                        </div>
                        <div className="flex flex-row py-1.5 items-center">
                            <label htmlFor={"add-field-for-" + entryId + "-type"}
                                    className="inline-block basis-1/3 text-lg"
                            >
                                Field Type:
                            </label>
                            <select
                                    id={"add-field-for-" + entryId + "-type"}
                                    ref={modalFieldTypeSelectorRef}
                                    className="select select-bordered select-sm basis-2/3 bg-slate-800 text-slate-200"
                                    defaultValue={FIELD_TYPE_PASSWORD}
                                    onChange={changeType}>
                                <option value={FIELD_TYPE_PASSWORD}>{FIELD_TYPE_PASSWORD}</option>
                                <option value={FIELD_TYPE_LINK}>{FIELD_TYPE_LINK}</option>
                                <option value={FIELD_TYPE_NOTE}>{FIELD_TYPE_NOTE}</option>
                                <option value={FIELD_TYPE_FILE}>{FIELD_TYPE_FILE}</option>
                            </select>
                        </div>

                        {value}

                        {masterPasswordField}

                        <div className="flex flex-row justify-around modal-action">
                            <Button className={"btn-success btn-sm basis-1/3" + (addingFieldState === FIELD_ADDING_AWAIT ? "" : " loading")} onClick={addNewField}>
                                {addingFieldState === FIELD_ADDING_AWAIT ? 'add' : ''}
                            </Button>

                            <label htmlFor={"add-field-for-" + entryId}
                                   className="btn btn-error btn-sm btn-outline right-0 basis-1/3">close</label>
                        </div>
                        {errorMessage === ''
                            ? ''
                            :
                                <div className="w-full bg-red-700 text-slate-100 text-center mt-8 py-1.5">
                                    {errorMessage}
                                </div>
                        }

                    </div>
                </label>
            </label>
        </div>
    )
}

export default EntryFieldsAdd