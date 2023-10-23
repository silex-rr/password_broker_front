import React, {useCallback, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    ENTRY_GROUP_TREES_LOADED,
    ENTRY_GROUP_TREES_REQUIRED_LOADING,
    ENTRY_GROUP_TREES_UPDATING,
} from '../constants/EntryGroupTreesStatus';
import {ROLE_GUEST} from '../constants/EntryGroupRole';
import {ENTRY_GROUP_USERS_LOADED, ENTRY_GROUP_USERS_NOT_SELECTED} from '../constants/EntryGroupUsersStatus';
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING,
} from '../constants/EntryGroupStatus';
import {FIELD_EDITING_AWAIT} from '../constants/EntryGroupEntryFieldEditingStates';
import {ENTRY_GROUP_MENU_MAIN} from '../constants/EntryGroupMenu';
import {MASTER_PASSWORD_FILLED_IN, MASTER_PASSWORD_IS_EMPTY} from '../constants/MasterPasswordStates';
import axios from 'axios';
import PasswordBrokerContext from './PasswordBrokerContext';
import {OfflineDatabaseService} from '../../utils/native/OfflineDatabaseService';

const PasswordBrokerContextProvider = props => {
    const AppContext = props.AppContext;
    /**
     * @var {OfflineDatabaseService} offlineDatabaseService
     */
    const offlineDatabaseService = props.offlineDatabaseService ? props.offlineDatabaseService : null;

    const {hostURL, showMasterPasswordModal} = useContext(AppContext);
    const baseUrl = hostURL + '/passwordBroker/api';

    const [entryGroupTrees, setEntryGroupTrees] = useState([]);
    const [entryGroupTreesStatus, setEntryGroupTreesStatus] = useState(ENTRY_GROUP_TREES_REQUIRED_LOADING);
    const [entryGroupTreesOpened, setEntryGroupTreesOpened] = useState([]);

    const [entryGroupData, setEntryGroupData] = useState(null);
    const [entryGroupRole, setEntryGroupRole] = useState(ROLE_GUEST);
    const [entryGroupUsers, setEntryGroupUsers] = useState([]);
    const [entryGroupUsersStatus, setEntryGroupUsersStatus] = useState(ENTRY_GROUP_USERS_NOT_SELECTED);
    const [entryGroupId, setEntryGroupId] = useState('');
    const [entryGroupStatus, setEntryGroupStatus] = useState(ENTRY_GROUP_NOT_SELECTED);

    const [entryGroupFieldForEditId, setEntryGroupFieldForEditId] = useState('');
    const [entryGroupFieldForEditDecryptedValue, setEntryGroupFieldForEditDecryptedValue] = useState('');
    const [entryGroupFieldForEditState, setEntryGroupFieldForEditState] = useState(FIELD_EDITING_AWAIT);

    const [entryGroupMenu, setEntryGroupMenu] = useState(ENTRY_GROUP_MENU_MAIN);

    const [masterPassword, setMasterPassword] = useState('');
    const [masterPasswordState, setMasterPasswordState] = useState(MASTER_PASSWORD_IS_EMPTY);
    const [masterPasswordCallback, setMasterPasswordCallback] = useState(() => () => {});

    const [moveEntryGroupMode, setMoveEntryGroupMode] = useState(false);

    const navigate = useNavigate();

    let loadEntryGroupAbortController = null;
    let loadEntryGroupUsersAbortController = null;

    const handleMoveEntryGroupMode = () => {
        setMoveEntryGroupMode(!moveEntryGroupMode);
    };

    /**
     * @param {AppToken} AppToken
     */
    const updateOfflineDatabase = AppToken => {
        axios.get(baseUrl + '/entryGroupsWithFields').then(
            response => {
                offlineDatabaseService.saveDatabaseByToken(AppToken, response).then(
                    () => {
                        console.log('offline DB saved');
                    },
                    () => {
                        console.log('offline DB saving is failed');
                    },
                );
            },
            error => {
                console.log(error);
            },
        );
    };
    /**
     * @param {AppToken} AppToken
     */
    const updateOfflineDatabaseKey = AppToken => {
        axios.get(hostURL + '/identity/api/getPrivateRsa').then(
            response => {
                offlineDatabaseService.saveKeyByToken(AppToken, response).then(
                    () => {
                        console.log('offline DB Key saved');
                    },
                    () => {
                        console.log('offline DB Key saving is failed');
                    },
                );
            },
            error => {
                console.log(error);
            },
        );
    };

    const loadEntryGroupTrees = () => {
        axios.get(baseUrl + '/entryGroupsAsTree/').then(
            response => {
                setEntryGroupTrees(response.data.trees);
                setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADED);
                // console.log(response.data.trees)
            },
            error => {
                console.log(error);
            },
        );
    };

    const selectEntryGroup = useCallback(
        entryGroupID => {
            if (loadEntryGroupAbortController) {
                loadEntryGroupAbortController.abort();
            }
            if (loadEntryGroupUsersAbortController) {
                loadEntryGroupUsersAbortController.abort();
            }
            setEntryGroupId(entryGroupID);
            setEntryGroupUsers([]);
            setEntryGroupUsersStatus(ENTRY_GROUP_USERS_NOT_SELECTED);
            setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING);
            setEntryGroupMenu(ENTRY_GROUP_MENU_MAIN);
            setEntryGroupData(null);
            // if (entryGroupIdParam !== entryGroupID) {
            navigate('/entryGroup/' + entryGroupID);
            // }
        },
        [
            setEntryGroupId,
            setEntryGroupStatus,
            // entryGroupIdParam,
            navigate,
            loadEntryGroupUsersAbortController,
            loadEntryGroupAbortController,
        ],
    );

    const loadEntryGroup = entryGroupIdForLoading => {
        loadEntryGroupAbortController = new AbortController();

        axios
            .get(baseUrl + '/entryGroups/' + entryGroupIdForLoading, {
                signal: loadEntryGroupAbortController.signal,
            })
            .then(
                response => {
                    loadEntryGroupAbortController = null;
                    const materialized_path = response.data.entryGroup.materialized_path;
                    const path_list = materialized_path.split('.');
                    let changed = false;
                    for (let i = 0; i < path_list.length; i++) {
                        if (entryGroupTreesOpened.includes(path_list[i])) {
                            continue;
                        }
                        entryGroupTreesOpened.push(path_list[i]);
                        changed = true;
                    }

                    if (changed) {
                        setEntryGroupTreesOpened(entryGroupTreesOpened);
                    }
                    loadEntryGroupEntries(entryGroupIdForLoading, response.data);
                },
                error => {
                    console.log(error);
                    loadEntryGroupAbortController = null;
                },
            );
    };
    const loadEntryGroupUsers = entryGroupIdForLoading => {
        loadEntryGroupUsersAbortController = new AbortController();
        axios
            .get(baseUrl + '/entryGroups/' + entryGroupIdForLoading + '/users/', {
                signal: loadEntryGroupUsersAbortController.signal,
            })
            .then(
                response => {
                    loadEntryGroupUsersAbortController = null;
                    setEntryGroupUsers(response.data);
                    // console.log('res', response)
                    setEntryGroupUsersStatus(ENTRY_GROUP_USERS_LOADED);
                },
                error => {
                    loadEntryGroupUsersAbortController = null;
                    console.log(error);
                },
            );
    };

    const loadEntryGroupEntries = (entryGroupID, data) => {
        axios.get(baseUrl + '/entryGroups/' + entryGroupID + '/entries').then(response => {
            data.entries = response.data;
            setEntryGroupData(data);
            setEntryGroupRole(data.role.role);
            setEntryGroupStatus(ENTRY_GROUP_LOADED);
        });
    };

    const removeUserFromGroup = (entryGroupID, userId, callback) => {
        ///entryGroups/{entryGroup:entry_group_id}/users/{user:user_id}
        axios.delete(baseUrl + `/entryGroups/${entryGroupID}/users/${userId}`).then(() => {
            callback();
        });
    };

    const moveEntryGroup = (item, target) => {
        // console.log(item, 'dropped to', target)

        if (target.materializedPath.includes(item.entryGroupId)) {
            console.log('group cannot be moved to their child group');
            return;
        }
        if (target.entryGroupId === item.pid) {
            console.log('no changes is required');
            return;
        }
        setEntryGroupTreesStatus(ENTRY_GROUP_TREES_UPDATING);

        const data = new FormData();
        if (target.entryGroupId !== '') {
            data.append('entryGroupTarget', target.entryGroupId);
        }
        data.append('_method', 'patch');
        axios.post(baseUrl + '/entryGroups/' + item.entryGroupId, data).then(
            () => {
                setEntryGroupTreesStatus(ENTRY_GROUP_TREES_REQUIRED_LOADING);
            },
            () => {},
        );
    };

    const memorizeMasterPassword = masterPasswordForMemorize => {
        setMasterPassword(masterPasswordForMemorize);
        masterPasswordCallback(masterPasswordForMemorize);
        setMasterPasswordCallback(() => () => {});
        setMasterPasswordState(MASTER_PASSWORD_FILLED_IN);
    };

    return (
        <PasswordBrokerContext.Provider
            value={{
                loadEntryGroupTrees: loadEntryGroupTrees,
                loadEntryGroup: loadEntryGroup,
                entryGroupTrees: entryGroupTrees,
                entryGroupTreesStatus: entryGroupTreesStatus,
                setEntryGroupTreesStatus: setEntryGroupTreesStatus,
                entryGroupTreesOpened: entryGroupTreesOpened,
                setEntryGroupTreesOpened: setEntryGroupTreesOpened,
                entryGroupId: entryGroupId,
                setEntryGroupId: setEntryGroupId,
                entryGroupData: entryGroupData,
                setEntryGroupData: setEntryGroupData,
                entryGroupStatus: entryGroupStatus,
                entryGroupRole: entryGroupRole,
                setEntryGroupStatus: setEntryGroupStatus,

                entryGroupFieldForEditId: entryGroupFieldForEditId,
                setEntryGroupFieldForEditId: setEntryGroupFieldForEditId,
                entryGroupFieldForEditDecryptedValue: entryGroupFieldForEditDecryptedValue,
                setEntryGroupFieldForEditDecryptedValue: setEntryGroupFieldForEditDecryptedValue,
                entryGroupFieldForEditState: entryGroupFieldForEditState,
                setEntryGroupFieldForEditState: setEntryGroupFieldForEditState,

                entryGroupUsers: entryGroupUsers,
                setEntryGroupUsers: setEntryGroupUsers,
                entryGroupUsersStatus: entryGroupUsersStatus,
                setEntryGroupUsersStatus: setEntryGroupUsersStatus,
                loadEntryGroupUsers: loadEntryGroupUsers,

                selectEntryGroup: selectEntryGroup,
                entryGroupMenu: entryGroupMenu,
                setEntryGroupMenu: setEntryGroupMenu,
                hostURL: hostURL,
                baseUrl: baseUrl,
                setMasterPassword: setMasterPassword,
                showMasterPasswordModal: showMasterPasswordModal,

                masterPassword: masterPassword,
                masterPasswordCallback: masterPasswordCallback,
                setMasterPasswordCallback: setMasterPasswordCallback,
                memorizeMasterPassword: memorizeMasterPassword,
                masterPasswordState: masterPasswordState,
                setMasterPasswordState: setMasterPasswordState,
                removeUserFromGroup: removeUserFromGroup,

                moveEntryGroup: moveEntryGroup,
                moveEntryGroupMode: moveEntryGroupMode,
                setMoveEntryGroupMode: setMoveEntryGroupMode,
                handleMoveEntryGroupMode: handleMoveEntryGroupMode,
                AppContext: AppContext,

                updateOfflineDatabase: updateOfflineDatabase,
                updateOfflineDatabaseKey: updateOfflineDatabaseKey,
            }}>
            {props.children}
        </PasswordBrokerContext.Provider>
    );
};

export default PasswordBrokerContextProvider;
