import Moment from "react-moment";
import React, {useContext, useState} from "react";
import {ROLE_ADMIN, ROLE_MODERATOR} from "../../../constants/EntryGroupRole";
import {IdentityContext} from "../../../../identity/contexts/IdentityContext";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";

const EntryGroupUser = (props) => {
    const identityContext = useContext(IdentityContext)
    const {userId} = identityContext
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const [deleting, setDeleting] = useState(false)
    const {
        entryGroupId,
        removeUserFromGroup,
        entryGroupUsers,
        setEntryGroupUsers
    } = passwordBrokerContext


    const user = props.user
    const role = props.role
    const removeClickHandler = (e) => {
        if (deleting) {
            return
        }
        setDeleting(true)
        const classList = e.target.classList;
        classList.add('loading')
        e.target.innerText = 'processing'
        removeUserFromGroup(entryGroupId, user.user_id, () => {
            setEntryGroupUsers(entryGroupUsers.filter((e) => e.user.user_id !== user.user_id))
        })
    }

    let remove_td = ''
    if (role === ROLE_ADMIN
        || role === ROLE_MODERATOR
    ) {
        if (user.user_id !== userId
            && user.role !== ROLE_ADMIN
        ) {
            remove_td = (
                <td>
                    <span className="btn btn-xs btn-error btn-outline" onClick={removeClickHandler}>remove</span>
                </td>
            )
        } else {
            remove_td = (
                <td>

                </td>
            )
        }

    }

    return (
        <tr>
            <td>{user.user.name}</td>
            <td>{user.role}</td>
            <td>
                <Moment format="YYYY.MM.DD HH:mm">
                    {user.updated_at}
                </Moment>
            </td>
            {remove_td}
        </tr>
    )
}

export default EntryGroupUser