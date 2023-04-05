import React, {useContext, useRef, useState} from "react";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import {ENTRY_ADDING_AWAIT, ENTRY_ADDING_IN_PROGRESS} from "../../../constants/EntryGroupEntryAddingStates";
import {Button, Input} from "react-daisyui";
import axios from "axios";
import {ENTRY_GROUP_REQUIRED_LOADING} from "../../../constants/EntryGroupStatus";
import {ENTRY_GROUP_TREES_REQUIRED_LOADING} from "../../../constants/EntryGroupTreesStatus";
import {ENTRY_GROUP_ADDING_AWAIT, ENTRY_GROUP_ADDING_IN_PROGRESS} from "../../../constants/EntryGroupAddingStates";

const EntryGroupAdd = (props) => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        baseUrl,
        hostName,
        setEntryGroupTreesStatus,
        entryGroupTreesOpened,
        setEntryGroupTreesOpened
    } = passwordBrokerContext

    const entryGroupTitleParent = props.entryGroupTitle
    const entryGroupId = props.entryGroupId

    const [addingEntryGroupState, setAddingEntryGroupState] = useState(ENTRY_GROUP_ADDING_AWAIT)
    
    const [entryGroupTitle, setEntryGroupTitle] = useState('')
    const [errorMessage, setErrorMessage] = useState("")

    const modalVisibilityCheckboxRef = useRef()

    const addNewEntry = () => {
        if (addingEntryGroupState !== ENTRY_GROUP_ADDING_AWAIT) {
            return
        }
        setAddingEntryGroupState(ENTRY_GROUP_ADDING_IN_PROGRESS)
        axios.defaults.withCredentials = true
        axios.get(hostName + "/sanctum/csrf-cookie").then(
            (response) => {
                let data = {'name': entryGroupTitle}
                if (entryGroupId) {
                    data.parent_entry_group_id = entryGroupId
                }

                axios.post(baseUrl + '/entryGroups/', data).then(
                    (response) => {
                        if (entryGroupId
                            && !entryGroupTreesOpened.includes(entryGroupId)
                        ) {
                            entryGroupTreesOpened.push(entryGroupTreesOpened)
                            setEntryGroupTreesOpened(entryGroupTreesOpened)
                        }
                        setEntryGroupTreesStatus(ENTRY_GROUP_TREES_REQUIRED_LOADING)
                        setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT)
                        modalVisibilityCheckboxRef.current.checked = false
                        setErrorMessage('')
                    },
                    (error) => {
                        let errMsg = []
                        const addFieldErrKey = 'addEntryErr_'
                        if (error.response.data.errors.name) {
                            errMsg.push(<p key={addFieldErrKey + errMsg.length}>{error.response.data.errors.name[0]}</p>);
                        }
                        if (errMsg.length) {
                            setErrorMessage(errMsg)
                        } else {
                            setErrorMessage(error.message)
                        }
                        setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT)
                    }
                )
            },
            (error) => {
                setErrorMessage(error.message)
                setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT)
            }
        )
    }

    const changeTitle = (e) => {
        setEntryGroupTitle(e.target.value)
    }

    const openModal = (e) => {
        if (e.target.checked) {
            setEntryGroupTitle('')
            setErrorMessage('')
            setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT)
        }
    }

    let addEntryKey = "add-entry-group-for-";
    let modalTitle = 'Adding new Entry Group'
    if (entryGroupId !== null) {
        modalTitle = "Adding new Entry Group to the Entry Group " + entryGroupTitleParent
    }
    return (
        <div className="px-2 inline-block">
            <label htmlFor={addEntryKey + entryGroupId}>
                {props.button}
            </label>

            <input ref={modalVisibilityCheckboxRef}
                   type="checkbox"
                   id={addEntryKey + entryGroupId}
                   className="modal-toggle"
                   onChange={openModal}/>
            <label htmlFor={addEntryKey + entryGroupId} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700 text-slate-200" htmlFor="">
                    <h3 className="text-lg font-bold">{modalTitle}</h3>
                    <div className="py-4">
                        <div className="flex flex-row py-1.5 items-center">
                            <label htmlFor={addEntryKey + entryGroupId + "-title"}
                                   className="inline-block basis-1/3 text-lg"
                            >
                                Entry Group Title:
                            </label>
                            <Input id={addEntryKey + entryGroupId + "-title"}
                                   type='text'
                                   value={entryGroupTitle}
                                   onChange={changeTitle}
                                   placeholder="type title for new field"
                                   className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                            />
                        </div>
                        <div className="flex flex-row justify-around modal-action">
                            <Button className={"btn-success btn-sm basis-1/3 " + (addingEntryGroupState === ENTRY_GROUP_ADDING_AWAIT ? '' : 'loading')}
                                    onClick={addNewEntry}>
                                {addingEntryGroupState === ENTRY_GROUP_ADDING_AWAIT ? 'add' : ''}
                            </Button>

                            <label htmlFor={addEntryKey + entryGroupId}
                                   className="btn btn-error btn-sm btn-outline right-0 basis-1/3">close</label>
                        </div>
                        {errorMessage === ''
                            ? ''
                            :
                            <div className="w-full bg-red-700 text-slate-100 text-center mt-8 py-1.5">
                                {errorMessage}
                            </div>
                        }

                    </div>
                </label>
            </label>
        </div>
    )
    
    
}

export default EntryGroupAdd