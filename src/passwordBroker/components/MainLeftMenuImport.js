import React, {useContext, useState} from "react";
import {Button, Input} from "react-daisyui";
import axios from "axios";
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from "../constants/MasterPasswordStates";
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import {ENTRY_GROUP_TREES_REQUIRED_LOADING} from "../constants/EntryGroupTreesStatus";
import Error from "../../utils/errors/Error";
import {RiFolderDownloadFill} from "react-icons/ri";

const MainLeftMenuImport = () => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        masterPassword,
        setMasterPassword,
        setMasterPasswordCallback,
        setMasterPasswordState,
        showMasterPasswordModal,
        baseUrl,
        setEntryGroupTreesStatus
    } = passwordBrokerContext

    const [importFile, setImportFile] = useState(null)
    const [importValue, setImportValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState({message: '', errors: {}})

    const handleOpenModal = (e) => {
        if (e.target.checked) {
            setErrorMessage({message: '', errors: {}})
            setLoading(false)
            setImportFile(null)
            setImportValue('')
        }
    }
    const handleChangeFile = (e) => {
        setImportValue(e.target.value)
        setImportFile(e.target.files[0])
    }

    const handleSendButton = () => {
        if (loading) {
            return
        }
        const sendImportData = (masterPassword) => {
            setLoading(true)
            const data = new FormData();
            data.append('master_password', masterPassword)
            data.append('file', importFile)
            axios.post(baseUrl + '/import', data).then(
                (result) => {
                    setMasterPasswordState(MASTER_PASSWORD_VALIDATED)
                    setEntryGroupTreesStatus(ENTRY_GROUP_TREES_REQUIRED_LOADING)
                },
                (error) => {
                    if (error.response.data.errors.master_password) {
                        setMasterPassword('')
                        setMasterPasswordState(MASTER_PASSWORD_INVALID)
                        setMasterPasswordCallback(
                            () => (masterPassword) => {
                                sendImportData(masterPassword)
                            }
                        )
                        showMasterPasswordModal("MasterPassword is invalid")
                        return
                    }
                    setErrorMessage(error.response.data)
                }
            ).then(() => {setLoading(false)})
        }

        if (masterPassword === '') {
            setMasterPasswordCallback(
                () => (masterPassword) => {
                    sendImportData(masterPassword)
                }
            )
            showMasterPasswordModal()
        } else {
            sendImportData(masterPassword)
        }
    }

    return (
        <React.Fragment>
            <label htmlFor="importData"  className="tooltip tooltip-right" data-tip="import Data">
                <RiFolderDownloadFill className="inline-block text-4xl cursor-pointer"/>
            </label>

            <input
                type="checkbox"
                id="importData"
                className="modal-toggle"
                onChange={handleOpenModal}/>

            <label htmlFor="importData" className="modal cursor-pointer text-slate-100">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Import data from KeePass XML (2.x)</h3>
                    <div className="py-4">
                        <div className="flex flex-row py-1.5 items-center w-full">
                            <div className="flex flex-row py-1.5 items-center w-full">
                                <label htmlFor={"importData-file"}
                                       className="inline-block basis-1/3 text-lg"
                                >
                                    KeePass XML (2.x) File:
                                </label>
                                <Input
                                    id="importData-file"
                                    className="file-input file-input-bordered file-input-sm w-full basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                                    onChange={handleChangeFile}
                                    placeholder="add a file"
                                    type="file"
                                    value={importValue}/>
                            </div>
                        </div>
                        <div className="flex flex-row justify-around modal-action">
                            <Button
                                className={"btn-success btn-sm basis-1/3" + (loading ? ' loading' : '')}
                                onClick={handleSendButton}
                            >
                                {loading ? '' : 'import'}
                            </Button>

                            <label htmlFor="importData"
                                   className="btn btn-error btn-sm btn-outline right-0 basis-1/3">close</label>
                        </div>
                        {errorMessage.message === ''
                            ? ''
                            :
                            <div className="w-full bg-red-700 text-slate-100 text-center mt-8 py-1.5">
                                <Error message={errorMessage.message} errors={errorMessage.errors}/>
                            </div>
                        }

                    </div>
                </label>
            </label>
        </React.Fragment>
    )
}

export default MainLeftMenuImport