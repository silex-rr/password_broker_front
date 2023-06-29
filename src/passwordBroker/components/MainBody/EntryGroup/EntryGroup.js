import Entry from "./Entry";
import EntryAdd from "./EntryAdd";
import {ROLE_CAN_EDIT} from "../../../constants/EntryGroupRole";
import EntryGroupAdd from "./EntryGroupAdd";
import {useContext} from "react";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import {EntryFieldsProvider} from "../../../contexts/EntryFieldsContext";

const EntryGroup = (props) => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        entryGroupId
    } = passwordBrokerContext

    const entries = []
    for (let i = 0; i < props.entries.length; i++) {
        entries.push(Entry (props.entries[i]))
    }
    if (entries.length === 0) {
        entries.push(<tr key="empty_group"><td colSpan="3">there are no entries</td></tr>)
    }

    // const entryGroupAddButton =

    return (
        <div className="overflow-x-auto">
            <table className="table w-full table-compact">
                <thead>
                    <tr>
                        <th className="bg-slate-900 text-slate-200">Entry title</th>
                        <th className="bg-slate-900 text-slate-200">Created at</th>
                        <th className="bg-slate-900 text-slate-200">Updated at</th>
                    </tr>
                </thead>
                <tbody>
                    <EntryFieldsProvider>
                        {entries}
                    </EntryFieldsProvider>
                </tbody>
            </table>
            {ROLE_CAN_EDIT.includes(props.role.role)
                ?
                    <div className="py-3">
                        <EntryAdd
                            entryGroupTitle = {props.entryGroup.name}
                        />

                        <EntryGroupAdd
                            entryGroupId = {entryGroupId}
                            entryGroupTitle = {props.entryGroup.name}
                            button ={<div className="btn btn-sm bg-slate-800">add new child Entry Group</div>}
                        />
                    </div>
                : ''
            }

        </div>
    )
}

export default EntryGroup