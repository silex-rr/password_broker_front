import Entry from './Entry';
import EntryAdd from './EntryAdd';
import {ROLE_CAN_EDIT} from '../../../../../src_shared/passwordBroker/constants/EntryGroupRole';
import EntryGroupAdd from './EntryGroupAdd';
import React, {useContext} from 'react';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryContextProvider from '../../../../../src_shared/passwordBroker/contexts/EntryContextProvider';
import EntryFieldContextProvider from '../../../../../src_shared/passwordBroker/contexts/EntryFieldContextProvider';

const EntryGroup = props => {
    const {entryGroupId} = useContext(PasswordBrokerContext);

    const entries = [];
    for (let i = 0; i < props.entries.length; i++) {
        entries.push(
            <EntryContextProvider key={props.entries[i].entry_id}>
                <Entry {...props.entries[i]} />
            </EntryContextProvider>,
        );
    }
    if (entries.length === 0) {
        entries.push(
            <tr key="empty_group">
                <td colSpan="3">there are no entries</td>
            </tr>,
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-compact table w-full">
                <thead>
                    <tr>
                        <th className="bg-slate-900 text-slate-200">Entry title</th>
                        <th className="bg-slate-900 text-slate-200">Created at</th>
                        <th className="bg-slate-900 text-slate-200">Updated at</th>
                    </tr>
                </thead>
                <tbody>
                    <EntryFieldContextProvider>{entries}</EntryFieldContextProvider>
                </tbody>
            </table>
            {ROLE_CAN_EDIT.includes(props.role.role) ? (
                <div className="py-3">
                    <EntryAdd entryGroupTitle={props.entryGroup.name} />

                    <EntryGroupAdd
                        entryGroupId={entryGroupId}
                        entryGroupTitle={props.entryGroup.name}
                        button={<div className="btn btn-sm bg-slate-800">add new child Entry Group</div>}
                    />
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default EntryGroup;
