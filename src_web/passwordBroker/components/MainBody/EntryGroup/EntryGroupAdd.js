import React, {useContext, useRef} from 'react';
import {Input} from 'react-daisyui';
import {ENTRY_GROUP_ADDING_AWAIT} from '../../../../../src_shared/passwordBroker/constants/EntryGroupAddingStates';
import EntryGroupContext from '../../../../../src_shared/passwordBroker/contexts/EntryGroupContext';

const EntryGroupAdd = props => {
    const {
        addNewEntryGroup: addNewEntryGroup,
        addingEntryGroupState: addingEntryGroupState,
        setAddingEntryGroupState: setAddingEntryGroupState,
        addingEntryGroupTitle: addingEntryGroupTitle,
        setAddingEntryGroupTitle: setAddingEntryGroupTitle,
        addingEntryGroupErrorMessage: addingEntryGroupErrorMessage,
        setAddingEntryGroupErrorMessage: setAddingEntryGroupErrorMessage,
    } = useContext(EntryGroupContext);
    const visibilityRef = useRef();

    const entryGroupTitleParent = props.entryGroupTitle;
    const entryGroupId = props.entryGroupId;

    const changeTitle = e => {
        setAddingEntryGroupTitle(e.target.value);
    };
    const openModal = e => {
        if (e.target.checked) {
            setAddingEntryGroupTitle('');
            setAddingEntryGroupErrorMessage('');
            setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT);
        }
    };

    const addButtonHandler = () => {
        addNewEntryGroup(entryGroupId, visibilityRef);
    };

    let addEntryKey = 'add-entry-group-for-';
    let modalTitle = 'Adding new Entry Group';
    if (entryGroupId !== null) {
        modalTitle = 'Adding new Entry Group to the Entry Group ' + entryGroupTitleParent;
    }

    const visibilityRefId = addEntryKey + (entryGroupId ? '-' + entryGroupId : '');
    return (
        <div className="inline-block px-2">
            <label htmlFor={visibilityRefId}>{props.button}</label>

            <input
                ref={visibilityRef}
                type="checkbox"
                id={visibilityRefId}
                className="modal-toggle"
                onChange={openModal}
            />
            <label htmlFor={visibilityRefId} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700 text-slate-200" htmlFor="">
                    <h3 className="text-lg font-bold">{modalTitle}</h3>
                    <div className="py-4">
                        <div className="flex flex-row items-center py-1.5">
                            <label
                                htmlFor={addEntryKey + entryGroupId + '-title'}
                                className="inline-block basis-1/3 text-lg">
                                Entry Group Title:
                            </label>
                            <Input
                                id={addEntryKey + entryGroupId + '-title'}
                                type="text"
                                value={addingEntryGroupTitle}
                                onChange={changeTitle}
                                placeholder="type title for new field"
                                className={
                                    'input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200' +
                                    ' placeholder-slate-300'
                                }
                            />
                        </div>
                        <div className="modal-action flex flex-row justify-around">
                            <span className={'btn btn-success btn-sm basis-1/3'} onClick={addButtonHandler}>
                                <span
                                    className={
                                        'loading loading-spinner' +
                                        (addingEntryGroupState === ENTRY_GROUP_ADDING_AWAIT ? ' hidden' : ' ')
                                    }
                                />
                                {addingEntryGroupState === ENTRY_GROUP_ADDING_AWAIT ? 'add' : 'adding'}
                            </span>

                            <label
                                htmlFor={addEntryKey + entryGroupId}
                                className="btn btn-outline btn-error btn-sm right-0 basis-1/3">
                                close
                            </label>
                        </div>
                        {addingEntryGroupErrorMessage === '' ? (
                            ''
                        ) : (
                            <div className="mt-8 w-full bg-red-700 py-1.5 text-center text-slate-100">
                                {addingEntryGroupErrorMessage}
                            </div>
                        )}
                    </div>
                </label>
            </label>
        </div>
    );
};

export default EntryGroupAdd;
