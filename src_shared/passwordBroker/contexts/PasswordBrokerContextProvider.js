import React, {useCallback, useContext, useEffect, useState} from 'react';
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
import {DATABASE_MODE_OFFLINE, DATABASE_MODE_ONLINE} from '../../identity/constants/DatabaseModeStates';
// import {OfflineDatabaseService} from '../../utils/native/OfflineDatabaseService';
import IdentityContext from '../../identity/contexts/IdentityContext';
import {
    ENTRY_SEARCH_RESULT_AWAIT,
    ENTRY_SEARCH_RESULT_LOADED,
    ENTRY_SEARCH_RESULT_LOADING,
    ENTRY_SEARCH_RESULT_REQUIRED_LOADING,
} from '../constants/EntrySearchStates';
import {searchRequestString} from '../../utils/searchRequestString';

const PasswordBrokerContextProvider = props => {
    const AppContext = props.AppContext;
    const UserApplicationContext = props.UserApplicationContext;

    const {databaseMode} = useContext(UserApplicationContext);

    /**
     * @type {OfflineDatabaseService}
     */
    const offlineDatabaseService = useContext(AppContext).offlineDatabaseService;
    const {showMasterPasswordModal} = useContext(AppContext);
    const {hostURL} = useContext(IdentityContext);
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
    const [databaseModePB, setDatabaseModePB] = useState(databaseMode);

    const [entrySearchQuery, setEntrySearchQuery] = useState('');
    const [entrySearchPerPage, setEntrySearchPerPage] = useState(20);
    const [entrySearchPage, setEntrySearchPage] = useState(1);
    const [entrySearchRequestString, setEntrySearchRequestString] = useState('');
    const [entrySearchState, setEntrySearchState] = useState(ENTRY_SEARCH_RESULT_AWAIT);
    const [entrySearchResult, setEntrySearchResult] = useState([]);

    const navigate = useNavigate();

    let loadEntryGroupAbortController = null;
    let loadEntryGroupUsersAbortController = null;

    let entrySearchAbortController = null;

    const handleMoveEntryGroupMode = () => {
        setMoveEntryGroupMode(!moveEntryGroupMode);
    };

    const handleEntrySearch = (page = 1, perPage = 20, searchQuery = '') => {
        let requireUpdate = false;
        if (page !== entrySearchPage) {
            setEntrySearchPage(page);
            requireUpdate = true;
        }
        if (perPage !== entrySearchPerPage) {
            setEntrySearchPerPage(perPage);
            requireUpdate = true;
        }
        if (searchQuery !== entrySearchQuery) {
            setEntrySearchQuery(searchQuery);
            requireUpdate = true;
        }
        if (requireUpdate) {
            if (entrySearchAbortController) {
                entrySearchAbortController.abort();
            }
            setEntrySearchState(ENTRY_SEARCH_RESULT_REQUIRED_LOADING);
        }
    };
    const getEntrySearchResult = (page = 1, perPage = 20, searchQuery = '') => {
        if (entrySearchState === ENTRY_SEARCH_RESULT_LOADING) {
            return new Promise((resolve, reject) => {
                reject('loading in progress');
            });
        }
        setEntrySearchState(ENTRY_SEARCH_RESULT_LOADING);
        setEntrySearchResult([]);

        const reqString = searchRequestString(searchQuery, page, perPage);

        if (reqString === entrySearchRequestString) {
            return new Promise(resolve => {
                setEntrySearchState(ENTRY_SEARCH_RESULT_LOADED);
                resolve(entrySearchResult);
            });
        }

        setEntrySearchRequestString(reqString);
        const url = baseUrl + `/entrySearch${reqString}`;

        return new Promise((resolve, reject) => {
            entrySearchAbortController = new AbortController();
            axios
                .get(url, {
                    signal: entrySearchAbortController.signal,
                })
                .then(
                    response => {
                        setEntrySearchState(ENTRY_SEARCH_RESULT_LOADED);
                        setEntrySearchResult(response.data);
                        resolve(response.data);
                    },
                    error => {
                        if (entrySearchState !== ENTRY_SEARCH_RESULT_REQUIRED_LOADING) {
                            setEntrySearchState(ENTRY_SEARCH_RESULT_AWAIT);
                        }
                        reject(error);
                    },
                );
        });
    };

    const loadEntryGroupTrees = useCallback(() => {
        if (databaseMode === DATABASE_MODE_OFFLINE) {
            const dataBase = offlineDatabaseService.getDataBase();
            // console.log('loadEntryGroupTrees-offline', dataBase);
            setEntryGroupTrees(dataBase.trees);
            setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADED);
            return;
        }

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
    }, [baseUrl, databaseMode, offlineDatabaseService]);

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
        const loadedGroupProcessor = data => {
            const materialized_path = data.entryGroup.materialized_path;
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
            loadEntryGroupEntries(entryGroupIdForLoading, data);
        };

        if (databaseMode === DATABASE_MODE_OFFLINE) {
            const dataBase = offlineDatabaseService.getDataBase();

            const group = dataBase.groups.find(
                groupCandidate => groupCandidate.entry_group_id === entryGroupIdForLoading,
            );
            // console.log('loadEntryGroup-offline', group);
            loadedGroupProcessor({
                entryGroup: group,
                role: group.admins[0],
            });
            return;
        }
        loadEntryGroupAbortController = new AbortController();

        axios
            .get(baseUrl + '/entryGroups/' + entryGroupIdForLoading, {
                signal: loadEntryGroupAbortController.signal,
            })
            .then(
                response => {
                    loadEntryGroupAbortController = null;
                    loadedGroupProcessor(response.data);
                    //
                    // const materialized_path = response.data.entryGroup.materialized_path;
                    // const path_list = materialized_path.split('.');
                    // let changed = false;
                    // for (let i = 0; i < path_list.length; i++) {
                    //     if (entryGroupTreesOpened.includes(path_list[i])) {
                    //         continue;
                    //     }
                    //     entryGroupTreesOpened.push(path_list[i]);
                    //     changed = true;
                    // }
                    //
                    // if (changed) {
                    //     setEntryGroupTreesOpened(entryGroupTreesOpened);
                    // }
                    // loadEntryGroupEntries(entryGroupIdForLoading, response.data);
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
        if (databaseMode === DATABASE_MODE_OFFLINE) {
            data.entries = data.entryGroup.entries;
            setEntryGroupData(data);
            setEntryGroupRole(data.role.role);
            setEntryGroupStatus(ENTRY_GROUP_LOADED);
            return;
        }
        axios.get(baseUrl + '/entryGroups/' + entryGroupID + '/entries').then(response => {
            data.entries = response.data;
            // console.log(data);
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

    useEffect(() => {
        if (![DATABASE_MODE_OFFLINE, DATABASE_MODE_ONLINE].includes(databaseMode)) {
            return;
        }
        if (databaseMode !== databaseModePB) {
            setDatabaseModePB(databaseMode);
            setEntryGroupTreesStatus(ENTRY_GROUP_TREES_REQUIRED_LOADING);
            setEntryGroupId('');
            setEntryGroupStatus(ENTRY_GROUP_NOT_SELECTED);
        }
    }, [
        databaseMode,
        databaseModePB,
        setDatabaseModePB,
        setEntryGroupTreesStatus,
        setEntryGroupId,
        setEntryGroupStatus,
    ]);

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

                entrySearchQuery: entrySearchQuery,
                entrySearchPage: entrySearchPage,
                entrySearchPerPage: entrySearchPerPage,
                entrySearchState: entrySearchState,
                entrySearchResult: entrySearchResult,
                handleEntrySearch: handleEntrySearch,
                getEntrySearchResult: getEntrySearchResult,

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
                databaseMode: databaseMode,
                offlineDatabaseService: offlineDatabaseService,
            }}>
            {props.children}
        </PasswordBrokerContext.Provider>
    );
};

export default PasswordBrokerContextProvider;
