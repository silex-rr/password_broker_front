import React, {useContext, useRef} from "react";
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD
} from "../../../../../src_shared/passwordBroker/constants/MainBodyEntryGroupEntryFieldTypes";
import {Button, Input, Textarea} from "react-daisyui";
import {FIELD_ADDING_AWAIT} from "../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldAddingStates";
import {EntryFieldContext} from "../../../../../src_shared/passwordBroker/contexts/EntryFieldContext";
import {PasswordBrokerContext} from "../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING
} from "../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldsStatus";

const EntryFieldsAdd = (props) => {
    const {masterPassword} = useContext(PasswordBrokerContext)

    const {
        addNewField,
        addingFieldType,
        beforeModalOpen,
        changeLogin,
        addingFieldLogin,
        changeValue,
        addingFieldValue,
        masterPasswordInput,
        changeMasterPassword,
        addingFieldTitle,
        changeTitle,
        changeType,
        addingFieldState,
        errorMessage,
    } = useContext(EntryFieldContext)

    const entryGroupId = props.entryGroupId
    const entryId = props.entryId
    const entryTitle = props.entryTitle

    const modalVisibilityCheckboxRef = useRef()
    const modalFieldTypeSelectorRef = useRef()


    const openModal = (e) => {
        if (e.target.checked) {
            beforeModalOpen()
            modalFieldTypeSelectorRef.current.value = FIELD_TYPE_PASSWORD
        }
    }

    let value = ''

    switch (addingFieldType) {
        default:
            break;
        case FIELD_TYPE_PASSWORD:
            value = (
                <div className="py-1.5 items-center">
                    <div className="flex flex-row ">
                        <label htmlFor={"add-field-for-" + entryId + "-login"}
                               className="inline-block basis-1/3 text-lg"
                        >
                            Login:
                        </label>
                        <Input
                            id={"add-field-for-" + entryId + "-login"}
                            className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                            onChange={(e) => changeLogin(e.target.value)}
                            placeholder="type new login"
                            type="text"
                            value={addingFieldLogin}/>
                    </div>
                    <div className="flex flex-row ">
                        <label htmlFor={"add-field-for-" + entryId + "-value"}
                               className="inline-block basis-1/3 text-lg"
                        >
                            Password:
                        </label>
                        <Input
                            id={"add-field-for-" + entryId + "-value"}
                            className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                            onChange={(e) => changeValue(e.target.value)}
                            placeholder="type new password"
                            type="password"
                            value={addingFieldValue}/>
                    </div>
                </div>
            )
            break;
        case FIELD_TYPE_NOTE:
            value = (
                <div className="py-1.5 items-center">
                    <Textarea onChange={(e) => changeValue(e.target.value)} placeholder="type new note" value={addingFieldValue}
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
                        onChange={(e) => changeValue(e.target.value)}
                        placeholder="put new link"
                        type="text"
                        value={addingFieldValue}/>
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
                        onChange={(e) => changeValue(e.target.value, e.target.files[0])}
                        placeholder="add a file"
                        type="file"
                        value={addingFieldValue}/>
                </div>
            )
            break

    }

    const sendFormHandler = () => {
        addNewField(entryGroupId, entryId)
            .then(
                ()=> {
                    props.setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING)
                    const modalVisibilityCheckbox = modalVisibilityCheckboxRef.current
                    modalVisibilityCheckbox.checked = false
                },
                () => {}
                )
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
                    onChange={(e) => changeMasterPassword(e.target.value)}
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
                                   value={addingFieldTitle}
                                   onChange={(e) => changeTitle(e.target.value)}
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
                                    onChange={(e) => changeType(e.target.value)}>
                                <option value={FIELD_TYPE_PASSWORD}>{FIELD_TYPE_PASSWORD}</option>
                                <option value={FIELD_TYPE_LINK}>{FIELD_TYPE_LINK}</option>
                                <option value={FIELD_TYPE_NOTE}>{FIELD_TYPE_NOTE}</option>
                                <option value={FIELD_TYPE_FILE}>{FIELD_TYPE_FILE}</option>
                            </select>
                        </div>

                        {value}

                        {masterPasswordField}

                        <div className="flex flex-row justify-around modal-action">
                            <Button
                                className={"btn-success btn-sm basis-1/3" + (addingFieldState === FIELD_ADDING_AWAIT ? "" : " loading")}
                                onClick={sendFormHandler}>
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