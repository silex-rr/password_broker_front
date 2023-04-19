import Moment from "react-moment";
import React from "react";

const EntryGroupUser = (props) => {
    const user = props.user
    return (
        <tr>
            <td>{user.user.name}</td>
            <td>{user.role}</td>
            <td>
                <Moment format="YYYY.MM.DD HH:mm">
                    {user.updated_at}
                </Moment>
            </td>
        </tr>
    )
}

export default EntryGroupUser