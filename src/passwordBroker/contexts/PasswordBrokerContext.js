import React, {useEffect, useState} from 'react'
import axios from "axios";
import {ENTRY_GROUP_TREES_LOADED, ENTRY_GROUP_TREES_REQUIRED_LOADING} from "../constants/EntryGroupTreesStatus";
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING
} from "../constants/EntryGroupStatus";
import {useNavigate, useParams} from "react-router-dom";


const PasswordBrokerContext = React.createContext()

const PasswordBrokerProvider = (props) => {
    const hostName = process.env.REACT_APP_PASSWORD_BROKER_HOST
    const baseUrl  = hostName + '/passwordBroker/api'

    const { entryGroupId: entryGroupIdParam } = useParams();

    const [entryGroupTrees, setEntryGroupTrees] = useState([])
    const [entryGroupTreesStatus, setEntryGroupTreesStatus] = useState(ENTRY_GROUP_TREES_REQUIRED_LOADING)
    const [entryGroupTreesOpened, setEntryGroupTreesOpened] = useState([])

    const [masterPassword, setMasterPassword] = useState('')

    const [entryGroupData, setEntryGroupData] = useState(null)
    const [entryGroupId, setEntryGroupId] = useState('')
    const [entryGroupStatus, setEntryGroupStatus] = useState(ENTRY_GROUP_NOT_SELECTED)

    const navigate = useNavigate();

    useEffect(() => {
        if (entryGroupIdParam !== entryGroupId) {
            selectEntryGroup(entryGroupIdParam)
        }
    }, [entryGroupId, entryGroupIdParam])



    const loadEntryGroupTrees = () => {
        axios.defaults.withCredentials = true

        axios.get(baseUrl + '/entryGroupsAsTree/').then(
            (response) => {
                setEntryGroupTrees(response.data.trees)
                setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADED)
            }
        )
    }

    const selectEntryGroup = (entryGroupID) => {
        setEntryGroupId(entryGroupID)
        setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING)
        if (entryGroupIdParam !== entryGroupID) {
            navigate('/entryGroup/' + entryGroupID)
        }
    }

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
                console.log(materialized_path,path_list, entryGroupTreesOpened)
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
                hostName: hostName,
                baseUrl: baseUrl,
                setMasterPassword: setMasterPassword,
                masterPassword: masterPassword
            }}
        >
            {props.children}
        </PasswordBrokerContext.Provider>
    )
}

export {PasswordBrokerContext, PasswordBrokerProvider}

