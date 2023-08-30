import {createContext, useRef} from "react";

const AppContext = createContext()

const AppProvider = (props) => {

    const masterPasswordModalVisibilityCheckboxRef = useRef()
    const masterPasswordModalVisibilityErrorRef = useRef()
    const showMasterPasswordModal = (
        errorText = ''
    ) => {
        const masterPasswordModalVisibilityCheckbox = masterPasswordModalVisibilityCheckboxRef.current
        const masterPasswordModalVisibilityError =  masterPasswordModalVisibilityErrorRef.current

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
    const closeMasterPasswordModal = () => {
        const modalVisibilityCheckbox = masterPasswordModalVisibilityCheckboxRef.current
        const masterPasswordModalVisibilityError = masterPasswordModalVisibilityErrorRef.current;
        modalVisibilityCheckbox.checked = false
        masterPasswordModalVisibilityError.text = ''
    }

    return (
        <AppContext.Provider value={{
            hostURL : process.env.REACT_APP_PASSWORD_BROKER_HOST,
            showMasterPasswordModal: showMasterPasswordModal,
            closeMasterPasswordModal: closeMasterPasswordModal,
            masterPasswordModalVisibilityCheckboxRef: masterPasswordModalVisibilityCheckboxRef,
            masterPasswordModalVisibilityErrorRef: masterPasswordModalVisibilityErrorRef
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export {AppContext, AppProvider}