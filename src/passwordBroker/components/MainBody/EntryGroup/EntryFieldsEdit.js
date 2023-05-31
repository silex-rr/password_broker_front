import React, {useContext, useEffect, useRef, useState} from "react";
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
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from "../../../constants/MasterPasswordStates";
import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_EDITING,
    FIELD_EDITING_IN_PROGRESS
} from "../../../constants/EntryGroupEntryFieldEditingStates";

const EntryFieldsEdit = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        baseUrl,
        masterPassword,
        setMasterPassword,
        setMasterPasswordState,
        entryGroupFieldForEditId,
        entryGroupFieldForEditDecryptedValue,
        entryGroupFieldForEditState,
        setEntryGroupFieldForEditState
    } = passwordBrokerContext

    const modalVisibilityRef = useRef()

    const entryGroupId = props.entryGroupId
    const entryId = props.entryId
    const entryTitle = props.entryTitle
    
    let field = null

    if (entryGroupFieldForEditId !== '') {
        for (let i = 0; i < props.fields.length; i++) {
            if (props.fields[i].field_id === entryGroupFieldForEditId) {
                field = props.fields[i]
                break
            }
        }
    }

    const fieldType =  field === null ? '' : field.type
    const fieldTitleDefault = field === null ? '' : field.title
    const fieldValueDefault = entryGroupFieldForEditDecryptedValue

    const [fieldValue, setFieldValue] = useState('')
    const [fieldTitle, setFieldTitle] = useState('')

    const [masterPasswordInput, setMasterPasswordInput] = useState('')
    const [errorMessage, setErrorMessage] = useState("")


    useEffect(() => {
        const modalVisibilityCheckbox = modalVisibilityRef.current
        if (modalVisibilityCheckbox.checked
            && ![FIELD_EDITING_EDITING, FIELD_EDITING_IN_PROGRESS].includes(entryGroupFieldForEditState)
        ) {
            modalVisibilityCheckbox.checked = false
            setFieldValue('')
            setFieldTitle('')
            return
        }

        if (!modalVisibilityCheckbox.checked
            && [FIELD_EDITING_EDITING, FIELD_EDITING_IN_PROGRESS].includes(entryGroupFieldForEditState)
        ) {
            setFieldValue(fieldValueDefault)
            setFieldTitle(fieldTitleDefault)
            modalVisibilityCheckbox.checked = true
        }

    }, [modalVisibilityRef, entryGroupFieldForEditState, fieldValueDefault, fieldTitleDefault])
    
    const updateField = () => {
        if (entryGroupFieldForEditState !== FIELD_EDITING_EDITING) {
            return
        }
        let masterPasswordForm = masterPassword
        if (masterPassword === '') {
            setMasterPassword(masterPasswordInput)
            masterPasswordForm = masterPasswordInput
        }

        setEntryGroupFieldForEditState(FIELD_EDITING_IN_PROGRESS)

        const data = new FormData();
        data.append('title', fieldTitle)
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
                break

        }
        data.append('_method', 'put');
        axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + entryGroupFieldForEditId,
                    data
                ).then(
                    () => {
                        props.setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING)
                        setEntryGroupFieldForEditState(FIELD_EDITING_AWAIT)
                        const modalVisibilityCheckbox =  modalVisibilityRef.current
                        modalVisibilityCheckbox.checked = false
                        setErrorMessage('')
                        setMasterPasswordState(MASTER_PASSWORD_VALIDATED)
                    },
                    (error) => {
                        let errMsg = []
                        const addFieldErrKey = 'editFieldErr_'
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
                        setEntryGroupFieldForEditState(FIELD_EDITING_AWAIT)
                    }
                )
        //     },
        //     (error) => {
        //         setErrorMessage(error.message)
        //         setAddingFieldState(FIELD_ADDING_AWAIT)
        //     }
        // )
    }

    const changeValue = (e) => {
        setFieldValue(e.target.value)
    }

    const changeTitle = (e) => {
        setFieldTitle(e.target.value)
    }

    const changeMasterPassword = (e) => {
        setMasterPasswordInput(e.target.value)
    }

    const openModal = (e) => {
        if (e.target.checked) {
            setMasterPasswordInput('')
            setErrorMessage('')
            setEntryGroupFieldForEditState(FIELD_EDITING_EDITING)
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
            <label htmlFor={"add-field-for-" + entryId} className="btn btn-sm bg-slate-800">Editing field "{fieldTitleDefault}"</label>

            <input ref={modalVisibilityRef}
                   type="checkbox"
                   id={"add-field-for-" + entryId}
                   className="modal-toggle"
                   onChange={openModal}/>
            <label htmlFor={"add-field-for-" + entryId} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Editing field "{fieldTitleDefault}" for entry "{entryTitle}"</h3>
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
                                   placeholder={fieldTitleDefault}
                                   className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                            />
                        </div>

                        {value}

                        {masterPasswordField}

                        <div className="flex flex-row justify-around modal-action">
                            <Button className={"btn-success btn-sm basis-1/3" + (entryGroupFieldForEditState === FIELD_EDITING_IN_PROGRESS ? " loading" : "" )} 
                                    onClick={updateField}>
                                {entryGroupFieldForEditState === FIELD_EDITING_EDITING ? 'save changes' : ''}
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

export default EntryFieldsEdit