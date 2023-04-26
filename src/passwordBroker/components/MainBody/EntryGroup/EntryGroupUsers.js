import {useContext} from "react";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import EntryGroupUser from "./EntryGroupUser";
import UserSearch from "../../../../identity/components/common/UserSearch";
import axios from "axios";
import {ROLE_ADMIN, ROLE_MEMBER, ROLE_MODERATOR} from "../../../constants/EntryGroupRole";
import {ENTRY_GROUP_USERS_REQUIRED_LOADING} from "../../../constants/EntryGroupUsersStatus";
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from "../../../constants/MasterPasswordStates";

const EntryGroupUsers = () => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        entryGroupUsers,
        entryGroupId,
        baseUrl,
        entryGroupData,
        masterPassword,
        setMasterPassword,
        setMasterPasswordCallback,
        setMasterPasswordState,
        showMasterPasswordModal,
        setEntryGroupUsersStatus
    } = passwordBrokerContext
    const users = []

    for (let i = 0; i < entryGroupUsers.length; i++) {
        users.push(<EntryGroupUser
            key={'role_' + entryGroupUsers[i].id}
            user={entryGroupUsers[i]}
            role={entryGroupData.role.role}
        />)
    }

    const addUserToGroup = (user_id, role) => {
        // const user_id = e.target.getAttribute('data-user_id')
        const sendRequest = (masterPassword) => {
            axios.post(baseUrl + `/entryGroups/${entryGroupId}/users/`, {
                target_user_id: user_id,
                role: role,
                master_password: masterPassword
            }).then(
                () => {
                    setEntryGroupUsersStatus(ENTRY_GROUP_USERS_REQUIRED_LOADING)
                    setMasterPasswordState(MASTER_PASSWORD_VALIDATED)
                },
                (error) => {
                    console.log(error)
                    if (error.response.data.errors.master_password) {
                        setMasterPassword('')
                        setMasterPasswordState(MASTER_PASSWORD_INVALID)
                        setMasterPasswordCallback((masterPassword) => sendRequest)
                        showMasterPasswordModal("MasterPassword is invalid")
                    }
                }
            )
        }

        if (masterPassword === '') {
            setMasterPasswordCallback((masterPassword) => sendRequest)
            showMasterPasswordModal()
        } else {
            sendRequest(masterPassword)
        }
    }

    const buttons = []

    switch (entryGroupData.role.role) {
        default:
            break

        case ROLE_ADMIN:

            buttons.push( (user_id) => {
                    const onClick = () => {
                        addUserToGroup(user_id, ROLE_ADMIN)
                    }
                    return (<span key={'add_as_admin_' + user_id} className="btn btn-outline btn-xs btn-warning"
                                  onClick={onClick}>add as Admin</span>)
                }
            )
            buttons.push( (user_id) => {
                    const onClick = () => {
                        addUserToGroup(user_id, ROLE_MODERATOR)
                    }
                    return (<span key={'add_as_moderator_' + user_id} className="btn btn-outline btn-xs btn-info"
                                  onClick={onClick}>add as Moderator</span>)
                }
            )
            buttons.push( (user_id) => {
                    const onClick = () => {
                        addUserToGroup(user_id, ROLE_MEMBER)
                    }
                    return (<span key={'add_as_member_' + user_id} className="btn btn-outline btn-xs btn-success"
                                  onClick={onClick}>add as Member</span>)
                }
            )
    }

    let remove_th = ''
    let add_user = ''
    if (entryGroupData.role.role === ROLE_ADMIN) {
        remove_th = <th className="bg-slate-900 text-slate-200">Remove user</th>
        add_user = (
            <div className="mt-5 p-2">
                <h3 children='mb-2'>Add new user: </h3>
                <UserSearch buttons={buttons}/>
            </div>
        )
    }




    return (
        <div className="overflow-x-auto">
            <table className="table w-full table-compact">
                <thead>
                <tr>
                    <th className="bg-slate-900 text-slate-200">User</th>
                    <th className="bg-slate-900 text-slate-200">Role</th>
                    <th className="bg-slate-900 text-slate-200">Role set</th>
                    {remove_th}
                </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </table>
            {add_user}
        </div>
    )
}

export default EntryGroupUsers