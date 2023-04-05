import {useContext, useEffect, useState} from "react";
import {PasswordBrokerContext} from "../../contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_LOADING,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING
} from "../../constants/EntryGroupStatus";
import EntryGroup from "./EntryGroup/EntryGroup";

const MainBody = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)

    let body = '';
    let head = '';

    const {
        entryGroupData,
        entryGroupId,
        entryGroupStatus,
        setEntryGroupStatus,
        loadEntryGroup
    } = passwordBrokerContext

    useEffect(() => {
        if (entryGroupStatus === ENTRY_GROUP_REQUIRED_LOADING) {
            setEntryGroupStatus(ENTRY_GROUP_LOADING)
            loadEntryGroup(entryGroupId)
        }
    }, [entryGroupStatus, entryGroupId])

    switch (entryGroupStatus) {
        case ENTRY_GROUP_LOADING:
        case ENTRY_GROUP_REQUIRED_LOADING:
            head = 'loading'
            body = ''
            break
        case ENTRY_GROUP_NOT_SELECTED:
            head = 'Select an Entry Group'
            body = ''
            break;
        case ENTRY_GROUP_LOADED:
            console.log(entryGroupData)
            head = entryGroupData.entryGroup.name
            body = <EntryGroup {...entryGroupData}/>
            break;
    }

    return (
        <div className="basis-3/4 h-full p-0 text-slate-100 bg-slate-600">
            <div className="grid grid-rows-3">
                <div className="px-5 py-3 row-span-3 text-2xl bg-slate-200 text-slate-700">{head}</div>
                <div className="p-5 row-span-3">{body}</div>
            </div>

        </div>
    )
}

export default MainBody
