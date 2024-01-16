import React, {useContext, useRef, useState} from 'react';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_ADDING_AWAIT,
    ENTRY_ADDING_IN_PROGRESS,
} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEntryAddingStates';
import {Input} from 'react-daisyui';
import axios from 'axios';
import {ENTRY_GROUP_REQUIRED_LOADING} from '../../../../../src_shared/passwordBroker/constants/EntryGroupStatus';

const EntryAdd = props => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {baseUrl, entryGroupId, setEntryGroupStatus} = passwordBrokerContext;

    const entryGroupTitle = props.entryGroupTitle;

    const [addingEntryState, setAddingEntryState] = useState(ENTRY_ADDING_AWAIT);

    const [entryTitle, setEntryTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState([]);

    const modalVisibilityCheckboxRef = useRef();

    const addNewEntry = () => {
        if (addingEntryState !== ENTRY_ADDING_AWAIT) {
            return;
        }
        setAddingEntryState(ENTRY_ADDING_IN_PROGRESS);

        // axios.get(hostURL + "/sanctum/csrf-cookie").then(
        //     (response) => {
        axios
            .post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/', {
                title: entryTitle,
            })
            .then(
                () => {
                    setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING);
                    setAddingEntryState(ENTRY_ADDING_AWAIT);
                    const modalVisibilityCheckbox = modalVisibilityCheckboxRef.current;
                    modalVisibilityCheckbox.checked = false;
                    setErrorMessage([]);
                },
                error => {
                    let errMsg = [];
                    const addFieldErrKey = 'addEntryErr_';
                    if (error.response.data.errors.title) {
                        errMsg.push(<p key={addFieldErrKey + errMsg.length}>{error.response.data.errors.title[0]}</p>);
                    }
                    if (errMsg.length) {
                        setErrorMessage(errMsg);
                    } else {
                        setErrorMessage([error.message]);
                    }
                    setAddingEntryState(ENTRY_ADDING_AWAIT);
                },
            );
        //     },
        //     (error) => {
        //         setErrorMessage(error.message)
        //         setAddingEntryState(ENTRY_ADDING_AWAIT)
        //     }
        // )
    };

    const changeTitle = e => {
        setEntryTitle(e.target.value);
    };

    const openModal = e => {
        if (e.target.checked) {
            setEntryTitle('');
            setErrorMessage([]);
            setAddingEntryState(ENTRY_ADDING_AWAIT);
        }
    };

    let addEntryKey = 'add-entry-for-';
    return (
        <div className="inline-block px-2 pb-2">
            <label
                htmlFor={addEntryKey + entryGroupId}
                className="btn btn-sm bg-slate-800 text-slate-100 hover:text-slate-800">
                add new Entry
            </label>

            <input
                ref={modalVisibilityCheckboxRef}
                type="checkbox"
                id={addEntryKey + entryGroupId}
                className="modal-toggle"
                onChange={openModal}
            />
            <label htmlFor={addEntryKey + entryGroupId} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Adding new Entry to the Entry Group "{entryGroupTitle}"</h3>
                    <div className="py-4">
                        <div className="flex flex-row items-center py-1.5">
                            <label
                                htmlFor={addEntryKey + entryGroupId + '-title'}
                                className="inline-block basis-1/3 text-lg">
                                Entry Title:
                            </label>
                            <Input
                                id={addEntryKey + entryGroupId + '-title'}
                                type="text"
                                value={entryTitle}
                                onChange={changeTitle}
                                placeholder="type title for new field"
                                className={
                                    'input-bordered input-sm basis-2/3 bg-slate-800' +
                                    ' text-slate-200 placeholder-slate-300'
                                }
                            />
                        </div>
                        <div className="modal-action flex flex-row justify-around">
                            <span className="btn btn-success btn-sm basis-1/3" onClick={addNewEntry}>
                                <span
                                    className={
                                        'loading loading-spinner' +
                                        (addingEntryState === ENTRY_ADDING_AWAIT ? ' hidden' : ' ')
                                    }
                                />
                                {addingEntryState === ENTRY_ADDING_AWAIT ? 'add' : 'adding'}
                            </span>

                            <label
                                htmlFor={addEntryKey + entryGroupId}
                                className="btn btn-error btn-outline btn-sm right-0 basis-1/3">
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

export default EntryAdd;
