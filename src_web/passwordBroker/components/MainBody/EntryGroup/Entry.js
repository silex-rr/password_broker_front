import Moment from "react-moment";
import axios from "axios";
import React, {useContext, useEffect} from "react";
import {PasswordBrokerContext} from "../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_ENTRY_FIELDS_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_LOADING,
    ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING
} from "../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldsStatus";
import EntryFields from "./EntryFields";
import {EntryContext} from "../../../../../src_shared/passwordBroker/contexts/EntryContext";

const Entry = (props) => {

    const entryGroupId = props.entry_group_id
    const entryId = props.entry_id

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {baseUrl} = passwordBrokerContext

    const entryContext = useContext(EntryContext)

    const {
        entryFieldsStatus,
        setEntryFieldsStatus,
        entryFieldsData,
        setEntryFieldsData,
        entryFieldsIsVisible,
        setEntryFieldVisible
    } = entryContext

    useEffect( () => {
        if (entryFieldsStatus === ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING) {
            setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_LOADING)
            axios.defaults.withCredentials = true
            axios.get(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields').then(
                (response) => {
                    setEntryFieldsData(response.data)
                    setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_LOADED)
                }
            )
        }
    }, [entryFieldsStatus, baseUrl, entryGroupId, entryId, setEntryFieldsStatus, setEntryFieldsData]);


    const EntryFieldsVisibility = () => {
        if (entryFieldsStatus === ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED) {
            setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING)
        }
        setEntryFieldVisible(!entryFieldsIsVisible)
    }

    let entryFields = ''

    switch (entryFieldsStatus) {
        default:
            break

        case ENTRY_GROUP_ENTRY_FIELDS_LOADED:
            entryFields = (
                <EntryFields
                    fields={entryFieldsData}
                    entryGroupId={entryGroupId}
                    entryId={entryId}
                    entryTitle={props.title}
                    setEntryFieldsStatus = {setEntryFieldsStatus}
                />
            )
            break
        case ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING:
        case ENTRY_GROUP_ENTRY_FIELDS_LOADING:
        case ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED:
            entryFields = (<div className="w-full text-center p-2 bg-slate-500">Loading...</div>)
            break
    }

    return (
        <React.Fragment>
            <tr key={entryId + '_main'}>
                <td className="cursor-pointer bg-slate-700 text-slate-100" onClick={EntryFieldsVisibility}>
                    {props.title}
                </td>
                <td  className="bg-slate-700 text-slate-100">
                    <Moment format="YYYY.MM.DD HH:mm">
                        {props.created_at}
                    </Moment>
                </td>
                <td  className="bg-slate-700 text-slate-100">
                    <Moment format="YYYY.MM.DD HH:mm">
                        {props.updated_at}
                    </Moment>
                </td>
            </tr>
            <tr key={entryId + '_fields'} className={entryFieldsIsVisible ? '' : 'hidden'}>
                <td colSpan="4" className="bg-slate-700 text-slate-100 pt-0 px-0">
                    {entryFields}
                </td>
            </tr>
        </React.Fragment>
    )
}

export default Entry