import React, {useContext, useRef, useState} from "react";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import {ENTRY_ADDING_AWAIT, ENTRY_ADDING_IN_PROGRESS} from "../../../constants/EntryGroupEntryAddingStates";
import {Button, Input} from "react-daisyui";
import axios from "axios";
import {ENTRY_GROUP_REQUIRED_LOADING} from "../../../constants/EntryGroupStatus";

const EntryAdd = (props) => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        baseUrl,
        hostName,
        entryGroupId,
        setEntryGroupStatus,
    } = passwordBrokerContext

    const entryGroupTitle = props.entryGroupTitle

    const [addingEntryState, setAddingEntryState] = useState(ENTRY_ADDING_AWAIT)
    
    const [entryTitle, setEntryTitle] = useState('')
    const [errorMessage, setErrorMessage] = useState("")

    const modalVisibilityCheckboxRef = useRef()

    const addNewEntry = () => {
        if (addingEntryState !== ENTRY_ADDING_AWAIT) {
            return
        }
        setAddingEntryState(ENTRY_ADDING_IN_PROGRESS)
        // axios.defaults.withCredentials = true
        // axios.get(hostName + "/sanctum/csrf-cookie").then(
        //     (response) => {
                axios.post(baseUrl + '/entryGroups/' + entryGroupId + '/entries/',
                    {
                        'title': entryTitle
                    }
                ).then(
                    (response) => {
                        setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING)
                        setAddingEntryState(ENTRY_ADDING_AWAIT)
                        const modalVisibilityCheckbox =  modalVisibilityCheckboxRef.current
                        modalVisibilityCheckbox.checked = false
                        setErrorMessage('')
                    },
                    (error) => {
                        let errMsg = []
                        const addFieldErrKey = 'addEntryErr_'
                        if (error.response.data.errors.title) {
                            errMsg.push(<p key={addFieldErrKey + errMsg.length}>{error.response.data.errors.title[0]}</p>);
                        }
                        if (errMsg.length) {
                            setErrorMessage(errMsg)
                        } else {
                            setErrorMessage(error.message)
                        }
                        setAddingEntryState(ENTRY_ADDING_AWAIT)
                    }
                )
        //     },
        //     (error) => {
        //         setErrorMessage(error.message)
        //         setAddingEntryState(ENTRY_ADDING_AWAIT)
        //     }
        // )
    }

    const changeTitle = (e) => {
        setEntryTitle(e.target.value)
    }

    const openModal = (e) => {
        if (e.target.checked) {
            setEntryTitle('')
            setErrorMessage('')
            setAddingEntryState(ENTRY_ADDING_AWAIT)
        }
    }

    let addEntryKey = "add-entry-for-";
    return (
        <div className="px-2 pb-2 inline-block">
            <label htmlFor={addEntryKey + entryGroupId} className="btn btn-sm bg-slate-800">add new Entry</label>

            <input ref={modalVisibilityCheckboxRef}
                   type="checkbox"
                   id={addEntryKey + entryGroupId}
                   className="modal-toggle"
                   onChange={openModal}/>
            <label htmlFor={addEntryKey + entryGroupId} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Adding new Entry to the Entry Group "{entryGroupTitle}"</h3>
                    <div className="py-4">
                        <div className="flex flex-row py-1.5 items-center">
                            <label htmlFor={addEntryKey + entryGroupId + "-title"}
                                   className="inline-block basis-1/3 text-lg"
                            >
                                Entry Title:
                            </label>
                            <Input id={addEntryKey + entryGroupId + "-title"}
                                   type='text'
                                   value={entryTitle}
                                   onChange={changeTitle}
                                   placeholder="type title for new field"
                                   className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                            />
                        </div>
                        <div className="flex flex-row justify-around modal-action">
                            <Button
                                className={"btn-success btn-sm basis-1/3" + (addingEntryState === ENTRY_ADDING_AWAIT ? '' : ' loading')}
                                onClick={addNewEntry}
                            >
                                {addingEntryState === ENTRY_ADDING_AWAIT ? 'add' : ''}
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

export default EntryAdd