import React, {useContext} from 'react';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryGroupUser from './EntryGroupUser';
import UserSearch from '../../../../identity/components/common/UserSearch';
import axios from 'axios';
import {
    ROLE_ADMIN,
    ROLE_MEMBER,
    ROLE_MODERATOR,
} from '../../../../../src_shared/passwordBroker/constants/EntryGroupRole';
// eslint-disable-next-line max-len
import {ENTRY_GROUP_USERS_REQUIRED_LOADING} from '../../../../../src_shared/passwordBroker/constants/EntryGroupUsersStatus';
import {
    MASTER_PASSWORD_INVALID,
    MASTER_PASSWORD_VALIDATED,
} from '../../../../../src_shared/passwordBroker/constants/MasterPasswordStates';

const EntryGroupUsers = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);
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
        setEntryGroupUsersStatus,
    } = passwordBrokerContext;
    const users = [];

    for (let i = 0; i < entryGroupUsers.length; i++) {
        users.push(
            <EntryGroupUser
                key={'role_' + entryGroupUsers[i].id}
                user={entryGroupUsers[i]}
                role={entryGroupData.role.role}
            />,
        );
    }

    const addUserToGroup = (user_id, role) => {
        // const user_id = e.target.getAttribute('data-user_id')
        const sendRequest = masterPasswordNew => {
            axios
                .post(baseUrl + `/entryGroups/${entryGroupId}/users/`, {
                    target_user_id: user_id,
                    role: role,
                    master_password: masterPasswordNew,
                })
                .then(
                    () => {
                        setEntryGroupUsersStatus(ENTRY_GROUP_USERS_REQUIRED_LOADING);
                        setMasterPasswordState(MASTER_PASSWORD_VALIDATED);
                    },
                    error => {
                        if (
                            error.response?.data?.errors?.master_password ||
                            error.response?.data?.message === 'Unable to read key'
                        ) {
                            setMasterPassword('');
                            setMasterPasswordState(MASTER_PASSWORD_INVALID);
                            setMasterPasswordCallback(() => sendRequest);
                            showMasterPasswordModal('MasterPassword is invalid');
                        }
                    },
                );
        };

        if (masterPassword === '') {
            setMasterPasswordCallback(masterPasswordString => sendRequest);
            showMasterPasswordModal();
        } else {
            sendRequest(masterPassword);
        }
    };

    const buttons = [];

    switch (entryGroupData.role.role) {
        default:
            break;

        case ROLE_ADMIN:
            buttons.push(user_id => {
                const onClick = () => {
                    addUserToGroup(user_id, ROLE_ADMIN);
                };
                return (
                    <span
                        key={'add_as_admin_' + user_id}
                        className="btn btn-warning btn-outline btn-xs mx-1"
                        onClick={onClick}>
                        add as Admin
                    </span>
                );
            });
            buttons.push(user_id => {
                const onClick = () => {
                    addUserToGroup(user_id, ROLE_MODERATOR);
                };
                return (
                    <span
                        key={'add_as_moderator_' + user_id}
                        className="btn btn-info btn-outline btn-xs mx-1"
                        onClick={onClick}>
                        add as Moderator
                    </span>
                );
            });
            buttons.push(user_id => {
                const onClick = () => {
                    addUserToGroup(user_id, ROLE_MEMBER);
                };
                return (
                    <span
                        key={'add_as_member_' + user_id}
                        className="btn btn-success btn-outline btn-xs mx-1"
                        onClick={onClick}>
                        add as Member
                    </span>
                );
            });
    }

    let remove_th = '';
    let add_user = '';
    if (entryGroupData.role.role === ROLE_ADMIN) {
        remove_th = <th className="bg-slate-900 text-slate-200">Remove user</th>;
        add_user = (
            <div className="mt-5 bg-slate-700 p-4">
                <h2 className="mb-2 text-xl">Add new user: </h2>
                <UserSearch buttons={buttons} />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-compact table w-full">
                <thead>
                    <tr>
                        <th className="bg-slate-900 text-slate-200">User</th>
                        <th className="bg-slate-900 text-slate-200">Role</th>
                        <th className="bg-slate-900 text-slate-200">Role set</th>
                        {remove_th}
                    </tr>
                </thead>
                <tbody>{users}</tbody>
            </table>
            {add_user}
        </div>
    );
};

export default EntryGroupUsers;
