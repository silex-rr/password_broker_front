import React, {useContext, useRef} from 'react';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
    FIELD_TYPE_TOTP,
} from '../../../../../src_shared/passwordBroker/constants/MainBodyEntryGroupEntryFieldTypes';
import {Input} from 'react-daisyui';
import {FIELD_ADDING_AWAIT} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldAddingStates';
import EntryFieldContext from '../../../../../src_shared/passwordBroker/contexts/EntryFieldContext';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
// eslint-disable-next-line max-len
import {ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldsStatus';
import Link from './EntryFieldTypes/Edit/Link';
import Note from './EntryFieldTypes/Edit/Note';
import Password from './EntryFieldTypes/Edit/Password';
import File from './EntryFieldTypes/Edit/File';
import TOTP from './EntryFieldTypes/Edit/TOTP';

const EntryFieldsAdd = props => {
    const {masterPassword} = useContext(PasswordBrokerContext);

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
    } = useContext(EntryFieldContext);

    const entryGroupId = props.entryGroupId;
    const entryId = props.entryId;
    const entryTitle = props.entryTitle;

    const modalVisibilityCheckboxRef = useRef();
    const modalFieldTypeSelectorRef = useRef();

    const passwordHolder = useRef();
    const passwordEyeOpenHolder = useRef();
    const passwordEyeCloseHolder = useRef();
    const togglePassword = (e, hideForce = false) => {
        if (passwordHolder.current.type === 'text' || hideForce) {
            passwordHolder.current.type = 'password';
            passwordEyeCloseHolder.current.classList.add('hidden');
            passwordEyeOpenHolder.current.classList.remove('hidden');
        } else {
            passwordHolder.current.type = 'text';
            passwordEyeOpenHolder.current.classList.add('hidden');
            passwordEyeCloseHolder.current.classList.remove('hidden');
        }
    };

    const openModal = e => {
        if (e.target.checked) {
            beforeModalOpen();
            changeType(FIELD_TYPE_PASSWORD);
            // modalFieldTypeSelectorRef.current.value = FIELD_TYPE_PASSWORD;
        } else {
            togglePassword(null, true);
        }
    };

    let value = '';

    switch (addingFieldType) {
        default:
            break;
        case FIELD_TYPE_PASSWORD:
            value = (
                <Password
                    entryId={entryId}
                    fieldLogin={addingFieldLogin}
                    fieldValue={addingFieldValue}
                    changeLogin={changeLogin}
                    changeValue={changeValue}
                    passwordHolder={passwordHolder}
                    passwordEyeOpenHolder={passwordEyeOpenHolder}
                    passwordEyeCloseHolder={passwordEyeCloseHolder}
                    togglePassword={togglePassword}
                />
            );
            break;
        case FIELD_TYPE_NOTE:
            value = <Note fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
        case FIELD_TYPE_LINK:
            value = <Link entryId={entryId} fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
        case FIELD_TYPE_FILE:
            value = <File entryId={entryId} fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
        case FIELD_TYPE_TOTP:
            value = <TOTP entryId={entryId} fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
    }

    const sendFormHandler = () => {
        addNewField(entryGroupId, entryId).then(
            () => {
                props.setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING);
                const modalVisibilityCheckbox = modalVisibilityCheckboxRef.current;
                modalVisibilityCheckbox.checked = false;
            },
            () => {},
        );
    };

    let masterPasswordField = '';

    if (masterPassword === '') {
        masterPasswordField = (
            <div className="flex flex-row items-center py-1.5">
                <label
                    htmlFor={'add-field-for-' + entryId + '-master-password'}
                    className="text inline-block basis-1/3 align-middle text-xl">
                    MasterPassword:
                </label>
                <Input
                    id={'add-field-for-' + entryId + '-master-password'}
                    type="password"
                    value={masterPasswordInput}
                    onChange={e => changeMasterPassword(e.target.value)}
                    placeholder="type your master password"
                    className="input-bordered input-sm basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                />
            </div>
        );
    }

    return (
        <div className="px-2 pb-2">
            <label
                htmlFor={'add-field-for-' + entryId}
                className="btn btn-sm bg-slate-800 text-slate-100 hover:text-slate-800">
                add new field
            </label>

            <input
                ref={modalVisibilityCheckboxRef}
                type="checkbox"
                id={'add-field-for-' + entryId}
                className="modal-toggle"
                onChange={openModal}
            />
            <label htmlFor={'add-field-for-' + entryId} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Adding new field for entry &quot;{entryTitle}&quot;</h3>
                    <div className="py-4">
                        <div className="flex flex-row items-center py-1.5">
                            <label
                                htmlFor={'add-field-for-' + entryId + '-title'}
                                className="inline-block basis-1/3 text-lg">
                                Field Title:
                            </label>
                            <Input
                                id={'add-field-for-' + entryId + '-title'}
                                type="text"
                                value={addingFieldTitle}
                                onChange={e => changeTitle(e.target.value)}
                                placeholder="type title for new field"
                                className={
                                    'input-bordered input-sm basis-2/3 bg-slate-800 ' +
                                    'text-slate-200 placeholder-slate-300'
                                }
                            />
                        </div>
                        <div className="flex flex-row items-center py-1.5">
                            <label
                                htmlFor={'add-field-for-' + entryId + '-type'}
                                className="inline-block basis-1/3 text-lg">
                                Field Type:
                            </label>
                            <select
                                id={'add-field-for-' + entryId + '-type'}
                                ref={modalFieldTypeSelectorRef}
                                className="select select-bordered select-sm basis-2/3 bg-slate-800 text-slate-200"
                                defaultValue={FIELD_TYPE_PASSWORD}
                                onChange={e => changeType(e.target.value)}>
                                <option value={FIELD_TYPE_PASSWORD}>{FIELD_TYPE_PASSWORD}</option>
                                <option value={FIELD_TYPE_TOTP}>{FIELD_TYPE_TOTP}</option>
                                <option value={FIELD_TYPE_LINK}>{FIELD_TYPE_LINK}</option>
                                <option value={FIELD_TYPE_NOTE}>{FIELD_TYPE_NOTE}</option>
                                <option value={FIELD_TYPE_FILE}>{FIELD_TYPE_FILE}</option>
                            </select>
                        </div>

                        {value}

                        {masterPasswordField}

                        <div className="modal-action flex flex-row justify-around">
                            <span className={'btn btn-success btn-sm basis-1/3'} onClick={sendFormHandler}>
                                <span
                                    className={
                                        'loading loading-spinner' +
                                        (addingFieldState === FIELD_ADDING_AWAIT ? ' hidden' : ' ')
                                    }
                                />
                                {addingFieldState === FIELD_ADDING_AWAIT ? 'add' : 'adding'}
                            </span>

                            <label
                                htmlFor={'add-field-for-' + entryId}
                                className="btn btn-outline btn-error btn-sm right-0 basis-1/3">
                                close
                            </label>
                        </div>
                        {errorMessage.length === 0 ? (
                            ''
                        ) : (
                            <div className="mt-8 w-full bg-red-700 py-1.5 text-center text-slate-100">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </label>
            </label>
        </div>
    );
};

export default EntryFieldsAdd;
