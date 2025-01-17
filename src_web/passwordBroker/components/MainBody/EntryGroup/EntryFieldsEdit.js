import React, {useContext, useEffect, useRef} from 'react';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
    FIELD_TYPE_TOTP,
} from '../../../../../src_shared/passwordBroker/constants/MainBodyEntryGroupEntryFieldTypes';
import {Button, Input} from 'react-daisyui';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_EDITING,
    FIELD_EDITING_IN_PROGRESS,
} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldEditingStates';
import EntryFieldContext from '../../../../../src_shared/passwordBroker/contexts/EntryFieldContext';
import Password from './EntryFieldTypes/Edit/Password';
import Note from './EntryFieldTypes/Edit/Note';
import Link from './EntryFieldTypes/Edit/Link';
import TOTP from './EntryFieldTypes/Edit/TOTP';
// eslint-disable-next-line max-len
import {ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_DEFAULT} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldTOTPAlgorithms';

const EntryFieldsEdit = props => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {setEntryFieldsStatus} = props;
    const {
        entryGroupFieldForEditId,
        entryGroupFieldForEditDecryptedValue,
        entryGroupFieldForEditState,
        setEntryGroupFieldForEditState,
    } = passwordBrokerContext;
    const {
        updateField,
        addingFieldType,
        changeLogin,
        addingFieldLogin,
        addingFieldTOTPAlgorithm,
        changeTOTPAlgorithm,
        addingFieldTOTPTimeout,
        changeTOTPTimeout,
        changeValue,
        addingFieldValue,
        addingFieldTitle,
        changeTitle,
        changeType,
        errorMessage,
    } = useContext(EntryFieldContext);

    const modalVisibilityRef = useRef();

    const entryGroupId = props.entryGroupId;
    const entryId = props.entryId;
    const entryTitle = props.entryTitle;

    let field = null;

    if (entryGroupFieldForEditId !== '') {
        for (let i = 0; i < props.fields.length; i++) {
            if (props.fields[i].field_id === entryGroupFieldForEditId) {
                field = props.fields[i];
                break;
            }
        }
    }

    const fieldTypeDefault = field === null ? '' : field.type;
    const fieldTitleDefault = field === null ? '' : field.title;
    const fieldLoginDefault = field === null || fieldTypeDefault !== FIELD_TYPE_PASSWORD ? '' : field.login;
    const fieldValueDefault = entryGroupFieldForEditDecryptedValue;
    const fieldTOTPAlgorithmDefault =
        field === null ? ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_DEFAULT : field.totp_hash_algorithm;
    const fieldTOTPTimeoutDefault = field === null ? 30 : field.totp_timeout;
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

    useEffect(() => {
        const modalVisibilityCheckbox = modalVisibilityRef.current;
        if (
            modalVisibilityCheckbox.checked &&
            ![FIELD_EDITING_EDITING, FIELD_EDITING_IN_PROGRESS].includes(entryGroupFieldForEditState)
        ) {
            if (fieldTypeDefault !== addingFieldType) {
                changeType(fieldTypeDefault);
            }
            modalVisibilityCheckbox.click();
            changeValue('');
            changeTitle('');
            changeLogin('');
            return;
        }

        if (
            !modalVisibilityCheckbox.checked &&
            [FIELD_EDITING_EDITING, FIELD_EDITING_IN_PROGRESS].includes(entryGroupFieldForEditState)
        ) {
            changeValue(fieldValueDefault);
            changeTitle(fieldTitleDefault);
            changeLogin(fieldLoginDefault);
            changeTOTPAlgorithm(fieldTOTPAlgorithmDefault);
            changeTOTPTimeout(fieldTOTPTimeoutDefault);
            modalVisibilityCheckbox.click();
        }
    }, [
        modalVisibilityRef,
        entryGroupFieldForEditState,
        fieldValueDefault,
        fieldTitleDefault,
        fieldLoginDefault,
        changeValue,
        changeTitle,
        changeLogin,
        fieldTypeDefault,
        addingFieldType,
        changeType,
    ]);

    let value = '';

    switch (fieldTypeDefault) {
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
            break;
        case FIELD_TYPE_TOTP:
            value = (
                <TOTP
                    entryId={entryId}
                    fieldValue={addingFieldValue}
                    changeValue={changeValue}
                    addingFieldTOTPAlgorithm={addingFieldTOTPAlgorithm}
                    changeTOTPAlgorithm={changeTOTPAlgorithm}
                    addingFieldTOTPTimeout={addingFieldTOTPTimeout}
                    changeTOTPTimeout={changeTOTPTimeout}
                />
            );
            break;
    }

    const saveClickHandler = () => {
        updateField(entryGroupId, entryId, entryGroupFieldForEditId, setEntryFieldsStatus, fieldTypeDefault);
    };
    const openModal = e => {
        if (e.target.checked) {
            // console.log('editing is opened');
            setEntryGroupFieldForEditState(FIELD_EDITING_EDITING);
        } else {
            // console.log('editing is closed');
            setEntryGroupFieldForEditState(FIELD_EDITING_AWAIT);
            changeValue('');
            changeTitle('');
            changeLogin('');
            changeTOTPAlgorithm(ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_DEFAULT);
            changeTOTPTimeout(30);
            if (fieldTypeDefault === FIELD_TYPE_PASSWORD) {
                (passwordHolder.current?.type ?? false) && (passwordHolder.current.type = 'password');
                passwordEyeCloseHolder.current.classList.add('hidden');
                passwordEyeOpenHolder.current.classList.remove('hidden');
            }
        }
    };

    return (
        <div className="px-2 pb-2">
            <input
                type="checkbox"
                id="entryFieldEditModal"
                className="modal-toggle"
                ref={modalVisibilityRef}
                onChange={openModal}
            />
            <label htmlFor="entryFieldEditModal" className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">
                        Editing field &quot;{fieldTitleDefault}&quot; for entry &quot;{entryTitle}&quot;
                    </h3>
                    <div className="py-4">
                        <div className="flex flex-row items-center py-1.5">
                            <label
                                htmlFor={'edit-field-for-' + entryId + '-title'}
                                className="inline-block basis-1/3 text-lg">
                                Field Title:
                            </label>
                            <Input
                                id={'edit-field-for-' + entryId + '-title'}
                                type="text"
                                value={addingFieldTitle}
                                onChange={e => changeTitle(e.target.value)}
                                placeholder={fieldTitleDefault}
                                className={
                                    'input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 ' +
                                    'placeholder-slate-300'
                                }
                            />
                        </div>

                        {value}

                        <div className="modal-action flex flex-row justify-around">
                            <Button
                                className={
                                    'btn-success btn-sm basis-1/3' +
                                    (entryGroupFieldForEditState === FIELD_EDITING_IN_PROGRESS ? ' loading' : '')
                                }
                                onClick={saveClickHandler}>
                                {entryGroupFieldForEditState === FIELD_EDITING_EDITING ? 'save changes' : ''}
                            </Button>

                            <label
                                htmlFor="entryFieldEditModal"
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

export default EntryFieldsEdit;
