import React, {useCallback, useEffect, useRef, useState} from 'react'
import axios from "axios";
import {ENTRY_GROUP_TREES_LOADED, ENTRY_GROUP_TREES_REQUIRED_LOADING} from "../constants/EntryGroupTreesStatus";
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING
} from "../constants/EntryGroupStatus";
import {useNavigate, useParams} from "react-router-dom";
import {MASTER_PASSWORD_IS_EMPTY} from "../constants/MasterPasswordStates";
import {ENTRY_GROUP_MENU_MAIN} from "../constants/EntryGroupMenu";
import {ENTRY_GROUP_USERS_LOADED, ENTRY_GROUP_USERS_NOT_SELECTED} from "../constants/EntryGroupUsersStatus";
import {ROLE_GUEST} from "../constants/EntryGroupRole";


const PasswordBrokerContext = React.createContext()

const PasswordBrokerProvider = (props) => {
    axios.defaults.withCredentials = true

    const hostName = process.env.REACT_APP_PASSWORD_BROKER_HOST
    const baseUrl  = hostName + '/passwordBroker/api'

    const { entryGroupId: entryGroupIdParam } = useParams();

    const [entryGroupTrees, setEntryGroupTrees] = useState([])
    const [entryGroupTreesStatus, setEntryGroupTreesStatus] = useState(ENTRY_GROUP_TREES_REQUIRED_LOADING)
    const [entryGroupTreesOpened, setEntryGroupTreesOpened] = useState([])



    const [entryGroupData, setEntryGroupData] = useState(null)
    const [entryGroupRole, setEntryGroupRole] = useState(ROLE_GUEST)
    const [entryGroupUsers, setEntryGroupUsers] = useState([])
    const [entryGroupUsersStatus, setEntryGroupUsersStatus] = useState(ENTRY_GROUP_USERS_NOT_SELECTED)
    const [entryGroupId, setEntryGroupId] = useState('')
    const [entryGroupStatus, setEntryGroupStatus] = useState(ENTRY_GROUP_NOT_SELECTED)

    const [entryGroupMenu, setEntryGroupMenu] = useState(ENTRY_GROUP_MENU_MAIN)

    const [masterPassword, setMasterPassword] = useState('')
    const [masterPasswordState, setMasterPasswordState] = useState(MASTER_PASSWORD_IS_EMPTY)
    const [masterPasswordCallback, setMasterPasswordCallback] = useState(() => () => {})
    const masterPasswordModalVisibilityCheckboxRef = useRef()
    const masterPasswordModalVisibilityErrorRef = useRef()

    const navigate = useNavigate();

    let loadEntryGroupAbortController = null
    let loadEntryGroupUsersAbortController = null;

    const showMasterPasswordModal = (errorText = '') => {
        const masterPasswordModalVisibilityCheckbox = masterPasswordModalVisibilityCheckboxRef.current
        const masterPasswordModalVisibilityError = masterPasswordModalVisibilityErrorRef.current
        if (!masterPasswordModalVisibilityCheckbox.checked){
            masterPasswordModalVisibilityCheckbox.click()
        }
        masterPasswordModalVisibilityError.textContent = errorText

        const classList = masterPasswordModalVisibilityError.classList
        if (errorText !== '') {
            classList.add("mt-8")
            classList.add("py-1.5")
        } else {
            classList.remove("mt-8")
            classList.remove("py-1.5")
        }
    }

    const loadEntryGroupTrees = () => {
        // axios.defaults.withCredentials = true

        axios.get(baseUrl + '/entryGroupsAsTree/').then(
            (response) => {
                setEntryGroupTrees(response.data.trees)
                setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADED)
            }
        )
    }

    const selectEntryGroup = useCallback((entryGroupID) => {
        if (loadEntryGroupAbortController) {
            loadEntryGroupAbortController.abort()
        }
        if (loadEntryGroupUsersAbortController) {
            loadEntryGroupUsersAbortController.abort()
        }
        setEntryGroupId(entryGroupID)
        setEntryGroupUsers([])
        setEntryGroupUsersStatus(ENTRY_GROUP_USERS_NOT_SELECTED)
        setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING)
        setEntryGroupMenu(ENTRY_GROUP_MENU_MAIN)
        setEntryGroupData(null)
        if (entryGroupIdParam !== entryGroupID) {
            navigate('/entryGroup/' + entryGroupID)
        }
    }, [setEntryGroupId, setEntryGroupStatus, entryGroupIdParam, navigate,
        loadEntryGroupUsersAbortController, loadEntryGroupAbortController])

    const loadEntryGroup = (entryGroupIdForLoading) => {
        loadEntryGroupAbortController = new AbortController()

        axios.get(baseUrl + '/entryGroups/' + entryGroupIdForLoading,
            {
                signal: loadEntryGroupAbortController.signal
            }
        ).then(
            (response) => {
                loadEntryGroupAbortController = null
                const materialized_path = response.data.entryGroup.materialized_path
                const path_list = materialized_path.split('.');
                let changed = false
                for (let i = 0; i < path_list.length; i++) {
                    if (entryGroupTreesOpened.includes(path_list[i])) {
                        continue
                    }
                    entryGroupTreesOpened.push(path_list[i])
                    changed = true
                }

                if (changed) {
                    setEntryGroupTreesOpened(entryGroupTreesOpened)
                }
                loadEntryGroupEntries(entryGroupIdForLoading, response.data)
            },
            (error) => {
                console.log(error)
                loadEntryGroupAbortController = null
            }
        )
    }
    const loadEntryGroupUsers = (entryGroupIdForLoading) => {
        loadEntryGroupUsersAbortController = new AbortController();
        axios.get(baseUrl + '/entryGroups/' + entryGroupIdForLoading + '/users/',
            {signal: loadEntryGroupUsersAbortController.signal}
            ).then(
            (response) => {
                loadEntryGroupUsersAbortController = null
                setEntryGroupUsers(response.data)
                // console.log('res', response)
                setEntryGroupUsersStatus(ENTRY_GROUP_USERS_LOADED)
            },
            (error) => {
                loadEntryGroupUsersAbortController = null
                console.log(error)
            }
        )
    }

    const loadEntryGroupEntries = (entryGroupID, data) => {
        // axios.defaults.withCredentials = true

        axios.get(baseUrl + '/entryGroups/' + entryGroupID + '/entries').then(
            (response) => {
                data.entries = response.data
                setEntryGroupData(data)
                setEntryGroupRole(data.role.role)
                setEntryGroupStatus(ENTRY_GROUP_LOADED)
            }
        )
    }

    const removeUserFromGroup = (entryGroupID, userId, callback) => {
        ///entryGroups/{entryGroup:entry_group_id}/users/{user:user_id}
        axios.delete(baseUrl + `/entryGroups/${entryGroupID}/users/${userId}`).then(
            () => {
                callback()
            }
        )
    }

    useEffect(() => {
        if ( typeof entryGroupIdParam === 'string'
            && entryGroupIdParam !== ''
            && entryGroupIdParam !== entryGroupId
        ) {
            selectEntryGroup(entryGroupIdParam)
        }
    }, [entryGroupId, entryGroupIdParam, selectEntryGroup])

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
                entryGroupStatus: entryGroupStatus,
                entryGroupRole: entryGroupRole,
                setEntryGroupStatus: setEntryGroupStatus,

                entryGroupUsers: entryGroupUsers,
                setEntryGroupUsers: setEntryGroupUsers,
                entryGroupUsersStatus: entryGroupUsersStatus,
                setEntryGroupUsersStatus: setEntryGroupUsersStatus,
                loadEntryGroupUsers: loadEntryGroupUsers,

                selectEntryGroup: selectEntryGroup,
                entryGroupMenu: entryGroupMenu,
                setEntryGroupMenu: setEntryGroupMenu,
                hostName: hostName,
                baseUrl: baseUrl,
                setMasterPassword: setMasterPassword,

                masterPassword: masterPassword,
                masterPasswordModalVisibilityCheckboxRef: masterPasswordModalVisibilityCheckboxRef,
                masterPasswordModalVisibilityErrorRef: masterPasswordModalVisibilityErrorRef,
                masterPasswordCallback: masterPasswordCallback,
                setMasterPasswordCallback: setMasterPasswordCallback,
                showMasterPasswordModal: showMasterPasswordModal,
                masterPasswordState: masterPasswordState,
                setMasterPasswordState: setMasterPasswordState,
                removeUserFromGroup: removeUserFromGroup
            }}
        >
            {props.children}
        </PasswordBrokerContext.Provider>
    )
}

export {PasswordBrokerContext, PasswordBrokerProvider}

