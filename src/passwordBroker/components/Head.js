import React, {useContext} from "react";
import {IdentityContext} from "../../identity/contexts/IdentityContext";
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import {
    MASTER_PASSWORD_FILLED_IN,
    MASTER_PASSWORD_INVALID,
    MASTER_PASSWORD_IS_EMPTY,
    MASTER_PASSWORD_VALIDATED
} from "../constants/MasterPasswordStates";
import {MdOutlineKey, MdOutlineKeyOff} from "react-icons/md";

const Head = () => {
    const identityContext = useContext(IdentityContext)
    const { userName } = identityContext
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const { masterPasswordState } = passwordBrokerContext
    //MdOutlineKeyOff
    let masterPasswordIcon = (<span></span>);
    switch (masterPasswordState) {
        default:
        case MASTER_PASSWORD_IS_EMPTY:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword not entered">
                    <MdOutlineKeyOff className="text-3xl mx-auto"/>
                </span>
            )
            break;
        case MASTER_PASSWORD_FILLED_IN:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword entered">
                    <MdOutlineKey className="text-yellow-300 text-3xl mx-auto"/>
                </span>
            )
            break;
        case MASTER_PASSWORD_INVALID:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword is incorrect">
                    <MdOutlineKey className="text-error text-3xl mx-auto"/>
                </span>
            )
            break;
        case MASTER_PASSWORD_VALIDATED:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword validated">
                    <MdOutlineKey className="text-green-200 text-3xl mx-auto"/>
                </span>
            )
            break;
    }

    return (
        <header className="bg-slate-700 text-slate-300 px16 w-full flex flex-row justify-between">
            <div className="flex justify-start px-5 py-2">
                <a href="/" className="btn btn-ghost normal-case text-3xl">PasswordBroker</a>
            </div>
            <nav className="flex justify-end px-5">
                <ul className="menu menu-horizontal p-0 font-bold align-middle flex self-center">
                    <li className="">
                        {masterPasswordIcon}
                    </li>
                    <li className="px-2"><span>{userName}</span></li>
                    <li className="px-2"><a href="/identity/logout">logout</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Head