import React, {useContext, useState} from 'react';
import {Input} from 'react-daisyui';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {ENTRY_GROUP_LOADED} from '../../../../../src_shared/passwordBroker/constants/EntryGroupStatus';
import {ENTRY_GROUP_EDITING_AWAIT} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEditingStates';
import EntryGroupContext from '../../../../../src_shared/passwordBroker/contexts/EntryGroupContext';
import {
    ENTRY_GROUP_DELETING_AWAIT,
    ENTRY_GROUP_DELETING_CONFIRMATION,
    ENTRY_GROUP_DELETING_IN_PROGRESS,
} from '../../../../../src_shared/passwordBroker/constants/EntryGroupDeletingStates';
import Confirmation from '../../../../common/Confirmation';

const EntryGroupSettings = () => {
    const {entryGroupId, entryGroupData, entryGroupStatus} = useContext(PasswordBrokerContext);
    const {
        updateEntryGroup,
        deleteEntryGroup,
        editingEntryGroupState,
        deletingEntryGroupState,
        setDeletingEntryGroupState,
    } = useContext(EntryGroupContext);
    const [name, setName] = useState('');

    if (entryGroupStatus !== ENTRY_GROUP_LOADED) {
        return '<div>Loading...</div>';
    }

    const changeNameHandler = name => {
        setName(name);
    };

    const updateButtonHandler = () => {
        if (
            editingEntryGroupState !== ENTRY_GROUP_EDITING_AWAIT ||
            deletingEntryGroupState !== ENTRY_GROUP_DELETING_AWAIT
        ) {
            return;
        }

        updateEntryGroup(entryGroupId, {name: name});
    };

    const deleteButtonHandler = () => {
        if (
            editingEntryGroupState !== ENTRY_GROUP_EDITING_AWAIT ||
            deletingEntryGroupState !== ENTRY_GROUP_DELETING_AWAIT
        ) {
            return;
        }

        setDeletingEntryGroupState(ENTRY_GROUP_DELETING_CONFIRMATION);
    };

    const onDeleteConfirmation = () => {
        deleteEntryGroup(entryGroupId);
    };

    const onDeleteCansel = () => {
        setDeletingEntryGroupState(ENTRY_GROUP_DELETING_AWAIT);
    };

    return (
        <React.Fragment>
            <div className="overflow-x-auto">
                <h3 className="bg-slate-900 p-2 text-lg font-bold text-slate-200">Edit Entry Group</h3>
                <div className="bg-slate-500 p-2 py-4">
                    <div className="flex flex-row items-center py-1.5">
                        <label
                            htmlFor={'edit-field-for-' + entryGroupId + '-name'}
                            className="inline-block basis-1/3 text-lg">
                            Entry Group Name:
                        </label>
                        <Input
                            id={'edit-field-for-' + entryGroupId + '-name'}
                            type="text"
                            value={name}
                            onChange={e => changeNameHandler(e.target.value)}
                            placeholder={entryGroupData?.name ?? ''}
                            className={
                                'input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 ' +
                                'placeholder-slate-300'
                            }
                        />
                    </div>
                    <div className="mt-4">
                        <div className="flex flex-row justify-between">
                            <span className={'btn btn-success btn-sm basis-1/3'} onClick={updateButtonHandler}>
                                <span
                                    className={
                                        'loading loading-spinner' +
                                        (editingEntryGroupState === ENTRY_GROUP_EDITING_AWAIT ? ' hidden' : ' ')
                                    }
                                />
                                {editingEntryGroupState === ENTRY_GROUP_EDITING_AWAIT ? 'update' : 'updating'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 overflow-x-auto">
                <h3 className="bg-slate-900 p-2 text-lg font-bold text-slate-200">Delete Entry Group</h3>
                <div className="bg-slate-500 p-2 py-4">
                    <div className="mt-4">
                        <div className="flex flex-row justify-between">
                            <span
                                className={'btn btn-error btn-sm basis-1/3 text-slate-800'}
                                onClick={deleteButtonHandler}>
                                <span
                                    className={
                                        'loading loading-spinner' +
                                        (deletingEntryGroupState !== ENTRY_GROUP_DELETING_IN_PROGRESS ? ' hidden' : ' ')
                                    }
                                />
                                {deletingEntryGroupState !== ENTRY_GROUP_DELETING_IN_PROGRESS ? 'delete' : 'deleting'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Confirmation
                id={`confirmationDeleteEntryGroup-${entryGroupId}`}
                show={deletingEntryGroupState === ENTRY_GROUP_DELETING_CONFIRMATION}
                title="Delete Entry Group"
                message={`Are you sure you want to delete ${entryGroupData.name} entry group?`}
                onConfirm={onDeleteConfirmation}
                onCancel={onDeleteCansel}
            />
        </React.Fragment>
    );
};

export default EntryGroupSettings;
