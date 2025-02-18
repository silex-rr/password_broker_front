import React, {useContext, useState} from 'react';
import EntryAdd from './EntryAdd';
import EntryGroupAdd from './EntryGroupAdd';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntriesDelete from './BottomMenuBulkActions/EntriesDelete';

const OPTION_DEFAULT = 'default';
const OPTION_MOVE_ENTRIES = 'move-entries';
const OPTION_DELETE_ENTRIES = 'delete-entries';

const EntryGroupEntriesBottomMenu = ({entryGroup}) => {
    const {entryGroupId} = useContext(PasswordBrokerContext);
    const [bulkEditSelected, setBulkEditSelected] = useState(OPTION_DEFAULT);
    const options = [
        {name: 'Move entries', value: OPTION_MOVE_ENTRIES},
        {name: 'Delete entries', value: OPTION_DELETE_ENTRIES},
    ];

    const handleMassEditChange = e => {
        setBulkEditSelected(e.target.value);
    };

    let bulkEditBody = null;

    switch (bulkEditSelected) {
        case OPTION_MOVE_ENTRIES:
            bulkEditBody = 'move entries';
            break;
        case OPTION_DELETE_ENTRIES:
            bulkEditBody = <EntriesDelete />;
            break;
    }

    return (
        <React.Fragment>
            <div className="flex flex-row bg-slate-500 pl-2 pt-2">
                <div className="tabs tabs-lifted ">
                    <div className="tab hidden" />
                    <div
                        className={
                            'tab !border-b-0 pb-2' +
                            (bulkEditSelected !== OPTION_DEFAULT
                                ? 'tab tab-active [--tab-bg:#94a3b8] [--tab-border-color:#64748b]'
                                : '')
                        }>
                        <select
                            className="select select-bordered select-xs bg-slate-800 text-slate-100"
                            onChange={handleMassEditChange}
                            value={bulkEditSelected}>
                            <option value="default" disabled className={'bg-slate-800 text-slate-100'}>
                                Bulk edit
                            </option>
                            {options.map(({name, value}) => (
                                <option key={value} value={value}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="tab hidden" />
                </div>
                <div className="flex-grow" />
                <EntryAdd entryGroupTitle={entryGroup.name} />

                <EntryGroupAdd
                    entryGroupId={entryGroupId}
                    entryGroupTitle={entryGroup.name}
                    button={
                        <div className="btn btn-xs bg-slate-800 px-8 text-slate-100 hover:text-slate-800">
                            add new child Entry Group
                        </div>
                    }
                />
            </div>
            <div
                className={
                    'bg-slate-400 px-4 py-2 text-slate-800' + (bulkEditSelected === OPTION_DEFAULT ? ' hidden' : '')
                }>
                {bulkEditBody}
            </div>
        </React.Fragment>
    );
};

export default EntryGroupEntriesBottomMenu;
