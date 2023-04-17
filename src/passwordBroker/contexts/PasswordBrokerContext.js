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


const PasswordBrokerContext = React.createContext()

const PasswordBrokerProvider = (props) => {
    const hostName = process.env.REACT_APP_PASSWORD_BROKER_HOST
    const baseUrl  = hostName + '/passwordBroker/api'

    const { entryGroupId: entryGroupIdParam } = useParams();

    const [entryGroupTrees, setEntryGroupTrees] = useState([])
    const [entryGroupTreesStatus, setEntryGroupTreesStatus] = useState(ENTRY_GROUP_TREES_REQUIRED_LOADING)
    const [entryGroupTreesOpened, setEntryGroupTreesOpened] = useState([])



    const [entryGroupData, setEntryGroupData] = useState(null)
    const [entryGroupId, setEntryGroupId] = useState('')
    const [entryGroupStatus, setEntryGroupStatus] = useState(ENTRY_GROUP_NOT_SELECTED)

    const [entryGroupMenu, setEntryGroupMenu] = useState(ENTRY_GROUP_MENU_MAIN)

    const [masterPassword, setMasterPassword] = useState('')
    const [masterPasswordState, setMasterPasswordState] = useState(MASTER_PASSWORD_IS_EMPTY)
    const [masterPasswordCallback, setMasterPasswordCallback] = useState(() => () => {})
    const masterPasswordModalVisibilityCheckboxRef = useRef()
    const masterPasswordModalVisibilityErrorRef = useRef()

    const navigate = useNavigate();

    const showMasterPasswordModal = (errorText = '') => {
        const masterPasswordModalVisibilityCheckbox = masterPasswordModalVisibilityCheckboxRef.current;
        const masterPasswordModalVisibilityError = masterPasswordModalVisibilityErrorRef.current;
        masterPasswordModalVisibilityCheckbox.checked = true
        masterPasswordModalVisibilityError.textContent = errorText
        const classList = masterPasswordModalVisibilityError.classList;
        if (errorText !== '') {
            classList.add("mt-8")
            classList.add("py-1.5")
        } else {
            classList.remove("mt-8")
            classList.remove("py-1.5")
        }
    }

    const loadEntryGroupTrees = () => {
        axios.defaults.withCredentials = true

        axios.get(baseUrl + '/entryGroupsAsTree/').then(
            (response) => {
                setEntryGroupTrees(response.data.trees)
                setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADED)
            }
        )
    }

    const selectEntryGroup = useCallback((entryGroupID) => {
        setEntryGroupId(entryGroupID)
        setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING)
        if (entryGroupIdParam !== entryGroupID) {
            navigate('/entryGroup/' + entryGroupID)
        }
    }, [setEntryGroupId, setEntryGroupStatus, entryGroupIdParam, navigate])

    const loadEntryGroup = (entryGroupID) => {
        axios.defaults.withCredentials = true

        axios.get(baseUrl + '/entryGroups/' + entryGroupID).then(
            (response) => {
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
                loadEntryGroupEntries(entryGroupID, response.data)
            }
        )
    }

    const loadEntryGroupEntries = (entryGroupID, data) => {
        axios.defaults.withCredentials = true

        axios.get(baseUrl + '/entryGroups/' + entryGroupID + '/entries').then(
            (response) => {
                data.entries = response.data
                setEntryGroupData(data)
                setEntryGroupStatus(ENTRY_GROUP_LOADED)
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
                setEntryGroupStatus: setEntryGroupStatus,
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
                setMasterPasswordState: setMasterPasswordState
            }}
        >
            {props.children}
        </PasswordBrokerContext.Provider>
    )
}

export {PasswordBrokerContext, PasswordBrokerProvider}

