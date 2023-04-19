import {useContext} from "react";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import EntryGroupUser from "./EntryGroupUser";

const EntryGroupUsers = () => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {entryGroupUsers} = passwordBrokerContext
    const users = []

    for (let i = 0; i < entryGroupUsers.length; i++) {
        users.push(<EntryGroupUser key={'role_' + entryGroupUsers[i].id} user={entryGroupUsers[i]} />)
    }



    return (
        <div className="overflow-x-auto">
            <table className="table w-full table-compact">
                <thead>
                <tr>
                    <th className="bg-slate-900 text-slate-200">User</th>
                    <th className="bg-slate-900 text-slate-200">Role</th>
                    <th className="bg-slate-900 text-slate-200">Updated at</th>
                </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </table>
        </div>
    )
}

export default EntryGroupUsers