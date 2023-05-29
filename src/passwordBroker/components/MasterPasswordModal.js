import React, {useContext, useState} from "react"
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import {Button, Input} from "react-daisyui";
import {MASTER_PASSWORD_FILLED_IN} from "../constants/MasterPasswordStates";

const MasterPasswordModal = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        setMasterPassword,
        masterPasswordModalVisibilityCheckboxRef,
        masterPasswordModalVisibilityErrorRef,
        masterPasswordCallback,
        setMasterPasswordCallback,
        setMasterPasswordState,
    } = passwordBrokerContext

    const [masterPasswordField, setMasterPasswordField] = useState('')

    const handleMasterPasswordField = (e) => {
        setMasterPasswordField(e.target.value)
    }

    const handleSaveMasterPassword = () => {
        setMasterPassword(masterPasswordField)
        const modalVisibilityCheckbox = masterPasswordModalVisibilityCheckboxRef.current
        modalVisibilityCheckbox.checked = false
        const masterPasswordModalVisibilityError = masterPasswordModalVisibilityErrorRef.current;
        masterPasswordModalVisibilityError.text = ''

        masterPasswordCallback(masterPasswordField)
        setMasterPasswordField('')
        setMasterPasswordCallback(() => () => {})
        setMasterPasswordState(MASTER_PASSWORD_FILLED_IN)
    }


    return (
        <div className="p-0 m-0">
            <input type="checkbox"
                   id="masterPasswordModal"
                   className="modal-toggle"
                   ref={masterPasswordModalVisibilityCheckboxRef}
                   onChange={(e) => {
                        if (e.target.checked) {
                            const masterPasswordInput = document.getElementById('masterPasswordInput');
                            const interval = setInterval(() => {
                                masterPasswordInput.focus()
                                if (document.activeElement === masterPasswordInput) {
                                    clearInterval(interval)
                                }
                            }, 50);
                        }
                   }}
            />
            <label htmlFor="masterPasswordModal" className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Enter your Master Password</h3>
                    <div className="py-4">
                        <Input id="masterPasswordInput"
                               type='password'
                               value={masterPasswordField}
                               onChange={handleMasterPasswordField}
                               placeholder="type title for new field"
                               className="input-sm input-bordered basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300 w-full"
                               onKeyUp={(event)=> {if (event.code==="Enter") {handleSaveMasterPassword()}}}
                        />
                    </div>
                    <div className="flex flex-row justify-around modal-action">
                        <Button
                            className={"btn-success btn-sm basis-1/3"}
                            onClick={handleSaveMasterPassword}
                        >remember</Button>

                        <label htmlFor="masterPasswordModal"
                               className="btn btn-error btn-sm btn-outline right-0 basis-1/3">close</label>
                    </div>
                    <div ref={masterPasswordModalVisibilityErrorRef} className="w-full bg-red-700 text-slate-100 text-center">

                    </div>

                </label>
            </label>
        </div>
    )
}

export default MasterPasswordModal