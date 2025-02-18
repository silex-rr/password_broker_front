import Entry from './Entry';
import {ROLE_CAN_EDIT} from '../../../../../src_shared/passwordBroker/constants/EntryGroupRole';
import React, {useContext} from 'react';
import EntryContextProvider from '../../../../../src_shared/passwordBroker/contexts/EntryContextProvider';
import EntryFieldContextProvider from '../../../../../src_shared/passwordBroker/contexts/EntryFieldContextProvider';
import EntryGroupEntriesBottomMenu from './EntryGroupEntriesBottomMenu';
import EntryBulkEditContext from '../../../../../src_shared/passwordBroker/contexts/EntryBulkEditContext';

const EntryGroupEntries = ({entries, entryGroup, role}) => {
    const {setMassSelectorChecked, massSelectorChecked, setCheckedEntries} = useContext(EntryBulkEditContext);
    const entryComponents = [];
    for (let i = 0; i < entries.length; i++) {
        entryComponents.push(
            <EntryContextProvider key={entries[i]?.entry_id}>
                <Entry {...entries[i]} />
            </EntryContextProvider>,
        );
    }
    if (entryComponents.length === 0) {
        entryComponents.push(
            <tr key="empty_group">
                <td colSpan="3">there are no entries</td>
            </tr>,
        );
    }

    const handleMassSelectorChange = () => {
        setMassSelectorChecked(!massSelectorChecked);
        if (!massSelectorChecked) {
            setCheckedEntries(entries.map(e => e.entry_id));
        } else {
            setCheckedEntries([]);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-compact table w-full">
                <thead>
                    <tr>
                        <th className="w-0 bg-slate-900 text-slate-200">
                            <label className="label cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={massSelectorChecked}
                                    onChange={handleMassSelectorChange}
                                />
                            </label>
                        </th>
                        <th className="bg-slate-900 text-slate-200">Entry title</th>
                        <th className="bg-slate-900 text-slate-200">Created at</th>
                        <th className="bg-slate-900 text-slate-200">Updated at</th>
                    </tr>
                </thead>
                <tbody>
                    <EntryFieldContextProvider>
                        {entryComponents.map(entryComponent => entryComponent)}
                    </EntryFieldContextProvider>
                </tbody>
            </table>
            {ROLE_CAN_EDIT.includes(role.role) ? <EntryGroupEntriesBottomMenu entryGroup={entryGroup} /> : ''}
        </div>
    );
};

export default EntryGroupEntries;
